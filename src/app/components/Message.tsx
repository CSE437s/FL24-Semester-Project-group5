import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface MessageProps {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    isSender?: boolean;
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
                    borderRadius: '20px', 
                    backgroundColor: '#FFFEF8', 
                    maxWidth: '100%', 
                    wordWrap: 'break-word', 
                    padding: '20px'
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
