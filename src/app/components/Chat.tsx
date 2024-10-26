import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Paper, Grid2, Divider, TextField, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, ListItemButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatSection = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '80vh',
}));

const MessageArea = styled(List)(({ theme }) => ({
  height: '70vh',
  overflowY: 'auto',
}));

const BorderRight = styled('div')(({ theme }) => ({
  borderRight: '1px solid #e0e0e0',
}));

const Chat = () => {
  return (
    <div>
      <Grid2 container>
        <Grid2 size={{xs: 4}}>
          <Typography variant="h5" className="header-message">Chat</Typography>
        </Grid2>
      </Grid2>
      <Grid2 container component={ChatSection}>
{/* holds all the chat stuff */}

        <Grid2 size={{xs:3}} component={BorderRight}>
            {/* this is the chatuser navigation panel */}
          <List>
            <ListItemButton key="RemySharp">
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
              </ListItemIcon>
              <ListItemText primary="John Wick" />
            </ListItemButton>
          </List>
          <Divider />
          <Grid2 size={{xs: 4}} sx={{ padding: '10px' }}>
            <TextField id="search" label="Search" variant="outlined" fullWidth />
          </Grid2>
          <Divider />
          <List>
            <ListItemButton key="RemySharp">
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
              </ListItemIcon>
              <ListItemText primary="Remy Sharp" secondary="online" />
            </ListItemButton>
            <ListItemButton key="Alice">
              <ListItemIcon>
                <Avatar alt="Alice" src="https://material-ui.com/static/images/avatar/3.jpg" />
              </ListItemIcon>
              <ListItemText primary="Alice" />
            </ListItemButton>
            <ListItemButton key="CindyBaker">
              <ListItemIcon>
                <Avatar alt="Cindy Baker" src="https://material-ui.com/static/images/avatar/2.jpg" />
              </ListItemIcon>
              <ListItemText primary="Cindy Baker" />
            </ListItemButton>
          </List>
        </Grid2>


        <Grid2 size={{xs:9}}>
            {/* chatbox area */}
          <MessageArea>
            <ListItem key="1">
              <Grid2 container>
                <Grid2 size={{xs: 4}}>
                  <ListItemText sx={{display:"flex" alignContent:"right"}} primary="Hey man, What's up?" />
                </Grid2>
                <Grid2 size={{xs: 4}}>
                  <ListItemText sx={{alignContent: right}} secondary="09:30" />
                </Grid2>
              </Grid2>
            </ListItem>
            <ListItem key="2">
              <Grid2 container>
                <Grid2 size={{xs: 4}}>
                  <ListItemText sx={{display:'flex', justifyContent:'right'}} primary="Hey, I am Good! What about you?" />
                </Grid2>
                <Grid2 size={{xs: 4}}>
                  <ListItemText sx={{display:'flex', justifyContent:'right'}} secondary="09:31" />
                </Grid2>
              </Grid2>
            </ListItem>
            <ListItem key="3">
              <Grid2 container>
                <Grid2 size={{xs: 4}}>
                  <ListItemText sx={{display:'flex', justifyContent:"left"}} primary="Cool. I am good, let's catch up!" />
                </Grid2>
                <Grid2 size={{xs: 4}}>
                  <ListItemText sx={{display:'flex', justifyContent:"left"}} secondary="10:30" />
                </Grid2>
              </Grid2>
            </ListItem>
          </MessageArea>
            {/* send input area  */}
          <Divider />
          <Grid2 container sx={{ padding: '20px' }}>
            <Grid2 size={{xs:11}}>
              <TextField id="message" label="Type Something" fullWidth />
            </Grid2>
            <Grid2 size={{xs:1}} sx={{display:'flex', justifyContent:"right"}}>
              <Fab color="primary" aria-label="send">
                <SendIcon />
              </Fab>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Chat;
