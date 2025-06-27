import axios from './axiosConfig';

export const createBooking = async (bookingData) => {
  const response = await axios.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await axios.get('/bookings');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await axios.delete(`/bookings/${bookingId}`);
  return response.data;
};