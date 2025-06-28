import { getAuthToken } from '../utils/auth';  // Add this import
export const getUserBookings = async () => {
  // Implementation to fetch user's bookings
  const response = await fetch('/api/bookings', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
};

// Other exports you mentioned
export const createBooking = async (bookingData) => { /* ... */ };
export const cancelBooking = async (bookingId) => { /* ... */ };