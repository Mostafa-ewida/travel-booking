import { Container, Typography, Box } from '@mui/material';
import RegisterForm from '../../components/Auth/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage = ({ showNotification }) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <RegisterForm onSuccess={handleSuccess} showNotification={showNotification} />
      </Box>
    </Container>
  );
};

export default RegisterPage;