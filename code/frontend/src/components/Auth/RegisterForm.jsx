import { TextField, Button, Box } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { register } from '../../api/auth';

const RegisterForm = ({ onSuccess, showNotification }) => {
  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validationSchema={Yup.object({
        username: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await register(values);
          onSuccess();
          showNotification('Registration successful! Please login.', 'success');
        } catch (error) {
          showNotification('Registration failed', 'error');
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
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
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
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default RegisterForm;