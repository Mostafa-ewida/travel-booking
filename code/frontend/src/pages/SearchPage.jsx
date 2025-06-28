import { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Filters from '../components/Search/Filters';
import Results from '../components/Search/Results';
import { searchFlights } from '../api/search';
import '../styles/theme-pro.css';

const SearchPage = ({ showNotification }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      const results = await searchFlights(searchParams);
      setFlights(results);
    } catch (error) {
      showNotification(error.message || 'Failed to search flights', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box className="card-pro" boxShadow={3}>
        <Typography className="search-title">Find Your Next Flight</Typography>
        <Box className="search-form-pro">
          <Filters onSubmit={handleSearch} loading={loading} />
        </Box>
      </Box>
      <Box className="card-pro" boxShadow={2}>
        <Results results={flights} loading={loading} />
      </Box>
    </Container>
  );
};

export default SearchPage;