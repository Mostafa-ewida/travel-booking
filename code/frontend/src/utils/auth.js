// src/utils/auth.js
export const getAuthToken = () => localStorage.getItem('travel_token');
export const setAuthToken = (token) => localStorage.setItem('travel_token', token);
export const clearAuthToken = () => localStorage.removeItem('travel_token');

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Add this logout function
export const logout = () => {
  clearAuthToken();
  // Optional: Clear any other user-related data
  localStorage.removeItem('user');
  window.location.reload(); // Refresh to reset application state
};