import * as Yup from 'yup';

export const loginSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export const registerSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export const bookingSchema = Yup.object({
  passengers: Yup.number().min(1).max(10).required('Number of passengers is required'),
});