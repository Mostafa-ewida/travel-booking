import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/auth';

const Header = ({ showNotification }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showNotification('Logged out successfully', 'success');
    navigate('/'); // Redirect to home after logout
  };

  return (
    <AppBar position="static" elevation={2} sx={{ background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', color: '#fff', boxShadow: '0 2px 12px 0 rgba(99, 102, 241, 0.08)' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            letterSpacing: '-1px'
          }}
        >
          Travel Booking
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/search"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Search Flights
          </Button>
          {isAuthenticated() ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/bookings"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                My Bookings
              </Button>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                sx={{ textTransform: 'none', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;