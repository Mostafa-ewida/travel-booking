import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

console.log("API BASE URL:", process.env.REACT_APP_API_URL);

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('travel_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;