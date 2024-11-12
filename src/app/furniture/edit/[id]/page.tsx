"use client";

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CardMedia from '@mui/material/CardMedia';
import { Box, TextField, InputLabel, OutlinedInput, InputAdornment, Button, Select, MenuItem, FormControl, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export default function EditListing() {
  const { id } = useParams();  
  const router = useRouter();
  const [loading, setLoading] = useState(true); 
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const [originalPics, setOriginalPics] = useState<string[]>([]);
  const [files, setFiles] = React.useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  

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
        const byteArrays = await convertFilesToByteArray();
        const payload = {
          ...values,
          pics: byteArrays
        };
        const response = await fetch(`http://localhost:5001/api/furniture/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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
          setOriginalPics(data.pics);
          setImagePreview(data.pics[0]);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
      setFileNames(selectedFiles.map((file) => file.name));
      
     
      const previewUrl = URL.createObjectURL(selectedFiles[0]);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const convertFilesToByteArray = async () => {
    const byteArrays = files.length > 0
      ? await Promise.all(
          files.map(file => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const byteString = reader.result as string;
                resolve(byteString.split(',')[1]);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          })
        )
      : originalPics.map(pic => pic.split(',')[1]);; 
    return byteArrays;
  };
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this listing?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5001/api/furniture/delete/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          router.push('/furniture');
        } else {
          console.error("Failed to delete listing data");
        }
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    }
  };


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

      {imagePreview && (
        <CardMedia
          component="img"
          className="h-56 object-cover w-[400px] border-b border-gray-300 "
          image={imagePreview}
          alt="Apartment preview"
        />
      )}
      <Button variant="contained" component="label">
        {imagePreview ? `Change Image` : 'Upload Image'}
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          multiple
        />

      </Button>
      <Button variant="contained" color="secondary" onClick={handleDelete}>
        Delete Listing
      </Button>
      <Button type="submit" variant="contained">Save Changes</Button>
    </Box>
  );
}