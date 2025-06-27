import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ fullHeight = false }) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      sx={{ 
        width: '100%',
        height: fullHeight ? '100vh' : 'auto',
        py: fullHeight ? 0 : 4
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;
