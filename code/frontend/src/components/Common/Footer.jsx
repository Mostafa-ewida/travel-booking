import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto',
        background: '#f1f5f9',
        color: '#64748b',
        textAlign: 'center',
        fontSize: '1rem',
        borderTop: '1px solid #e0e7ef',
      }}
    >
      <Typography variant="body2" color="inherit" align="center">
        © {new Date().getFullYear()} Travel Booking System
      </Typography>
    </Box>
  );
};

export default Footer;