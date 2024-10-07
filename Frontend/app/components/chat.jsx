"use client"
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const Layout = ({children}) => {
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    // Connect to the signaling server
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    // Set up local media stream
    navigator.mediaDevices.getUserMedia({ video: false, audio: false })
      .then(stream => {
        setLocalStream(stream);
      })
      .catch(error => console.error('Error accessing media devices.', error));

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && localStream) {
      // Create a new RTCPeerConnection
      peerConnection.current = new RTCPeerConnection();

      // Add local stream tracks to the peer connection
      localStream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream);
      });

      // Handle incoming remote stream
      peerConnection.current.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
      };

      // Handle ICE candidate events
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', event.candidate);
        }
      };

      // Handle signaling events
      socket.on('offer', async (data) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('answer', answer);
      });

      socket.on('answer', async (data) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data));
      });

      socket.on('candidate', (data) => {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
      });

      // Clean up peer connection on unmount
      return () => {
        peerConnection.current.close();
      };
    }
  }, [socket, localStream]);

  return (
    <div>
      <h1>Video Chat</h1>
      <video autoPlay playsInline ref={video => video && (video.srcObject = localStream)} />
      <video autoPlay playsInline ref={video => video && (video.srcObject = remoteStream)} />
        {children}
    </div>
  );
};

export default Layout;
