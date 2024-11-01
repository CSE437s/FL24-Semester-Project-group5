// /src/app/furniture/edit/[id]/page.tsx

"use client";

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, InputLabel, OutlinedInput, InputAdornment, Button, Select, MenuItem, FormControl, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export default function EditListing() {
  const { id } = useParams();  
  const router = useRouter();
  const [loading, setLoading] = useState(true); 

  const formik = useFormik({
    initialValues: {
      price: '',
      description: '',
      condition: '',
      colors: [],
      location: '',
    },
    validationSchema: Yup.object({
      description: Yup.string().min(5, 'Description must be at least 5 characters').required('Description is required'),
      price: Yup.number().min(0, 'Price must be at least 0').max(500, 'Price cannot exceed $500').required('Price is required'),
      condition: Yup.string().min(3, 'Condition must be at least 3 characters').required('Condition is required'),
      colors: Yup.array().min(1, 'At least one color must be selected').required('Color is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`http://localhost:5001/api/furniture/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          router.push('/profile');
        } else {
          console.error("Failed to update listing:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating listing:", error);
      }
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/furniture/${id}`);
        if (response.ok) {
          const data = await response.json();
          formik.setValues({
            price: data.price,
            description: data.description,
            condition: data.condition,
            colors: data.colors,
            location: data.location,
          });
        } else {
          console.error("Failed to fetch listing data");
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <TextField
        label="Description"
        variant="outlined"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />
      <FormControl>
        <InputLabel htmlFor="price">Price</InputLabel>
        <OutlinedInput
          id="price"
          name="price"
          type="number"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.price && Boolean(formik.errors.price)}
        />
      </FormControl>
      <TextField
        label="Condition"
        name="condition"
        multiline
        rows={4}
        value={formik.values.condition}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.condition && Boolean(formik.errors.condition)}
        helperText={formik.touched.condition && formik.errors.condition}
      />
      <TextField
        label="Location"
        name="location"
        value={formik.values.location}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.location && Boolean(formik.errors.location)}
        helperText={formik.touched.location && formik.errors.location}
      />
      <FormControl>
        <InputLabel>Colors</InputLabel>
        <Select
          multiple
          value={formik.values.colors}
          onChange={formik.handleChange}
          name="colors"
        >
          {['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Black', 'Grey'].map(color => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained">Save Changes</Button>
    </Box>
  );
}
