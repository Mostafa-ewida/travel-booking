
import { CardContent, Typography, Button, Box, Chip } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { cancelBooking } from '../../api/bookings';
import '../../styles/theme-pro.css';

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
    <Box className="result-card-pro" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <FlightTakeoffIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {booking.flight.destination}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EventIcon color="action" sx={{ mr: 1 }} />
          <Typography color="text.secondary" variant="body2">
            {formatDate(booking.travelDate)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AttachMoneyIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {formatCurrency(booking.totalPrice)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            label={booking.status}
            color={booking.status === 'CANCELLED' ? 'error' : booking.status === 'CONFIRMED' ? 'success' : 'warning'}
            size="small"
            icon={booking.status === 'CANCELLED' ? <CancelIcon /> : undefined}
            sx={{ fontWeight: 600, textTransform: 'capitalize' }}
          />
        </Box>
      </CardContent>
      <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleCancel}
          disabled={booking.status === 'CANCELLED'}
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          {booking.status === 'CANCELLED' ? 'Cancelled' : 'Cancel'}
        </Button>
      </Box>
    </Box>
  );
};

export default BookingCard;