const { app, sessionMiddleware } = require("./app");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const connectDatabase = require("./config/database");



//Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.error("UncaughtException at :", err.stack || err);
  console.log(`Error: ${err.messege}`);
  console.log("shutting down the server due to uncaught Exception ");
  process.exit(1);
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/config.env" });
}
//connecting to database
connectDatabase();

// Server
const server = http.createServer(app);
const io = socketIO(server);

// Make session available to Socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

const activeUsers = {};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  const session = socket.request.session;

  // Add the user to the active users list
  activeUsers[socket.id] = session.userId || socket.id;
  console.log('Active Users after connection:', activeUsers);

  // Event to find a pair
  socket.on('find-pair', () => {
    const availableUser = Object.keys(activeUsers).find(id => id !== socket.id);

    if (availableUser) {
      console.log('Pair found:', socket.id, availableUser);

      // Pair the users
      io.to(socket.id).emit('pair-found', availableUser);
      io.to(availableUser).emit('pair-found', socket.id);

      // Store the partner's ID in the session for both users
      session.partnerId = availableUser;
      socket.request.session.save();  // Save session for user 1

      const partnerSocket = io.sockets.sockets.get(availableUser);
      if (partnerSocket) {
        partnerSocket.request.session.partnerId = socket.id;
        partnerSocket.request.session.save();  // Save session for user 2
      }

      // Remove paired users from the active list
      delete activeUsers[socket.id];
      delete activeUsers[availableUser];
    } else {
      // No pair found, wait for another user to connect
      io.to(socket.id).emit('waiting', 'Waiting for a pair...');
    }
  });

  socket.on('offer', (data, partnerId) => {
    io.to(partnerId).emit('offer', data);
  });

  socket.on('answer', (data, partnerId) => {
    io.to(partnerId).emit('answer', data);
  });

  socket.on('candidate', (data, partnerId) => {
    io.to(partnerId).emit('candidate', data);
  });

  // Event to handle messages between paired users
  socket.on('message', async (msg) => {
    const partnerId = session.partnerId;
    
    if (partnerId) {
      // Save the message to the database
      const newMessage = new Message({
        senderId: socket.id,
        message: msg
      });
      await newMessage.save();

      // Send the message to the paired user
      io.to(partnerId).emit('message', {
        sender: socket.id,
        message: msg
      });
    } else {
      console.log('No partner found for this session');
    }
  });

  socket.on('disconnect', () => { 
    console.log('User disconnected:', socket.id);
    delete activeUsers[socket.id];
  });
});

const messageSchema = new mongoose.Schema({
  roomId: String,
  senderId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);


server.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection at:", err.stack || err);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

