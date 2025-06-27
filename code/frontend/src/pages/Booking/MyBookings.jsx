import { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress } from '@mui/material';
import BookingCard from '../../components/Bookings/BookingCard';
import { getBookings } from '../../api/bookings';

const MyBookings = ({ showNotification }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        showNotification('Failed to load bookings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [showNotification]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        My Bookings
      </Typography>
      {loading ? (
        <CircularProgress />
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