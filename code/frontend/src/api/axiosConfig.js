import axios from 'axios';
import { getAuthToken } from '../utils/auth';
import config from '../config';

const apiClient = axios.create({
  baseURL: config.REACT_APP_API_URL || 'http://localhost:8000',
});

console.log("API BASE URL:", config.REACT_APP_API_URL || 'http://localhost:8000');

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