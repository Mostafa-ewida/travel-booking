import { Container, Typography, Box } from '@mui/material';
import LoginForm from '../../components/Auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import '../../styles/theme-pro.css';

const LoginPage = ({ showNotification }) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box className="card-pro" sx={{ mt: 8, mb: 4 }}>
        <Typography className="page-title" align="center" gutterBottom>
          Login
        </Typography>
        <Box className="search-form-pro">
          <LoginForm onSuccess={handleSuccess} showNotification={showNotification} />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;