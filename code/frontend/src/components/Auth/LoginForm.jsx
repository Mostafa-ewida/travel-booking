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
      {({ handleSubmit, isSubmitting, values, handleChange, handleBlur, touched, errors }) => (
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && Boolean(errors.username)}
              helperText={touched.username && errors.username}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
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