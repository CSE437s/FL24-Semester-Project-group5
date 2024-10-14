import React from 'react';
import { Avatar } from '@mui/material';

interface UserAvatarProps {
    name: string; // User's name
    imageUrl?: string; // URL of the user's profile picture (optional)
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, imageUrl }) => {
    return (
        <Avatar
            alt={name}
            src={imageUrl}
            sx={{ width: 56, height: 56}} // Set size of the avatar
        >
            {name.charAt(0)} {/* Fallback to the first letter of the name */}
        </Avatar>
    );
};

export default UserAvatar;
