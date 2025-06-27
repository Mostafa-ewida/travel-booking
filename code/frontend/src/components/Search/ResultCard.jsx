import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { formatDate, formatCurrency } from '../../utils/formatters';

const ResultCard = ({ flight, onBook }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {flight.origin} → {flight.destination}
        </Typography>
        <Typography color="text.secondary">
          {formatDate(flight.departureTime)} - {formatDate(flight.arrivalTime)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Airline: {flight.airline}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {formatCurrency(flight.price)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            fullWidth
            onClick={() => onBook(flight)}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResultCard;