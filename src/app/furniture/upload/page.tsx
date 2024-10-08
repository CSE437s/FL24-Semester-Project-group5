"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/navigation'

export default function ListingUpload() {
  const [files, setFiles] = React.useState<File[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    price: 0,
    description: '',
    condition: '',
    colors: [], // Adjusted to store colors as an array
  });

  // State for managing selected colors
  const [colorsValue, setColorsValue] = React.useState<string[]>([]);

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

  // Handle color selection
  const handleColorChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setColorsValue(value);
    setFormData({ ...formData, colors: value }); // Update formData with selected colors
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

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!session || !session.user.id) {
      alert("You must be logged in to upload a furniture listing.");
      return;
    }

    const byteArrays = await convertFilesToByteArray();

    // Prepare the payload for your API
    const payload = {
      ...formData,
      pics: byteArrays, 
      user_id: session.user.id,
    };
    console.log(payload);
    const response = await fetch('http://localhost:5001/api/furniture/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Handle the response here
    if (response.ok) {
      console.log("Listing uploaded successfully.");
      router.push('/furniture');
    } else {
      console.error("Failed to upload listing:", response.statusText);
    }
  };

  const colorItems = [
    'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Black', 'Grey',
  ];

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 2, width: '25ch' } }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField 
        id="outlined-description" 
        label="Description" 
        variant="outlined" 
        name="description" 
        onChange={handleInputChange} 
      />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel htmlFor="outlined-adornment-price">Listing Price</InputLabel>
        <OutlinedInput
          id="outlined-adornment-price"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Listing Price"
          name="price"
          type="number"
          onChange={handleInputChange} 
        />
      </FormControl>
      <TextField
        id="outlined-condition"
        label="Condition"
        multiline
        rows={4}
        name="condition"
        onChange={handleInputChange} 
      />

      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel id="demo-multiple-checkbox-label">Color</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={colorsValue}
          onChange={handleColorChange}
          input={<OutlinedInput label="Color" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {colorItems.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={colorsValue.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        component="label"
      >
        Upload File
        <input
          type="file"
          hidden
          onChange={handleFileChange} 
          multiple 
        />
      </Button>
      <Button type="submit" variant="contained">Submit Listing</Button>
    </Box>
  );
}
