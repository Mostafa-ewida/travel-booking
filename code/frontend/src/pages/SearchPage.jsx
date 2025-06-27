import { useState } from 'react';
import { Container, Grid, Box, CircularProgress } from '@mui/material';
import SearchFilters from '../../components/Search/Filters';
import SearchResults from '../../components/Search/Results';
import { searchFlights } from '../../api/search';

const SearchPage = ({ showNotification }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const data = await searchFlights(filters);
      setResults(data);
    } catch (error) {
      showNotification('Search failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <SearchFilters onSubmit={handleSearch} />
          </Grid>
          <Grid item xs={12} md={8}>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <SearchResults results={results} showNotification={showNotification} />
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SearchPage;