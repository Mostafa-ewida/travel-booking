import { Container, Typography, Box } from '@mui/material';
import LoginForm from '../../components/Auth/LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ showNotification }) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <LoginForm onSuccess={handleSuccess} showNotification={showNotification} />
      </Box>
    </Container>
  );
};

export default LoginPage;