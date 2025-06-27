import { TextField, Button, Box } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../api/auth';

const LoginForm = ({ onSuccess, showNotification }) => {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={Yup.object({
        username: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const { token } = await login(values);
          localStorage.setItem('travel_token', token);
          onSuccess();
          showNotification('Login successful', 'success');
        } catch (error) {
          showNotification('Invalid credentials', 'error');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;