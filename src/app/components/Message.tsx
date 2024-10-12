import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface MessageProps {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    isSender?: boolean; // To differentiate between sender and receiver
}

const Message: React.FC<MessageProps> = ({ sender, content, timestamp, isSender }) => {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: isSender ? 'flex-end' : 'flex-start', 
                mb: 2 
            }}
        >
            <Paper 
                elevation={3}
                sx={{ 
                    p: 2, 
                    borderRadius: '20px', 
                    backgroundColor: isSender ? '#dcf8c6' : '#fff', 
                    maxWidth: '75%', 
                    wordWrap: 'break-word' 
                }}
            >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {sender}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {content}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    {timestamp}
                </Typography>
            </Paper>
        </Box>
    );
};

export default Message;
