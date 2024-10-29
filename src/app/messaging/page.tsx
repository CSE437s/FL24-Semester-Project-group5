"use client";

import React, { useEffect, useState, useRef } from 'react';
import {current, produce} from "immer";
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

interface Message {
  // id: number;
  // userId: number;
  sender: string;
  content: string;
  // timestamp: string;
  // isSender: boolean;
}
type MessagesState = {
  [chatName: string]: Message[];
};

interface Sidebar {
  id: number;
  name: string;
}

const ChatSection = styled(Paper)(({ theme }) => ({
  display: 'flex',
  padding: '20px',
  height: '85vh', //change this if there are issues with scrolling 
}));
const initialMessagesState: MessagesState = {};

const MessagingPage = () => {
  // const dummyMessages: MessagesState[] = [
  //   { id: 1, userId: 1, sender: 'John Doe', content: 'Hey, how are you?', timestamp: '10:00 AM', isSender: false },
  //   { id: 2, userId: 1, sender: 'Me', content: 'I\'m good, thanks!', timestamp: '10:01 AM', isSender: true },
  //   { id: 3, userId: 2, sender: 'Jane Smith', content: 'Are you free to chat?', timestamp: '10:02 AM', isSender: false },
  //   { id: 4, userId: 2, sender: 'Me', content: 'Sure! What\'s up?', timestamp: '10:03 AM', isSender: true },
  //   { id: 5, userId: 3, sender: 'Alex Johnson', content: 'Are you selling any products?', timestamp: '2:00 PM', isSender: false },
  // ];

  const { data: session, status } = useSession();
  // const [currentMessage, setMessage] = useState<CurrentMessage[]>([]);
  const [username, setUsername] =  useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState({ chatName: "none", recieverId: "" })
  const [message, setMessage] = useState(""); //similar to message in the video
  const [messages, setMessages] = useState<MessagesState>(initialMessagesState);
  const [connected, setConnected] = useState(false);
  const [connectedRooms, setConnectedRooms] = useState([""]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allUsers, setallUsers] = useState([]);
  const socketRef = useRef<Socket | null>(null); 
  const router = useRouter();

  function handleMessageChange (e: React.ChangeEvent<HTMLInputElement>){
    setMessage(e.target.value);
  };
  function sendMessage(){
    const payload = {
      content: message,
      to: currentChat.recieverId, 
      sender: username,
      chatName: currentChat.chatName
    };
    socketRef.current.emit("send message", payload); 
    const newMessages = produce(messages, draft => {
      if (!draft[currentChat.chatName]) {
        draft[currentChat.chatName] = []; // Initialize the array if it doesn’t exist
      }
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
      });
    });
    setMessages(newMessages);
  }

  function roomJoinCallback(incomingMessages, room){
    const newMessages = produce(messages, draft =>{
      draft[room] = incomingMessages;
    });
    setMessages(newMessages);
  }

  function joinRoom(room){
    const newConnectedRooms = produce(connectedRooms, draft =>{
      draft.push(room);
    });
    socketRef.current.emit("join room", room, (messages) => roomJoinCallback(messages, room));
    setConnectedRooms(newConnectedRooms);
  }

  function toggleChat(currentChat) { //deals with sidebar logic
    if (!messages[currentChat.chatName]){
      const newMessages = produce(messages, draft => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }

  const connect = () => {
    if (socketRef.current) return; // Prevent multiple connections

    socketRef.current = io();
    
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join server', { username });
      socketRef.current.emit('join room ', "", (messages) => roomJoinCallback(messages, ""));
      socketRef.current.on('new user', allUsers => {
        setallUsers(allUsers);
      });
      socketRef.current.on("new message", ({content, sender, chatName}) =>{
        setMessages(messages => {
          const newMessages = produce(messages, draft => {
            if (draft[chatName]){
              draft[chatName].push({content, sender});
            }else {
              draft[chatName] = [{content, sender}];
            }
          });
          return newMessages;
        });
      });
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Failed to connect:', error);
    });
  };

  useEffect(()=>{
    setMessage("");
  }, [messages]);

  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'unauthenticated') {
        setUsername(null);
        const res = confirm("You must be logged in to send a message.");
        if (res) {
          router.push('/login');
        }
      } else if(status === 'authenticated' && session?.user){
        setIsAuthenticated(true);
        setUsername(session.user.name ?? null);
        connect();
      }
    }; checkAuth();
  }, [session, status, router]);

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
  //       setMessage(data);
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

  const filteredMessages = initialMessagesState.filter(msg => msg.userId === selectedUserId);
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
            <MessageThread 
            currentMessage={filteredMessages} 
            onCloseThread={handleCloseThread} 
            handleMessageChange = {handleMessageChange}
            sendMessage={sendMessage}
            joinRoom ={joinRoom}
            toggleChat = {toggleChat}
            />
          ) : (<LandingPage />)}
        </Grid2>
      ) : (null //show an empty page or a different page?
      )}
    </div>
  );


};

export default MessagingPage;