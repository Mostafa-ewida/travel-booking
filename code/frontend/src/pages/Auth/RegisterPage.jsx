import { Container, Typography, Box } from '@mui/material';
import RegisterForm from '../../components/Auth/RegisterForm';
import { useNavigate } from 'react-router-dom';
import '../../styles/theme-pro.css';

const RegisterPage = ({ showNotification }) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box className="card-pro" sx={{ mt: 8, mb: 4 }}>
        <Typography className="page-title" align="center" gutterBottom>
          Register
        </Typography>
        <Box className="search-form-pro">
          <RegisterForm onSuccess={handleSuccess} showNotification={showNotification} />
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;