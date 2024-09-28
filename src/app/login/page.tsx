"use client";

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Container, Box, Tabs, Tab } from '@mui/material';
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().max(9, 'Password must be less than 10 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
});

const LoginPage = () => {
  const [value, setValue] = React.useState(0); // 0 for Sign In, 1 for Sign Up

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // console.log('Form submitted', values);
      
      // // Make API call
      // const response = await fetch(value === 0 ? '/api/auth/login' : '/api/user/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: values.email,
      //     password: values.password,
      //   }),
      // });

      // if (response.ok) {
      //   router.push('/furniture');
      // } else {
      //   console.log("Authentication error");
      // }
      
      // Reset the form (optional)
      if (value === 0) {
        let res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,
          redirect: false,
        });
    
        if (res?.ok) {
          // toast success
          console.log("success");
          return;
        } else {
          // Toast failed
          // setError("Failed! Check you input and try again.");
          // return;
          console.log("Failed", res);
        }
        return res;
      } else {
        let userData = {
          email: values.email,
          password: values.password,
        };

        console.log(userData)
    
        // Make call to backend to create user
        const res = await fetch("http://localhost:3000/api/user/create", {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (res.ok) {
          const data = await res.json();
    
          // registration success
        } else {
          //registration faled
        }
      }
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
          <Button disabled={!formik.isValid || !formik.dirty || (value === 1 && !formik.touched.confirmPassword)} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {value === 0 ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
