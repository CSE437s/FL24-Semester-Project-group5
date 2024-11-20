"use client";

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CardMedia from '@mui/material/CardMedia';
import { Box, TextField, CardActions, Card,Typography, InputLabel, OutlinedInput, InputAdornment, Button, FormControl, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export default function EditApartmentListing() {
  const { id } = useParams();  
  const router = useRouter();
  const [loading, setLoading] = useState(true); 
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const MAX_FILE_SIZE = 65 * 1024;

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
        const newFilesByteArrays = await convertFilesToByteArray();
        const existingImagesByteArrays = imagePreview
        .map((url) => url.split(",")[1])
        .filter((byteArray) => byteArray !== undefined && byteArray !== null);
        let allByteArrays;
        if (existingImagesByteArrays[0] != undefined){
           allByteArrays = [...existingImagesByteArrays, ...newFilesByteArrays];
        }else{
           allByteArrays = newFilesByteArrays;
        }
        
        console.log(existingImagesByteArrays,newFilesByteArrays,allByteArrays );
        const payload = {
          ...values,
          pics: allByteArrays
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
        
          setImagePreview(data.pics);
          
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
      const oversizedFiles = selectedFiles.filter((file) => file.size > MAX_FILE_SIZE);

      if (oversizedFiles.length > 0) {
        alert(
          `The following files are too large: ${oversizedFiles
            .map((file) => file.name)
            .join(", ")}. Each file must be under 64 KB.`
        );
        return;
      }

      setFiles((prev) => [...prev, ...selectedFiles]);
      const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...previewUrls]);
    }
  };

  const convertFilesToByteArray = async () => {
    const byteArrays =  await Promise.all(
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
    return byteArrays;
  };
  const handleDeletePic = (imageUrl: string) => {
    setImagePreview((prev) => prev.filter((image) => image !== imageUrl));
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this listing?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5001/api/apartment/delete/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          router.push('/listings');
        } else {
          console.error("Failed to delete listing data");
        }
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    }
  };

  if (loading) return <CircularProgress />;
console.log(imagePreview);
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
      <Box display="flex" flexWrap="wrap" gap={2}>
        {imagePreview.map((imageUrl, index) => (
          <Card key={index} sx={{ width: 200, padding: 1 }}>
            <CardMedia
              component="img"
              image={imageUrl}
              alt={`Image ${index + 1}`}
              sx={{ height: 120, objectFit: "cover" }}
            />
            <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
              Image {index + 1}
            </Typography>
            <CardActions>
              <Button variant="outlined" color="error" onClick={() => handleDeletePic(imageUrl)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Button variant="contained" component="label">
        Upload Images
        <input type="file" hidden onChange={handleFileChange} multiple />
      </Button>

      <Button variant="contained" color="secondary" onClick={handleDelete}>
        Delete Listing
      </Button>
      <Button type="submit" variant="contained">Save Changes</Button>
    </Box>
  );
}
