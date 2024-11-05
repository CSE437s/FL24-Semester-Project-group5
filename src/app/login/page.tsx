"use client";

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Container, Box, Tabs, Tab, Link, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react';

// const validationSchema = Yup.object({
//   email: Yup.string().email('Invalid email address').required('Email is required'),
//   password: Yup.string().max(9, 'Password must be less than 10 characters').required('Password is required'),
//   confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
// });

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[Ee][Dd][Uu]$/, 'Email must be a .edu address')
    .required('Email is required'),
  password: Yup.string()
    .max(9, 'Password must be less than 10 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const LoginPage = () => {
  const [value, setValue] = React.useState(0); // 0 for Sign In, 1 for Sign Up
  const [loading, setLoading] = React.useState(false); // Loading state
  const router = useRouter();
  // const { data: session } = useSession(); 
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      if (value === 0) { // Sign In
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/furniture`, // Redirect to furniture page on success
          redirect: false,
        });

        // Check if sign in was successful
        if (res?.ok) {
          router.push('/furniture');
        } else {
            alert("Incorrect Sign in");
            console.log("Failed", res);
        }
      } else { // Sign Up
        let userData = {
          email: values.email,
          password: values.password,
        };

        // Make call to backend to create user
        const res = await fetch("http://localhost:3000/api/user/create", {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const signInRes = await signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/setup-profile?isNewUser=true&email=${values.email}`, // Redirect new users to setup-profile
            redirect: false,
          });
          
          if (signInRes?.ok) {
            router.push('/setup-profile');
          } else {
            alert('Error signing up, please try again');
          }
        } else {
          alert('Error signing up, please try again');
        }
      }
      setLoading(false);
      formik.resetForm();
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, mb: 2 }}>
        <Typography component="h1" variant="h5" className="text-black">
          {value === 0 ? 'Sign In' : 'Sign Up'}
        </Typography>
        <Tabs value={value} onChange={(event, newValue) => {
          setValue(newValue);
          formik.resetForm();
        }}>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          {value === 0 && (
            <Typography align="right" sx={{ color: 'blue', mt: 1 }}>
              <Link href="/resetPassword" underline="hover">
                Reset password
              </Link>
            </Typography>
          )}
          {value === 1 && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              {...formik.getFieldProps('confirmPassword')}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          )}
          <Button disabled={loading || !formik.isValid || !formik.dirty || (value === 1 && !formik.touched.confirmPassword)} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {loading ? <CircularProgress size={24} /> : value === 0 ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
