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
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import CardMedia from '@mui/material/CardMedia';
import * as Yup from 'yup';
import LocationDropdown from '../../components/location-dropdown';

export default function ListingUpload() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const [location, setLocation] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState<string[]>([]);


  const { data: session, status } = useSession();  
    const router = useRouter();
    const MAX_FILE_SIZE = 65 * 1024;
  const colorItems: any[] = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Black', 'Grey'];

  const validationSchema = Yup.object({
    description: Yup.string()
      .min(5, 'Description must be at least 5 characters')
      .required('Description is required'),
    price: Yup.number()
      .min(0, 'Price must be at least 0')
      .max(500, 'Price cannot exceed $500')
      .required('Price is required'),
    condition: Yup.string()
      .min(3, 'Condition must be at least 3 characters')
      .required('Condition is required'),
    colors: Yup.array()
      .min(1, 'At least one color must be selected')
      .required('Color is required'),
  });

  const formik = useFormik({
    initialValues: {
      price: '',
      description: '',
      condition: '',
      colors: [],
     
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log('setFiles',  files);
      const byteArrays = await convertFilesToByteArray();
      console.log("b",byteArrays);
      const payload = {
        ...values,
        pics: byteArrays,
        user_id: session?.user?.id,
        location,
      };

      const checkUserResponse = await fetch('http://localhost:5001/api/furniture/check-or-add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: session?.user?.id }),
      });

      if (!checkUserResponse.ok) {
        console.error('Error checking or adding user:', checkUserResponse.statusText);
        return;
      }

      const checkUserData = await checkUserResponse.json();
      console.log('User Check/Add Response:', checkUserData);

      const response = await fetch('http://localhost:5001/api/furniture/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Listing uploaded successfully.");
        router.push('/furniture');
      } else {
        console.error("Failed to upload listing:", response.statusText);
      }
    },
  });

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
    const newFiles = Array.from(event.target.files);

    // Filter out files that exceed the maximum file size
    const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`The following files are too large: ${oversizedFiles.map(file => file.name).join(', ')}. Each file must be under 64 KB.`);
      return;
    }

    // Append new files to the existing ones
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    
    // Generate previews for all files 
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreview((prevPreviews) => [...prevPreviews, ...newPreviews]);

    // Append new file names to the existing list
    setFileNames((prevFileNames) => [...prevFileNames, ...newFiles.map(file => file.name)]);
  }
};


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

  React.useEffect(() => {
    return () => {
      imagePreview.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreview]);

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center gap-4 p-6 w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">New Furniture Listing</h2>

      <TextField
        id="outlined-description"
        label="Description"
        variant="outlined"
        name="description"
        fullWidth
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.description}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        className="w-full"
      />

      <FormControl className="w-full">
        <InputLabel htmlFor="outlined-adornment-price">Price</InputLabel>
        <OutlinedInput
          id="outlined-adornment-price"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Price"
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
        id="outlined-condition"
        label="Condition"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        name="condition"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.condition}
        error={formik.touched.condition && Boolean(formik.errors.condition)}
        helperText={formik.touched.condition && formik.errors.condition}
        className="w-full"
      />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel id="demo-multiple-checkbox-label">Color</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={formik.values.colors}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="colors"
          input={<OutlinedInput label="Color" />}
          renderValue={(selected) => selected.join(', ')}
          error={formik.touched.colors && Boolean(formik.errors.colors)}
        >
          {colorItems.map((name: string) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={formik.values.colors.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
        
        {formik.touched.colors && formik.errors.colors && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.colors}</p>
        )}
      </FormControl>
      <LocationDropdown onLocationSelect={(selectedLocation) => setLocation(selectedLocation)} />
      {imagePreview.length > 0 && (
  <Box className="flex flex-wrap gap-4">
    {imagePreview.map((preview, index) => (
      <CardMedia
        key={index}
        component="img"
        className="h-56 object-cover w-[200px] border border-gray-300 rounded-md"
        image={preview}
        alt={`Preview ${index + 1}`}
      />
    ))}
  </Box>
)}
      <Button variant="contained" component="label" className="w-full mt-4">
        {fileNames.length > 0 ? `Uploaded Files: ${fileNames.join(', ')}` : 'Upload Image'}
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          multiple
        />
      </Button>

      <Button
        type="submit"
        variant="contained"
        disabled={!formik.isValid || !formik.dirty}
        className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
      >
        Submit Furniture
      </Button>
    </form>
  );
}
