// UserTopNav.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import UserAvatar from '../components/UserAvatar'; // Adjust the import path based on your file structure

interface UserTopNavProps {
    userName: string;
    userImage?: string; // Optional user image URL
}

const UserTopNav: React.FC<UserTopNavProps> = ({ userName, userImage }) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <UserAvatar name={userName} imageUrl={userImage}/>
                    <Typography variant="h6" sx={{ marginLeft: 2, color:'gray' }}>
                        {userName}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default UserTopNav;
