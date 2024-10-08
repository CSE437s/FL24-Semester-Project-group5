"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import {  useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'


export default function ListingUpload() {
  const [files, setFiles] = React.useState<File[]>([]); // State to hold files
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = React.useState({
   
    title: '',
    price: 0,
    description: '',
    location: '',
    availability: '',
    bedrooms: 0,
    bathrooms: 0,
    amenities: '',
    policies: '',
  });

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
    }
  };

  // Handle form input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to convert files to byte arrays
  const convertFilesToByteArray = async () => {
    const byteArrays: string[] = await Promise.all(
      files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Convert to Base64 string
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

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!session || !session.user.id) {
      alert("You must be logged in to upload an apartment listing.");
      return;
    }

    const byteArrays = await convertFilesToByteArray();

    // Prepare the payload for your API
    const payload = {
      ...formData,
      pics: byteArrays, 
      user_id: session.user.id,
    };

    
    const response = await fetch('http://localhost:5001/api/apartment/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       
      },
      body: JSON.stringify(payload),
    });

    // Handle the response here
    console.log(response); // Check the payload before sending it to the server
    router.push('/listings');
  };

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 2, width: '25ch' } }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit} // Attach submit handler
    >
      <TextField 
        id="outlined-title" 
        label="Title" 
        variant="outlined" 
        name="title" 
        onChange={handleInputChange} // Handle input change
      />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel htmlFor="outlined-adornment-price">Listing Price</InputLabel>
        <OutlinedInput
          id="outlined-adornment-price"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Listing Price"
          name="price"
          type="number" // Ensure it is a number
          onChange={handleInputChange} // Handle input change
        />
      </FormControl>
      <TextField
        id="outlined-description"
        label="Description"
        multiline
        rows={4}
        name="description"
        onChange={handleInputChange} // Handle input change
      />
      <TextField id="outlined-location" label="Location" variant="outlined" name="location" onChange={handleInputChange} />
      <OutlinedInput
        id="outlined-bedrooms"
        endAdornment={<InputAdornment position="end">Bedrooms</InputAdornment>}
        aria-describedby="outlined-bedrooms-helper-text"
        defaultValue={0}
        name="bedrooms"
        type="number" // Ensure it is a number
        onChange={handleInputChange} // Handle input change
      />
      <OutlinedInput
        id="outlined-bathrooms"
        endAdornment={<InputAdornment position="end">Bathrooms</InputAdornment>}
        aria-describedby="outlined-bathrooms-helper-text"
        defaultValue={0}
        name="bathrooms"
        type="number" // Ensure it is a number
        onChange={handleInputChange} // Handle input change
      />
      <TextField
        id="outlined-amenities"
        label="Amenities"
        multiline
        rows={4}
        name="amenities"
        onChange={handleInputChange} // Handle input change
      />
      <TextField
        id="outlined-policies"
        label="Policies"
        multiline
        rows={4}
        name="policies"
        onChange={handleInputChange} // Handle input change
      />
      <TextField
        id="outlined-policies"
        label="availability"
        multiline
        rows={4}
        name="availability"
        onChange={handleInputChange} // Handle input change
      />
      <Button
        variant="contained"
        component="label"
      >
        Upload File
        <input
          type="file"
          hidden
          onChange={handleFileChange} // Handle file change
          multiple // Allow multiple files if needed
        />
      </Button>
      <Button type="submit" variant="contained">Submit Listing</Button>
    </Box>
  );
}
