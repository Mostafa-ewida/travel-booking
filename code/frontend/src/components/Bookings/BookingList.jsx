import { Grid } from '@mui/material';
import BookingCard from './BookingCard';

const BookingList = ({ bookings, showNotification, onCancel }) => {
  return (
    <Grid container spacing={3}>
      {bookings.map((booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking.id}>
          <BookingCard 
            booking={booking} 
            showNotification={showNotification}
            onCancel={onCancel}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default BookingList;