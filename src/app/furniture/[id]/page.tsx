"use client";

import { Card, CardContent, CardMedia, Typography, Box, Grid, Button } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ColorData {
  colors: string[] | null;
}

interface FurnitureItem {
  id: number;
  userId: number;
  price: number;
  description: string;
  condition: string;
  rating: number;
  colors: ColorData | null;
  pics: string[];
}

const FurnitureDescriptionPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params['id'];

  const [furnitureItem, setFurnitureItem] = useState<FurnitureItem | null>(null);
  console.log("PIC", furnitureItem?.pics[0]);
  const [error, setError] = useState<string | null>(null); // Change to string for error message
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (id) {
      const fetchFurnitureItem = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/furniture/${id}`);
          const data = await response.json();
          if (response.ok) {
            setFurnitureItem(data);
          } else {
            setError(`Error: ${response.status} - ${data.message}`);
          }
        } catch (error) {
          setError('Error fetching furniture item: ' + error);
        } finally {
          setLoading(false); // Stop loading regardless of success or failure
        }
      };
      fetchFurnitureItem();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>; // Display error message
  if (!furnitureItem) return <div>No furniture item found.</div>; // Fallback for no item

  console.log(furnitureItem.pics[0]);

  // Handle the case where colors might be null or an empty array
  const colorList = furnitureItem.colors ? furnitureItem.colors.join(', ') : 'None';

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '20px auto' }}>
      <Card 
        sx={{ 
          boxShadow: 6, 
          borderRadius: 2, 
          minHeight: '80vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <CardMedia
          component="img"
          height="500"
          image={furnitureItem.pics[0] || "https://via.placeholder.com/400x300"}
          alt="Listing Image"
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {furnitureItem.description}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" color="text.secondary">
                Price:
              </Typography>
              <Typography variant="body1">${furnitureItem.price}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="text.secondary">
                Condition:
              </Typography>
              <Typography variant="body1">{furnitureItem.condition}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="text.secondary">
                Rating:
              </Typography>
              <Typography variant="body1">{furnitureItem.rating}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="text.secondary">
                Colors:
              </Typography>
              <Typography variant="body1">{colorList}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={() => router.back()}>
              Back to Listings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FurnitureDescriptionPage;
