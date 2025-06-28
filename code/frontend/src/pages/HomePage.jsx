import { Container, Typography, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import '../styles/theme-pro.css';

const HomePage = ({ showNotification }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', color: '#232946' }}>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <Box className="card-pro" sx={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: { xs: 6, md: 10 }, px: { xs: 2, md: 6 }, gap: 4, boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10)' }}>
          <Typography className="page-title" variant={isMobile ? 'h3' : 'h2'} component="h1" gutterBottom>
            ✈️ Discover Your Next Adventure
          </Typography>
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ maxWidth: '600px', mb: 2, color: 'inherit', fontWeight: 400 }}>
            Book flights to amazing destinations with our seamless, modern travel platform. Enjoy a smooth booking experience, beautiful design, and exclusive deals.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={() => navigate('/search')}
              sx={{ fontWeight: 700, borderRadius: 2, px: 4, boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)' }}
            >
              Search Flights
            </Button>
            {!isAuthenticated() && (
              <Button 
                variant="outlined" 
                color="primary" 
                size="large" 
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 700, borderRadius: 2, px: 4 }}
              >
                Create Account
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;