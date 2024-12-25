import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export const Sidebar = () => (
  <Box
    sx={{
      width: '250px',
      bgcolor: '#f5f5f5',
      p: 2,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Avatar alt="User" src="/user-avatar.jpg" sx={{ mb: 2 }} />
    <List>
      <ListItem button>
        <ListItemAvatar>
          <Avatar>
            <HomeIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Home" />
      </ListItem>
    </List>
  </Box>
);

export const Header = () => (
  <Box
    sx={{
      p: 2,
      bgcolor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 1,
    }}
  >
    <Typography variant="h6">Dashboard</Typography>
    <Avatar alt="User" src="/user-avatar.jpg" />
  </Box>
);
