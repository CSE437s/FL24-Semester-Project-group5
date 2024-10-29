import React from 'react';
import { Box, Typography, Paper, List, Grid2, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MessageProps {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    isSender?: boolean;
}

const MessageArea = styled(List)(({ theme }) => ({
    height: '10vh',
    overflowY: 'auto',
}));

const Message: React.FC<MessageProps> = ({ sender, content, timestamp, isSender }) => {
    return (
        <Box
            sx={{
                display: 'flex', flexDirection: 'row',
                justifyContent: isSender ? 'flex-end' : 'flex-start',
                mb: 2
            }}
        >

            <Grid2 size={{ xs: 9 }} sx={{
                display: 'flex', 
                justifyContent: isSender ? 'flex-end' : 'flex-start',
                mb: 2
            }}>
                <MessageArea>
                    <ListItem>
                        <Grid2 container>
                            <Grid2 size={{ xs: 4 }}>
                                <ListItemText secondary={sender} />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <ListItemText primary={content} />
                            </Grid2>

                            <Grid2 size={{ xs: 4 }}>
                                <ListItemText secondary={timestamp} />
                            </Grid2> 
                        </Grid2>
                    </ListItem>
                </MessageArea>
            </Grid2>
        </Box>
    );
};


export default Message;
