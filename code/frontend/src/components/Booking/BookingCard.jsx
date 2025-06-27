import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { cancelBooking } from '../../api/bookings';

const BookingCard = ({ booking, showNotification, onCancel }) => {
  const handleCancel = async () => {
    try {
      await cancelBooking(booking.id);
      showNotification('Booking cancelled successfully', 'success');
      onCancel(booking.id);
    } catch (error) {
      showNotification('Failed to cancel booking', 'error');
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {booking.flight.destination}
        </Typography>
        <Typography color="text.secondary">
          {formatDate(booking.travelDate)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Status: {booking.status}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {formatCurrency(booking.totalPrice)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleCancel}
            disabled={booking.status === 'CANCELLED'}
          >
            {booking.status === 'CANCELLED' ? 'Cancelled' : 'Cancel'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingCard;