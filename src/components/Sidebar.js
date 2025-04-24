import React from 'react';  
import { signOut } from 'firebase/auth';  
import { auth } from '../firebaseconfig';  
import ExitToAppIcon from '@mui/icons-material/ExitToApp';  
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CardGiftcard as RewardsIcon,
  Receipt as ReceiptsIcon,
  LocalOffer as CouponsIcon,
  Business as ShopsIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* <ListItem button component={Link} to="/people">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="People" />
        </ListItem> */}

        <ListItem button component={Link} to="/rewards">
          <ListItemIcon>
            <RewardsIcon />
          </ListItemIcon>
          <ListItemText primary="Rewards" />
        </ListItem>

        <ListItem button component={Link} to="/receipts">
          <ListItemIcon>
            <ReceiptsIcon />
          </ListItemIcon>
          <ListItemText primary="Receipts" />
        </ListItem>

        <ListItem button component={Link} to="/coupons">
          <ListItemIcon>
            <CouponsIcon />
          </ListItemIcon>
          <ListItemText primary="Coupons" />
        </ListItem>

        <ListItem button component={Link} to="/shops">
          <ListItemIcon>
            <ShopsIcon />
          </ListItemIcon>
          <ListItemText primary="Shops" />
        </ListItem>

        <ListItem button component={Link} to="/reports">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>

        <ListItem button component={Link} to="/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>

        <ListItem 
          button 
          onClick={async () => {
            try {
              console.log("Attempting to sign out...");
              await signOut(auth);
              console.log("Sign out successful");
              // Redirect to login page or home page after sign out
              window.location.href = '/login';
            } catch (error) {
              console.error("Error signing out:", error);
              alert("Failed to sign out. Please try again.");
            }
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>

    </Drawer>
  );
}

export default Sidebar;
