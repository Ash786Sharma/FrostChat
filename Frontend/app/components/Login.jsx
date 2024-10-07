"use client"
import { useState, } from "react";
import { Box, Card, CardContent } from '@mui/material';
import LoginForm from "./LoginForm";
import VideoChat from "./VideoChat";

const Login = () => {

  const [bgcolor, setBgColor] = useState("")
  const [onsuccess, setOnSuccess] = useState(false)

    return (
        
      <Box
      sx={{
        position: "fixed",
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: bgcolor, // Apply dynamic gradient background
        transition: 'background 0.5s ease', // Smooth transition for background changes
        overflow: 'hidden', // Prevents scrolling
      }}
    >
      <>{onsuccess ? (<VideoChat/>):(<Card sx={{ width: 600, height: 550, mt: 8, textAlign: 'center', padding: 2 }}>
          <CardContent>
            <LoginForm bgColor={setBgColor} onSuccess={setOnSuccess}/>
          </CardContent>
        </Card>)}</>
        
      </Box>
      
    );
  };
  
  export default Login;