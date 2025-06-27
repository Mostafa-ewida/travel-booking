import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
        <Typography variant="h3" component="h1" gutterBottom>
          404 Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
