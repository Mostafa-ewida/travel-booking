
import { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress, Box } from '@mui/material';
import BookingCard from '../../components/Bookings/BookingCard';
import { getUserBookings } from '../../api/bookings';
import '../../styles/theme-pro.css';

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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh' }}>
      <Box className="card-pro" sx={{ width: '100%', maxWidth: 900, mt: 6, mb: 6 }}>
        <Typography className="page-title" variant="h4" gutterBottom>
          My Bookings
        </Typography>
        {error && (
          <Typography color="error" variant="body1" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {bookings.length === 0 && !error ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
            You don't have any bookings yet.
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {bookings.map((booking) => (
              <Grid item xs={12} sm={6} md={4} key={booking.id}>
                <BookingCard 
                  booking={booking} 
                  showNotification={showNotification}
                  onCancel={(id) => setBookings((prev) => prev.filter((b) => b.id !== id))}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default MyBookings;