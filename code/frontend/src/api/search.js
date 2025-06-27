    import axios from './axiosConfig';

export const searchFlights = async (params) => {
  const response = await axios.get('/search', { params });
  return response.data;
};