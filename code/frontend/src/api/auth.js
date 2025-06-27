import axios from './axiosConfig';

export const login = async (credentials) => {
  const response = await axios.post('/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post('/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('travel_token');
};

export const getProfile = async () => {
  const response = await axios.get('/users/me');
  return response.data;
};  