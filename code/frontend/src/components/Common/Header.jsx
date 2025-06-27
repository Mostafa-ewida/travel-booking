import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/auth';

const Header = ({ showNotification }) => {
  const handleLogout = () => {
    logout();
    showNotification('Logged out successfully', 'success');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Travel Booking
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/search">Search</Button>
          {isAuthenticated() ? (
            <>
              <Button color="inherit" component={Link} to="/bookings">My Bookings</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;