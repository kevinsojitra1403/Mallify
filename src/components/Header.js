import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, Box } from '@mui/material';
import Logo from '../Logo.jpg'; // Import the logo image
import FilterListIcon from '@mui/icons-material/FilterList';
import { useLocation } from 'react-router-dom';  // Import the hook

// Available filter options
const filterOptions = ['Weekly', 'Monthly', 'Annually'];

function Header({ setFilter }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Weekly');
  const open = Boolean(anchorEl);

  // Get the current route pathname
  const location = useLocation();
  const pathname = location.pathname;

  // Map the pathname to a readable page title
  const getPageTitle = (currentPage) => {
    switch (pathname) {
      case '/receipts':
        return 'Receipts';
      case '/dashboard':
        return 'Dashboard';
      case '/rewards':
        return 'Rewards';
      case '/coupons':
        return 'Coupons';
      case '/shops':
        return 'Shops'; // Correctly map the shops route to the title
      case '/settings':
        return 'Settings';
      case '/reports':
        return 'Reports';
      case '/analytics':
        return 'Analytics';
      case '/login':
        return 'Login'; // Added case for login page
      case '/signup':
        return 'Signup'; // Added case for signup page
      case '/forgot-password':
        return 'Forgot Password'; // Added case for forgot password page
      default:
        return 'Dashboard';  // Default title
    }
  };

  // Get the title based on the current page
  const pageTitle = getPageTitle(pathname);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setFilter(option);
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Display the logo on the left */}
        <img src={Logo} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
        
        {/* Display the dynamic page title next to the logo */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>
        
        <Box>
          {/* Filter dropdown */}
          <IconButton
            color="inherit"
            aria-label="filter"
            aria-controls="filter-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {filterOptions.map((option) => (
              <MenuItem 
                key={option}
                onClick={() => handleFilterSelect(option)}
                selected={option === selectedFilter ? true : false}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
