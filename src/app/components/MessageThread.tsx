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
    currentMessage?: CurrentMessage[];
}

const MessageThread: React.FC<MessageThreadProps> = ({ currentMessage }) => {
    return (
                <Grid2 size={8} style={{ display: 'flex', flexDirection: 'column', height:"100%"}}>
                <Box>
                    <div style={{ flexGrow: 1, overflowY: "auto"}}>
                        {/* {currentMessage.map((msg)=>( */}
                        <Message
                            key={1}
                            id={1}
                            sender={'Me'}
                            content={"Hello! Is this item currently for sale?"}
                            timestamp={'10:00 AM'}
                            isSender={true}
                        />
                        {/* ))} */}
                    </div>
                    <div style={{ padding: "10px", paddingBottom: "20px", borderTop: "1px solid #ccc" }}>
                        <SendInput />
                    </div>
                </Box>
                </Grid2>

    );
};

export default MessageThread;