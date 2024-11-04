"use client";

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CardMedia from '@mui/material/CardMedia';
import { Box, TextField, InputLabel, OutlinedInput, InputAdornment, Button, FormControl, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export default function EditApartmentListing() {
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
      location: '',
      availability: '',
      bedrooms: '',
      bathrooms: '',
      amenities: '',
      policies: '',
    },
    validationSchema: Yup.object({
      price: Yup.number().min(0, 'Price must be at least 0').max(5000, 'Price cannot exceed $5000').required('Price is required'),
      description: Yup.string().min(5, 'Description must be at least 5 characters').required('Description is required'),
      location: Yup.string().min(5, 'Location must be at least 5 characters').required('Location is required'),
      availability: Yup.string().min(5, 'Availability must be at least 5 characters').required('Availability is required'),
      bedrooms: Yup.number().min(0, 'Bedrooms must be at least 0').max(20, 'Bedrooms cannot exceed 20').required('Bedrooms are required'),
      bathrooms: Yup.number().min(0, 'Bathrooms must be at least 0').max(20, 'Bathrooms cannot exceed 20').required('Bathrooms are required'),
      amenities: Yup.string().min(5, 'Amenities must be at least 5 characters').required('Amenities are required'),
      policies: Yup.string().min(5, 'Policies must be at least 5 characters').required('Policies are required'),
    }),
    onSubmit: async (values) => {
      try {
        const byteArrays = await convertFilesToByteArray();
        const payload = {
          ...values,
          pics: byteArrays
        };
        const response = await fetch(`http://localhost:5001/api/apartment/${id}`, {
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
        const response = await fetch(`http://localhost:5001/api/apartment/${id}`);
        if (response.ok) {
          const data = await response.json();
          formik.setValues({
            description: data.description,
            price: data.price,
            location: data.location,
            availability: data.availability,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            amenities: data.amenities,
            policies: data.policies,

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

  if (loading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <TextField
        label="Description"
        name="description"
        multiline
        rows={4}
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
        label="Location"
        name="location"
        value={formik.values.location}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.location && Boolean(formik.errors.location)}
        helperText={formik.touched.location && formik.errors.location}
      />
      <TextField
        label="Availability"
        name="availability"
        value={formik.values.availability}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.availability && Boolean(formik.errors.availability)}
        helperText={formik.touched.availability && formik.errors.availability}
      />
      <TextField
        label="Bedrooms"
        name="bedrooms"
        type="number"
        value={formik.values.bedrooms}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.bedrooms && Boolean(formik.errors.bedrooms)}
        helperText={formik.touched.bedrooms && formik.errors.bedrooms}
      />
      <TextField
        label="Bathrooms"
        name="bathrooms"
        type="number"
        value={formik.values.bathrooms}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.bathrooms && Boolean(formik.errors.bathrooms)}
        helperText={formik.touched.bathrooms && formik.errors.bathrooms}
      />
      <TextField
        label="Amenities"
        name="amenities"
        multiline
        rows={4}
        value={formik.values.amenities}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.amenities && Boolean(formik.errors.amenities)}
        helperText={formik.touched.amenities && formik.errors.amenities}
      />
      <TextField
        label="Policies"
        name="policies"
        multiline
        rows={4}
        value={formik.values.policies}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.policies && Boolean(formik.errors.policies)}
        helperText={formik.touched.policies && formik.errors.policies}
      />
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
      <Button type="submit" variant="contained">Save Changes</Button>
    </Box>
  );
}
