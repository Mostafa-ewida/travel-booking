import { Container, Typography } from '@mui/material';
import BookingForm from '../../components/Bookings/BookingForm';
import { createBooking } from '../../api/bookings';

const BookingPage = ({ flight, showNotification }) => {
  const handleSubmit = async (bookingData) => {
    try {
      await createBooking(bookingData);
      showNotification('Booking created successfully!', 'success');
    } catch (error) {
      showNotification('Failed to create booking', 'error');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Complete Your Booking
      </Typography>
      <BookingForm flight={flight} onSubmit={handleSubmit} showNotification={showNotification} />
    </Container>
  );
};

export default BookingPage;
