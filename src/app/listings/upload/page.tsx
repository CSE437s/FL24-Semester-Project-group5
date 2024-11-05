"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function ListingUpload() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const MAX_FILE_SIZE = 65 * 1024;

  // Validation schema for Formik using Yup
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, 'Title must be at least 5 characters')
      .required('Title is required'),
    price: Yup.number()
      .min(0, 'Price must be at least 0')
      .max(5000, 'Price cannot exceed $5000')
      .required('Price is required'),
    description: Yup.string()
      .min(5, 'Description must be at least 5 characters')
      .required('Description is required'),
    location: Yup.string()
      .min(5, 'Location must be at least 5 characters')
      .required('Location is required'),
    availability: Yup.string()
      .min(5, 'Availability must be at least 5 characters')
      .required('Availability is required'),
    bedrooms: Yup.number()
      .min(0, 'Bedrooms must be at least 0')
      .max(20, 'Bedrooms cannot exceed 20')
      .required('Bedrooms are required'),
    bathrooms: Yup.number()
      .min(0, 'Bathrooms must be at least 0')
      .max(20, 'Bathrooms cannot exceed 20')
      .required('Bathrooms are required'),
    amenities: Yup.string()
      .min(5, 'Amenities must be at least 5 characters')
      .required('Amenities are required'),
    policies: Yup.string()
      .min(5, 'Policies must be at least 5 characters')
      .required('Policies are required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: '',
      price: 0,
      description: '',
      location: '',
      availability: '',
      bedrooms: 0,
      bathrooms: 0,
      amenities: '',
      policies: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const byteArrays = await convertFilesToByteArray();
      const payload = {
        ...values,
        pics: byteArrays,
        user_id: session?.user?.id,
      };

      const checkUserResponse = await fetch('http://localhost:5001/api/furniture/check-or-add-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: session?.user?.id }),  
  });

  // If the user check fails, exit early
  if (!checkUserResponse.ok) {
    console.error('Error checking or adding user:', checkUserResponse.statusText);
    return;
  }

  const checkUserData = await checkUserResponse.json();
  console.log('User Check/Add Response for Apartment:', checkUserData);


  const uploadResponse = await fetch('http://localhost:5001/api/apartment/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // If the upload is successful, redirect to the listings page
  if (uploadResponse.ok) {
    console.log("Apartment listing uploaded successfully.");
    router.push('/listings');
  } else {
    console.error("Failed to upload apartment listing:", uploadResponse.statusText);
  }
    },
  });

  // Handle file input change and update file names
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        alert(`The following files are too large: ${oversizedFiles.map(file => file.name).join(', ')}. Each file must be under 64KB.`);

        return;
      }
      setFiles(selectedFiles);
      setFileNames(selectedFiles.map((file) => file.name));
    }
  };

  // Function to convert files to byte arrays
  const convertFilesToByteArray = async () => {
    const byteArrays: string[] = await Promise.all(
      files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const byteString = reader.result as string;
            resolve(byteString.split(',')[1]); // Get the base64 part
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
    return byteArrays;
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-center gap-4 p-8 border border-gray-200 w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold mb-4">New Apartment Listing</h2>
      
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        name="title"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.title}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
  
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="outlined-adornment-price">Listing Price</InputLabel>
        <OutlinedInput
          id="outlined-adornment-price"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Listing Price"
          name="price"
          type="number"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.price}
          error={formik.touched.price && Boolean(formik.errors.price)}
        />
        {formik.touched.price && formik.errors.price && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
        )}
      </FormControl>
  
      <TextField
        label="Description"
        multiline
        rows={4}
        fullWidth
        name="description"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.description}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />
  
      <TextField
        label="Location"
        variant="outlined"
        fullWidth
        name="location"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.location}
        error={formik.touched.location && Boolean(formik.errors.location)}
        helperText={formik.touched.location && formik.errors.location}
      />
  
      <TextField
        label="Availability"
        variant="outlined"
        fullWidth
        name="availability"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.availability}
        error={formik.touched.availability && Boolean(formik.errors.availability)}
        helperText={formik.touched.availability && formik.errors.availability}
      />
  
      <TextField
        label="Bedrooms"
        type="number"
        variant="outlined"
        fullWidth
        name="bedrooms"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.bedrooms}
        error={formik.touched.bedrooms && Boolean(formik.errors.bedrooms)}
        helperText={formik.touched.bedrooms && formik.errors.bedrooms}
      />
  
      <TextField
        label="Bathrooms"
        type="number"
        variant="outlined"
        fullWidth
        name="bathrooms"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.bathrooms}
        error={formik.touched.bathrooms && Boolean(formik.errors.bathrooms)}
        helperText={formik.touched.bathrooms && formik.errors.bathrooms}
      />
  
      <TextField
        label="Amenities"
        multiline
        rows={4}
        fullWidth
        name="amenities"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.amenities}
        error={formik.touched.amenities && Boolean(formik.errors.amenities)}
        helperText={formik.touched.amenities && formik.errors.amenities}
      />
  
      <TextField
        label="Policies"
        multiline
        rows={4}
        fullWidth
        name="policies"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.policies}
        error={formik.touched.policies && Boolean(formik.errors.policies)}
        helperText={formik.touched.policies && formik.errors.policies}
      />
  
      <Button
        variant="contained"
        component="label"
        className="w-full mt-4"
      >
        {fileNames.length > 0 ? `Uploaded File: ${fileNames.join(', ')}` : 'Upload Image'}
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          multiple
        />
      </Button>
  
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {files.map((file, index) => (
            <div key={index} className="w-24 h-24 rounded-md overflow-hidden shadow-sm">
              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
  
      <Button
        type="submit"
        variant="contained"
        disabled={!formik.isValid || !formik.dirty}
        className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-200"
      >
        Submit Listing
      </Button>
    </form>
  );
  
  
}
