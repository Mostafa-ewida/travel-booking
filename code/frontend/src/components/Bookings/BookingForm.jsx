import { useState } from 'react';
import { 
  Button, 
  TextField, 
  Box, 
  MenuItem, 
  Typography  // Added Typography here
} from '@mui/material';
import { formatDate } from '../../utils/formatters';

const BookingForm = ({ flight, onSubmit, showNotification }) => {
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passengers < 1 || passengers > 10) {
      showNotification('Please select 1-10 passengers', 'error');
      return;
    }
    onSubmit({ flightId: flight.id, passengers });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Book This Flight
      </Typography>
      <TextField
        select
        fullWidth
        label="Passengers"
        value={passengers}
        onChange={(e) => setPassengers(Number(e.target.value))}  // Added Number() conversion
        sx={{ mb: 2 }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <MenuItem key={num} value={num}>
            {num}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" fullWidth>
        Confirm Booking
      </Button>
    </Box>
  );
};

export default BookingForm;