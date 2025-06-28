import { useState } from 'react';
import { Container, Box } from '@mui/material';
import Filters from '../components/Search/Filters';
import Results from '../components/Search/Results';
import { searchFlights } from '../api/search';

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
      <Box sx={{ mb: 4 }}>
        <Filters onSearch={handleSearch} loading={loading} />
      </Box>
      <Results flights={flights} loading={loading} />
    </Container>
  );
};

export default SearchPage;