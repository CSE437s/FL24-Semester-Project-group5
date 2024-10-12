import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Avatar, ListItemAvatar } from '@mui/material';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  avatar?: string;
}

// if the user has a previous message history with anyone, then bring up the list of users and load their chats. -> for now mock user data
const users = [
  { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Alex Johnson', avatar: 'https://via.placeholder.com/40' },
];

const Sidebar = () => {
  // uncomment when user IDs can be connected across pages 
  // const [users, setUsers] = useState<User[]>([]); // State to hold the users

  // // Function to fetch users from the API
  // const fetchUsers = async () => {
  //     try {
  //         // Assuming you have an API that returns users with whom the current user has had conversations
  //         const response = await axios.get('/api/messages/1'); // Replace `1` with the current user ID
  //         const fetchedUsers = response.data.map((user: any) => ({
  //             id: user.id,
  //             name: user.username
  //         }));
  //         setUsers(fetchedUsers);
  //     } catch (error) {
  //         console.error('Error fetching users:', error);
  //     }
  // };

  // // Use useEffect to call fetchUsers when the component mounts
  // useEffect(() => {
  //     fetchUsers();
  // }, []);


  return (
    <Drawer variant="permanent" anchor="left"
      sx={{ width: 250, '& .MuiDrawer-paper': { width: 250 } }}>
      <Typography variant="h4" style={{ padding: '12px' }}>
        Chats
      </Typography>
      <List>
        {users.map(user => (
          <ListItem key={user.id}>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    </Drawer >
  );
};

export default Sidebar;