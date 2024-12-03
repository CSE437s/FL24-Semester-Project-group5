"use client";


import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CardMedia from '@mui/material/CardMedia';
import {  Modal,  MenuItem, Select,  Box, TextField, CardActions, Card, Typography, InputLabel, OutlinedInput, InputAdornment, Button, FormControl, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useSession } from 'next-auth/react';


export default function EditApartmentListing() {
  const { id } = useParams();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const MAX_FILE_SIZE = 65 * 1024;
  const [sold, setSold] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();

  const formik = useFormik({
    initialValues: {
      title: "",
      price: "",
      description: "",
      availability: "",
      bedrooms: "",
      bathrooms: "",
      amenities: "",
      policies: "",
      user_id: "",
      location:"",
    },
    validationSchema: Yup.object({
      title: Yup.string().min(5, "Title must be at least 5 characters").required("Title is required"),
      price: Yup.number().min(0, "Price must be at least 0").max(5000, "Price cannot exceed $5000").required("Price is required"),
      description: Yup.string().min(5, "Description must be at least 5 characters").required("Description is required"),
      availability: Yup.string().min(5, "Availability must be at least 5 characters").required("Availability is required"),
      bedrooms: Yup.number().min(0, "Bedrooms must be at least 0").max(20, "Bedrooms cannot exceed 20").required("Bedrooms are required"),
      bathrooms: Yup.number().min(0, "Bathrooms must be at least 0").max(20, "Bathrooms cannot exceed 20").required("Bathrooms are required"),
      amenities: Yup.string().min(5, "Amenities must be at least 5 characters").required("Amenities are required"),
      policies: Yup.string().min(5, "Policies must be at least 5 characters").required("Policies are required"),
    }),
    onSubmit: async (values) => {
      try {
        const newFilesByteArrays = await convertFilesToByteArray(files);
        const existingImagesByteArrays = imagePreview
          .map((url) => url.split(",")[1])
          .filter((byteArray) => byteArray !== undefined && byteArray !== null);
        const allByteArrays =
          existingImagesByteArrays.length > 0
            ? [...existingImagesByteArrays, ...newFilesByteArrays]
            : newFilesByteArrays;


        const payload = {
          ...values,
          pics: allByteArrays,
        };

        const response = await fetch(`http://localhost:5001/api/apartment/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          router.push("/profile");
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
            title: data.title,
            price: data.price,
            description: data.description,
            availability: data.availability,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            amenities: data.amenities,
            policies: data.policies,
            user_id: data.user_id,
            location: data.location,
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


  const convertFilesToByteArray = async (fileList: File[]) => {
    const byteArrays = await Promise.all(
      fileList.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const byteString = reader.result as string;

            resolve(byteString.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);

        });
      })
    );
    return byteArrays;
  };


  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/apartment/users/${id}`); 
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

const openModal = async () => {
  await fetchUsers();
  setShowModal(true);
};
const closeModal = () => {
  setShowModal(false);
  setSelectedUser(''); 
};
const handleConfirmSold = async () => {
  if (!selectedUser) {
    alert('Please select a user to whom the listing is sold.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5001/api/apartment/${id}/sold`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sold: true, buyerId: selectedUser }),
    });
    if (response.ok) {
      alert('You have just sold your listing!');
      const message_text = "Rate your furniture purchase: " + formik.values.description;
      const messageData = {
        sender_id: 'ADMIN',
        recipient_id: selectedUser,
        message_text: message_text,
        seller: formik.values.user_id
      };

      const response = await fetch('http://localhost:5001/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      setShowModal(false);
      setSelectedUser('');
      router.push('/furniture');


    } else {
      const data = await response.json();
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Failed to mark listing as sold', error);
    alert('Failed to mark the listing as sold');
  }
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

  return (
    <Box className="flex flex-wrap md:flex-nowrap gap-16 p-6 w-full max-w-7xl mx-auto bg-white shadow-lg rounded-lg mt-10 border border-gray-200 text-gray-700 mb-10">
      <Modal open={showModal} onClose={closeModal}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h6" component="h2" gutterBottom>
      Select Buyer
    </Typography>
    <FormControl fullWidth>
      <InputLabel id="buyer-select-label">Buyer</InputLabel>
      <Select
        labelId="buyer-select-label"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        fullWidth
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.email}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button variant="contained" color="success" onClick={handleConfirmSold}>
        Confirm
      </Button>
      <Button variant="outlined" color="error" onClick={closeModal}>
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>
      {/* Left Column: Image Previews */}
      <Box className="flex flex-col items-center w-full md:w-1/2 gap-4">
        <h3 className="text-2xl font-semibold">Image Preview</h3>
        <Box className="w-full h-full max-h-[400px] mt-2">
          {imagePreview.length > 0 ? (
            <Swiper
              spaceBetween={10}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="h-full max-h-[400px] w-full"
            >
              {imagePreview.map((preview, index) => (
                <SwiperSlide key={index} className="h-full w-full">
                  <img
                    src={preview}
                    className="h-full w-full object-cover border border-gray-300 rounded-md"
                    alt={`Preview ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Box className="h-full w-full flex items-center justify-center border border-dashed border-gray-400 rounded-md">
              <p className="text-gray-500">No images uploaded</p>
            </Box>
          )}
        </Box>
        <Button variant="contained" component="label" className="bg-black p-3 rounded-3xl mt-3 w-full">
          Upload Image
          <input type="file" hidden onChange={handleFileChange} multiple />
        </Button>
      </Box>

      {/* Right Column: Form */}
      <form onSubmit={formik.handleSubmit} className="flex flex-col items-center gap-4 w-full md:w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Edit Apartment Listing</h2>

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
          id="outlined-location"
          label="Location"
          variant="outlined"
          name="location"
          fullWidth
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.location}
          error={formik.touched.location && Boolean(formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
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
      <Button variant="contained" color="secondary" onClick={handleDelete}>
        Delete Listing
      </Button>
      <Button variant="contained" color="success" onClick={openModal}>
        Mark Sold
      </Button>

        <Button
          type="submit"
          variant="contained"
          className="w-full bg-black p-3 rounded-3xl mt-3 text-white disabled:bg-gray-200"
        >
          Save Changes
        </Button>
      </form>

    </Box>




    
  );
}
