const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error");

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "./config/config.env" });
  }

const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Session middleware
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 3600000 } // 1 hour
});

app.use(sessionMiddleware);
//Routes imports

//app.use("/api/v1", user);
//app.use(express.static(path.join(__dirname, "../frontend/build")));

//app.get("*", (req, res) => {
//  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
//});

//Middleware for errors
app.use(errorMiddleware);

module.exports = { app, sessionMiddleware };