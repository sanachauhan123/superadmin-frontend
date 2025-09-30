import React from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, useTheme
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, value: '' },
  { text: 'Restaurants', icon: <StoreIcon />, value: 'restaurants' },
  { text: 'Admins', icon: <PeopleIcon />, value: 'admins' },
  { text: 'Logout', icon: <LogoutIcon />, value: 'logout' },
];

const Sidebar = ({ onSelect }) => {
  const location = useLocation();
  const current = location.pathname.split('/')[2] || '';
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={current === item.value}
            onClick={() => onSelect(item.value)}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              color: theme.palette.text.primary,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.contrastText,
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
