"use client";

import React, { useEffect, useState } from 'react';
import MessageThread from '../components/MessageThread';
import Sidebar from '../components/Sidebar';
import LandingPage from '../components/LandingPage';
import { Grid2 } from '@mui/material';



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


const MessagingPage = () => {
  const [currentMessage, setCurrentMessage] = useState<CurrentMessage[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);


  useEffect(() => {
    const fetchCurrentMessage = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/messages');
        const text = await response.text();
        if (response.ok) {
          const data = JSON.parse(text);
          setCurrentMessage(data);
        } else {
          console.error(`Error: ${response.status} - ${text}`);
        }
      } catch (error) {
        console.error('Error fetching furniture items:', error);
      }
    };

    fetchCurrentMessage();
  }, []);

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
  };

  // const filteredMessages = currentMessage.filter(msg => msg.userId === selectedUserId);

  return (
    // <div className="h-screen w-screen bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100">
      <div style={{ display: 'flex', padding: '20px', height: "100vh" }}>
        <div style={{ flexGrow: 1 }}>
          <Grid2 container spacing={2} style={{ height: "100%", flexGrow:1}}>
            <Grid2
            size={4}
            style={{
              height: "100%"}}>
              <Sidebar onUserSelect={handleUserSelect}/>
            </Grid2>
            {/* <MessageThread /> */}
            <LandingPage/>
          </Grid2>
        </div>
      </div>
    // </div>

  );
};

export default MessagingPage;