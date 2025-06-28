import { Container, Typography, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const HomePage = ({ showNotification }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)' 
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        color: theme.palette.mode === 'dark' 
          ? theme.palette.common.white 
          : theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: 4,
            py: 10,
          }}
        >
          <Typography 
            variant={isMobile ? 'h3' : 'h2'} 
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'inherit',
            }}
          >
            Discover Your Next Adventure
          </Typography>
          
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            sx={{
              maxWidth: '800px',
              mb: 4,
              color: 'inherit',
            }}
          >
            Book flights to amazing destinations with our seamless travel platform
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/search')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              Search Flights
            </Button>
            
            {!isAuthenticated() && (
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  color: 'inherit',
                  borderColor: 'inherit',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.1)' 
                      : 'rgba(0,0,0,0.05)',
                  }
                }}
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