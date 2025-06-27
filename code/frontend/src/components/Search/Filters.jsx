import { TextField, Button, Box, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';

const SearchFilters = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      origin: '',
      destination: '',
      departureDate: null,
      returnDate: null,
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="From"
            name="origin"
            value={formik.values.origin}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="To"
            name="destination"
            value={formik.values.destination}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Departure"
            value={formik.values.departureDate}
            onChange={(date) => formik.setFieldValue('departureDate', date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Return"
            value={formik.values.returnDate}
            onChange={(date) => formik.setFieldValue('returnDate', date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            Search Flights
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchFilters;
