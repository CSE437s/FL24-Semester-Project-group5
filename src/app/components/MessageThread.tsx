import React, { useEffect, useState } from 'react';
import Message from '../components/Message';
import SendInput from '../components/SendInput';
import { Grid2, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';



interface CurrentMessage {
    id: number;
    userId: number;
    sender: string;
    content: string;
    timestamp: string;
    isSender: boolean;
}

interface MessageThreadProps {
    currentMessage: CurrentMessage[];
    onCloseThread: () => void;
    handleMessageChange: (e) => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ currentMessage, onCloseThread, handleMessageChange }) => {
    return (
        <Grid2 
        size={8} 
        style={{ display: 'flex', flexDirection: 'column'}}
        >
            <Grid2 
            style={{display:'flex', justifyContent: 'right'}}
            >
                <CloseIcon onClick={onCloseThread}
                style={{ cursor: 'pointer', color: 'gray', paddingBottom: '5px' }} 
                titleAccess="Close thread"/>
            </Grid2>
            <Box style={{flexGrow:1, display:'flex', flexDirection:'column'}}>
                <div style={{ flexGrow: 1, overflowY:'auto'}}>
                    {currentMessage.map((msg) => (
                        <Message
                            key={msg.id}
                            id={msg.userId}
                            sender={msg.sender}
                            content={msg.content}
                            timestamp={msg.timestamp}
                            isSender={msg.isSender}
                        />
                    ))}
                </div>
                <div 
                // style={{paddingBottom: "20px", borderTop: "1px solid #ccc" }}
                >
                    <SendInput />
                </div>
            </Box>
        </Grid2>

    );
};

export default MessageThread;