"use client";

import * as React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AppBar, Box, CssBaseline, Divider, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, Button } from '@mui/material';
import { handleSignOut } from '../utils/auth/signOutHandler'; 
import Image from 'next/image';


const drawerWidth = 240;
const navItems = [
  { text: 'Furniture', href: '/furniture' }, 
  { text: 'Listings', href: '/listings' },
  { text: 'Profile', href: '/profile' },
  { text: 'Messages', href: '/messages' },
  { text: 'Login', href: '/login' },   
  { text: 'Sign Out', href: '#' }
];

export default function DrawerAppBar(props: { window?: () => Window }) {

  const { data: session } = useSession();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const filteredItems = navItems.filter(item => {
    if (item.text === 'Login' && session) return false;   
    if (item.text === 'Sign Out' && !session) return false; 
    if ((item.text === 'Profile' || item.text === 'Messages') && !session) return false;
    return true;
  });

  const isAdmin = session?.user?.email === 'subletify@wustl.edu';

  if (isAdmin) {
    filteredItems.push({ text: 'Admin', href: '/admin' });
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Subletify
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.href} passHref>
              <ListItemButton sx={{ textAlign: 'center' }} onClick={item.text === 'Sign Out' ? handleSignOut : undefined}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box className="flex h-20" >
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Image
              src="/images/favicon.png"
              alt="Subletify Logo"
              width={40} 
              height={40} 
              priority
              style={{ marginRight: 8, filter: 'brightness(0) invert(1)' }}
              />
            <Typography
              variant="h6"
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Subletify
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {filteredItems.map((item) => (
              <Button key={item.text} sx={{ color: '#fff' }} onClick={item.text === 'Sign Out' ? handleSignOut : undefined}>
                {item.text === 'Sign Out' ? item.text : (
                  <Link href={item.href} passHref>
                    {item.text}
                  </Link>
                )}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}
