import { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress, Box } from '@mui/material';
import BookingCard from '../../components/Bookings/BookingCard';
import { getUserBookings } from '../../api/bookings';

const MyBookings = ({ showNotification }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        showNotification(error.message || 'Failed to load bookings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [showNotification]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error" variant="h6" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 4 }}>
        My Bookings
      </Typography>
      
      {bookings.length === 0 ? (
        <Typography variant="body1">You don't have any bookings yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <BookingCard 
                booking={booking} 
                showNotification={showNotification}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyBookings;