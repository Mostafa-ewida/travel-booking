import { useState } from 'react';
import { Container, Grid, Box } from '@mui/material';
import SearchFilters from '../../components/Search/Filters';
import SearchResults from '../../components/Search/Results';
import { searchFlights } from '../../api/search';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const data = await searchFlights(filters);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
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
            <SearchResults results={results} loading={loading} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SearchPage;