"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  InputLabel,
  Typography,
  CardActions,
  OutlinedInput,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const MAX_FILE_SIZE = 65 * 1024;

  const formik = useFormik({
    initialValues: {
      price: "",
      description: "",
      condition: "",
      colors: [],
      location: "",
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .min(5, "Description must be at least 5 characters")
        .required("Description is required"),
      price: Yup.number()
        .min(0, "Price must be at least 0")
        .max(500, "Price cannot exceed $500")
        .required("Price is required"),
      condition: Yup.string()
        .min(3, "Condition must be at least 3 characters")
        .required("Condition is required"),
      colors: Yup.array()
        .min(1, "At least one color must be selected")
        .required("Color is required"),
    }),
    onSubmit: async (values) => {
      try {
        const newFilesByteArrays = await convertFilesToByteArray(files);
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
          pics: allByteArrays,
        };

        const response = await fetch(`http://localhost:5001/api/furniture/${id}`, {
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

          setImagePreview(data.pics); // Assuming `data.pics` contains base64 strings
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
            resolve(byteString.split(",")[1]); // Extract base64 part
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
    return byteArrays;
  };

  const handleDeletePic = (imageUrl: string) => {
    setImagePreview((prev) => prev.filter((image) => image !== imageUrl));
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this listing?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5001/api/furniture/delete/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          router.push("/furniture");
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
      {/* Image Previews */}
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
      <Button type="submit" variant="contained">
        Save Changes
      </Button>
    </Box>
  );
}
