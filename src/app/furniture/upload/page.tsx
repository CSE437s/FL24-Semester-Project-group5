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
import * as Yup from 'yup';

export default function ListingUpload() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const { data: session, status } = useSession();  
    const router = useRouter();

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
      colors: [''],
      location: '',
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
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
      setFileNames(selectedFiles.map((file) => file.name));
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

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 2, width: '25ch' } }}
      noValidate
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <TextField
        id="outlined-description"
        label="Description"
        variant="outlined"
        name="description"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.description}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />
      <FormControl fullWidth sx={{ m: 1 }}>
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
          <div style={{ color: 'red' }}>{formik.errors.price}</div>
        )}
      </FormControl>
      <TextField
        id="outlined-condition"
        label="Condition"
        multiline
        rows={4}
        name="condition"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.condition}
        error={formik.touched.condition && Boolean(formik.errors.condition)}
        helperText={formik.touched.condition && formik.errors.condition}
      />
          <TextField
        id="outlined-location"
        label="Pick up Location"
        variant="outlined"
        name="location"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.location}
        error={formik.touched.location && Boolean(formik.errors.location)}
        helperText={formik.touched.location && formik.errors.location}
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
          <div style={{ color: 'red' }}>{formik.errors.colors}</div>
        )}
      </FormControl>

      <Button
        variant="contained"
        component="label"
      >
        {fileNames.length > 0 ? `${fileNames.join(', ')}` : 'Upload File'}
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
      >
        Submit Listing
      </Button>
    </Box>
  );
}
