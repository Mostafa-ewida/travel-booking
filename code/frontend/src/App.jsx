import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import SearchPage from './pages/SearchPage';
import MyBookings from './pages/Bookings/MyBookings';
import BookingPage from './pages/Bookings/BookingPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Notification from './components/Common/Notification';
import LocalizationProviderWrapper from './components/Common/LocalizationProviderWrapper';

function App() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProviderWrapper>
        <div className="app">
          <Header showNotification={showNotification} />
          <Notification 
            open={notification.open}
            message={notification.message}
            severity={notification.severity}
            onClose={handleClose}
          />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage showNotification={showNotification} />} />
              <Route path="/login" element={<LoginPage showNotification={showNotification} />} />
              <Route path="/register" element={<RegisterPage showNotification={showNotification} />} />
              <Route path="/search" element={<SearchPage showNotification={showNotification} />} />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings showNotification={showNotification} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/new"
                element={
                  <ProtectedRoute>
                    <BookingPage showNotification={showNotification} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </LocalizationProviderWrapper>
    </ThemeProvider>
  );
}

export default App;