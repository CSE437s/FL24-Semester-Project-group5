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
  const dummyMessages: CurrentMessage[] = [
    { id: 1, userId: 1, sender: 'John Doe', content: 'Hey, how are you?', timestamp: '10:00 AM', isSender: false },
    { id: 2, userId: 1, sender: 'Me', content: 'I\'m good, thanks!', timestamp: '10:01 AM', isSender: true },
    { id: 3, userId: 2, sender: 'Jane Smith', content: 'Are you free to chat?', timestamp: '10:02 AM', isSender: false },
    { id: 4, userId: 2, sender: 'Me', content: 'Sure! What\'s up?', timestamp: '10:03 AM', isSender: true },
    { id: 5, userId: 3, sender: 'Alex Johnson', content: 'Are you selling any products?', timestamp:'2:00 PM', isSender:false},
  ];

  const [currentMessage, setCurrentMessage] = useState<CurrentMessage[]>(dummyMessages);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

 

  // useEffect(() => {
  //   const fetchCurrentMessage = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5001/api/messages');
  //       const text = await response.text();
  //       if (response.ok) {
  //         const data = JSON.parse(text);
  //         setCurrentMessage(data);
  //       } else {
  //         console.error(`Error: ${response.status} - ${text}`);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching furniture items:', error);
  //     }
  //   };

  //   fetchCurrentMessage();
  // }, []);

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
      <div style={{ display: 'flex', padding:'20px', height: "100vh"}}>
        <div style={{ flexGrow: 1 }}>
          <Grid2 container spacing={1} style={{ flexGrow:1, height: "100%"}}>
            <Grid2
            size={2.5}
            style={{
              height: "100%", flexGrow:1}}>
              <Sidebar onUserSelect={handleUserSelect}/>
            </Grid2>
            {selectedUserId ? (
                <MessageThread currentMessage={filteredMessages} onCloseThread={handleCloseThread} />
            ): (<LandingPage/>)}
          </Grid2>
        </div>
      </div>
    // </div>

  );
};

export default MessagingPage;