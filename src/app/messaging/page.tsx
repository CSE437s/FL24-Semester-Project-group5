"use client";

import React, { useEffect, useState } from 'react';
import Message from '../components/Message';
import SendInput from '../components/SendInput';
import Sidebar from '../components/Sidebar';
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


const MessagingPage = () =>{
    const [currentMessage, setCurrentMessage] = useState<CurrentMessage[]>([]);
    const [names, setNames] = useState<string[]>([]);


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

  return (
    <div style={{ display: 'flex', padding: '30px' }}>
      <div style={{ flexGrow: 1 }}>
        <Grid2 container spacing={2}>
            <Grid2 size={4}>
                <Sidebar/>
            </Grid2>
            <Grid2 size={8}>
                <Message
                    id={1}
                    sender={"Bob"}
                    content={"Hello!"}
                    timestamp={"10:00 AM"}
                    isSender={true}
                />
                <Grid2>
            <SendInput/>
        </Grid2>
            </Grid2>
        </Grid2>
        

        </div>
      </div>
  );
};

export default MessagingPage;