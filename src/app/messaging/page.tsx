"use client";

import React, { useEffect, useState } from 'react';
// import { socket } from './socket';
import io from 'socket.iO-client'
import MessageThread from '../components/MessageThread';
import Sidebar from '../components/Sidebar';
import LandingPage from '../components/LandingPage';
import { Grid2, Paper } from '@mui/material';
// used for grabbing auth
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getToken } from 'next-auth/jwt';
import { styled } from '@mui/material/styles';

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
    { id: 1, userId: 1, sender: 'John Doe', content: 'Hello, I am looking to sublease your apartment', timestamp: '10:00 AM', isSender: false },
    { id: 2, userId: 1, sender: 'Me', content: 'Of course, do you have any questions?', timestamp: '1:01 PM', isSender: true },
    { id: 4, userId: 2, sender: 'Me', content: 'Hello, I want to buy the lamp that you listed. Are you willing to sell for $10?', timestamp: '1 PM', isSender: true },
    { id: 3, userId: 2, sender: 'Jane Smith', content: 'No, the listing says $25.', timestamp: '2 PM', isSender: false },
  
    { id: 5, userId: 3, sender: 'Alex Johnson', content: 'Are you selling any products?', timestamp: '2:00 PM', isSender: false },
  ];

  const [currentMessage, setCurrentMessage] = useState<CurrentMessage[]>(dummyMessages);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleUserAuth = async () => {
    if (status === 'unauthenticated') {
      const res = confirm("You must be logged in to send a message.");
      if (res) {
        router.push('/login');
      }
    } else {
      const session = await getSession();
      const token = getToken; //check this line & the jwt import
    }
  }
  useEffect(() => {
    handleUserAuth();

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
    //     console.error('Error fetching furniture items:', error);
    //   };

    // }
    // fetchCurrentMessage();
  }, [status]);
  //socket server side
  //   function onConnect() {
  //     setIsConnected(true);
  //   }
  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }
  //   io.on('connect', onConnect);
  // io.on('disconnect', onDisconnect);

  // return () => {
  //   io.off('connect', onConnect);
  //   io.off('disconnect', onDisconnect);
  // };


  const handleUserSelect = (userId: number) => {
    console.log(userId, "it clicked!");
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
      {/* <Grid2 container>
      </Grid2> */}
      <Grid2 container component={ChatSection}>
        <Sidebar onUserSelect={handleUserSelect} />
        {selectedUserId ? (
          <MessageThread currentMessage={filteredMessages} onCloseThread={handleCloseThread} />
        ) : (<LandingPage />)}
      </Grid2>
    </div>
  );
};

export default MessagingPage;