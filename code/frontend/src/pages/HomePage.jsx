import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Travel Booking
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover amazing destinations and book your next adventure
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/search')}
          >
            Search Flights
          </Button>
          {!isAuthenticated() && (
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;