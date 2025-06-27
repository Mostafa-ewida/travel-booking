import { Grid, Typography } from '@mui/material';
import ResultCard from './ResultCard';

const SearchResults = ({ results, loading, onBook }) => {
  if (loading) {
    return <Typography>Loading results...</Typography>;
  }

  if (results.length === 0) {
    return <Typography>No flights found. Try different search criteria.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {results.map((flight) => (
        <Grid item xs={12} sm={6} md={4} key={flight.id}>
          <ResultCard flight={flight} onBook={onBook} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResults;