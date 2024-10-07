"use client";
import { useState } from "react";
import { Box, Card, CardContent, IconButton, TextField } from "@mui/material";
import { Send } from "@mui/icons-material"; // Icon for the send button

const VideoChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (currentMessage) {
      setMessages([...messages, currentMessage]);
      setCurrentMessage(""); // Clear the input field after sending
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        mt:8,
        width: "99vw",
        height: "91vh",
        backdropFilter: "blur(10px)", // Glass look
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
        border: "1px solid rgba(255, 255, 255, 0.5)", // Semi-transparent border
        borderRadius: 5,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", // Soft shadow for 3D effect
      }}
    >

      {/* Remote Video Stream */}
      <Box
        component="video"
        autoPlay
        muted
        sx={{
          m: 1,
          width: "70%",
          height: "98%",
          borderRadius: 3,
          objectFit: "cover",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Adds shadow for the local stream
        }}
      >
        {/* Here you'd set up the remote video stream source */}
      </Box>

      {/* Local Video Stream */}
      <Box
        component="video"
        autoPlay
        muted
        sx={{
          position: "absolute",
          bottom: "4%",
          right: "31%",
          width: "200px",
          height: "150px",
          borderRadius: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Adds shadow for the local stream
        }}
      >
        {/* Here you'd set up the local video stream source */}
      </Box>

      {/* Chat Box */}
      <Box
        sx={{
          position: "absolute",
          bottom: "0%",
          right: "0%",
          width: "30%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 2,
          justifyContent: "space-between",
        }}
      >
        {/* Message Display */}
        <Box
          sx={{
            height: "80%",
            flex: 1,
            overflowX: "auto",
            padding: 1,
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.4)", // Semi-transparent border
            backgroundColor: "rgba(255, 255, 255, 0.1)", // Further transparency for chat area
            marginBottom: 1,
          }}
        >
          {messages.map((msg, index) => (
            <Box key={index} sx={{ marginBottom: 1, color: "white" }}>
             {msg}
            </Box>
          ))}
        </Box>

        {/* Input and Send Button */}
        <Box sx={{width: "95%", display: "flex", alignItems: "center" }}>
          <TextField
            multiline
            rows={6}
            variant="standard"
            fullWidth
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            sx={{
              p: 1,
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.3)", // Slight background for input
              borderRadius: 1,
              mr: 2,
            }}
          />
          <IconButton onClick={handleSendMessage} color="primary" >
            <Send sx={{fontSize: 40, color: "black"}}/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoChat;
