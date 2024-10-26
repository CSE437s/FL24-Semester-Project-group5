import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Avatar, ListItemAvatar, InputBase, Divider, ListItemIcon, Grid2 } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

interface User {
  id: number;
  name: string;
  avatar?: string;
}
interface SidebarProps {
  onUserSelect: (userId: number) => void;
}



const Sidebar: React.FC<SidebarProps> = ({ onUserSelect }) => {
  const users = [
    { userId: 1, name: 'John Doe' },
    { userId: 2, name: 'Jane Smith' },
    { userId: 3, name: 'Alex Johnson' }
  ];
  // if the user has a previous message history with anyone, then bring up the list of users and load their chats. -> for now mock user data
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

  //from mui documentation on AppBar
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  const BorderRight = styled('div')(({ theme }) => ({
    borderRight: '1px solid #e0e0e0',
  }));
  

  return (
    // <Drawer variant="permanent" anchor="left"
    //   sx={{ width: 250, '& .MuiDrawer-paper': { width: 250 } }}>
    //   <Typography variant="h4" style={{ padding: '12px' }}>
    //     Chats
    //   </Typography>
    //   <Search>
    //     <SearchIconWrapper>
    //       <SearchIcon />
    //     </SearchIconWrapper>
    //     <StyledInputBase
    //       placeholder="Search…"
    //       inputProps={{ 'aria-label': 'search' }}
    //       sx={{padding:'20px'}}
    //     />
    //   </Search>
    //   <List>
    //     {users.map(user => (
    //       <ListItemButton key={user.userId} onClick={() =>  onUserSelect(user.userId)} style={{ cursor: 'pointer', padding: '10px' }} >
    //         <ListItem>
    //           <ListItemAvatar>
    //           <Avatar src={user.avatar} alt={user.name}>{!user.avatar && user.name.charAt(0)}</Avatar>
    //           </ListItemAvatar>
    //           <ListItemText primary={user.name} />
    //         </ListItem>
    //       </ListItemButton>
    //     ))}
    //   </List>
    // </Drawer >
    // new code
    <Grid2 size={{ xs: 3 }} component={BorderRight}>
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
      <Grid2 size={{ xs: 4 }} sx={{ padding: '10px' }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            sx={{ padding: '20px' }}
          />
        </Search>
      </Grid2>
      <Divider />
      <List>
        {users.map(user => (
          <ListItemButton key={user.userId} onClick={() => onUserSelect(user.userId)} style={{ cursor: 'pointer', padding: '10px' }} >
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} alt={user.name}>{!user.avatar && user.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
          </ListItemButton>
        ))}
      </List>
    </Grid2>

  );
};

export default Sidebar;