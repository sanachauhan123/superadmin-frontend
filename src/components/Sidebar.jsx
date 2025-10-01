import React, {useState} from 'react';
import {
   Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  Box,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
   const [collapsed, setCollapsed] = useState(false);
    const [selected, setSelected] = useState('');
    const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
       sx={{
        width: collapsed ? 72 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 72 : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: 'width 0.3s',
        },
      }}
    >
       <Toolbar
              sx={{
                display: 'flex',
                justifyContent: collapsed ? 'center' : 'space-between',
                px: 2,
              }}
            >
              {!collapsed && (
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
                >
                  🍽️ StridEdgePOS
                </Typography>
              )}
              <IconButton onClick={() => setCollapsed(!collapsed)} size="small">
                <MenuIcon />
              </IconButton>
            </Toolbar>

            <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={current === item.value}
            onClick={() => {
              setSelected(item.value);
              onSelect(item.value);
            }}
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
            {!collapsed && (
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontWeight: selected === item.value ? 600 : 400 }}
                          />
                        )}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
