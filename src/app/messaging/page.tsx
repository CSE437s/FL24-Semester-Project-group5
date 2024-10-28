"use client";

import React, { useEffect, useState, useRef } from 'react';
// import { socket } from './socket';
import { io, Socket } from 'socket.io-client'
import MessageThread from '../components/MessageThread';
import Sidebar from '../components/Sidebar';
import LandingPage from '../components/LandingPage';
import { Grid2, Paper } from '@mui/material';
// used for grabbing auth
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getToken } from 'next-auth/jwt';
import { styled } from '@mui/material/styles';

import Script from 'next/script';

interface CurrentMessage {
  id: number;
  userId: number;
  sender: string;
  content: string;
  timestamp: string;
  isSender: boolean;
}

interface Sidebar {
  id: number;
  name: string;
}

const ChatSection = styled(Paper)(({ theme }) => ({
  display: 'flex',
  padding: '20px',
  height: '85vh', //change this if there are issues with scrolling 
}));

const MessagingPage = () => {
  const dummyMessages: CurrentMessage[] = [
    { id: 1, userId: 1, sender: 'John Doe', content: 'Hey, how are you?', timestamp: '10:00 AM', isSender: false },
    { id: 2, userId: 1, sender: 'Me', content: 'I\'m good, thanks!', timestamp: '10:01 AM', isSender: true },
    { id: 3, userId: 2, sender: 'Jane Smith', content: 'Are you free to chat?', timestamp: '10:02 AM', isSender: false },
    { id: 4, userId: 2, sender: 'Me', content: 'Sure! What\'s up?', timestamp: '10:03 AM', isSender: true },
    { id: 5, userId: 3, sender: 'Alex Johnson', content: 'Are you selling any products?', timestamp: '2:00 PM', isSender: false },
  ];

  const { data: session, status } = useSession();
  // const [currentMessage, setCurrentMessage] = useState<CurrentMessage[]>([]);
  const [currentChat, setCurrentChat] = useState({ chatName: "none", recieverId: "" })
  const [currentMessage, setCurrentMessage] = useState(""); //similar to message in the video
  const [connected, setConnected] = useState(false);
  const [connectedRooms, setConnectedRooms] = useState([""]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allUsers, setallUsers] = useState([]);
  const socketRef = useRef();
  const router = useRouter();

  function handleMessageChange (e){
    setCurrentMessage(e.target.value);
  };
  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'unauthenticated') {
        const res = confirm("You must be logged in to send a message.");
        if (res) {
          router.push('/login');
        }
      } else {
        // const session = await getSession(); -> would we still use a session?
        setIsAuthenticated(true);
      }
    }; checkAuth();
  }, [status]);

  useEffect(() => {
    const socket = io();
    socket.on('connect', () => {
      setConnected(true)
      console.log('Connected to server');
    });
    socket.on('connect_error', (error) => {
      setConnected(false)
      console.error('Failed to connect:', error);
    });

    return () => {
      socket.disconnect();
    };
  });



  // const fetchCurrentMessage = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5001/api/messages');
  //     const text = await response.text();
  //     if (response.ok) {
  //       const data = JSON.parse(text);
  //       setCurrentMessage(data);
  //     } else {
  //       console.error(`Error: ${response.status} - ${text}`);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   };

  // }
  // fetchCurrentMessage();



  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
  };
  const handleCloseThread = () => {
    setSelectedUserId(null); // Close the message thread
  };

  const filteredMessages = currentMessage.filter(msg => msg.userId === selectedUserId);
  console.log(filteredMessages);

  return (
    // <div className="h-screen w-screen bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100">
    <div>
      <Script src="/socket.io/socket.io.js" strategy="beforeInteractive" />
      {/* <Grid2 container>
      </Grid2> */}
      {connected && isAuthenticated ? (
        <Grid2 container component={ChatSection}>
          <Sidebar onUserSelect={handleUserSelect} />
          {selectedUserId ? (
            <MessageThread currentMessage={filteredMessages} onCloseThread={handleCloseThread} handleMessageChange = {handleMessageChange}/>
          ) : (<LandingPage />)}
        </Grid2>
      ) : (null //show an empty page or a different page?
      )}
    </div>
  );


};

export default MessagingPage;