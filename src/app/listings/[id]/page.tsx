"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Grid, Button } from '@mui/material';

interface ApartmentItem {
  id: number;
  userId: number;
  price: number;
  location: string;
  amenities: string;
  description: string;
  availability: string;
  bedrooms: number;
  bathrooms: number;
  policies: string;
  pics: string[];
  rating: number;
}

const ApartmentDescriptionPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params['id'];

  const [apartmentItem, setApartmentItem] = useState<ApartmentItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchApartmentItem = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/apartment/${id}`);
          const data = await response.json();
          if (response.ok) {
            setApartmentItem(data);
          } else {
            setError(`Error: ${response.status} - ${data.message}`);
          }
        } catch (error) {
          setError('Error fetching apartment item: ' + error);
        } finally {
          setLoading(false);
        }
      };
      fetchApartmentItem();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!apartmentItem) return <div>No apartment item found.</div>;

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '20px auto' }}>
      <Grid container spacing={2}>
        {/* Image on the left */}
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            height="100%"
            image={apartmentItem.pics[0] || "https://via.placeholder.com/400x300"}
            alt="Apartment Listing Image"
            sx={{ objectFit: 'cover', borderRadius: 2 }}
          />
        </Grid>

        {/* Info Card on the right */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px',
            border: '1px solid rbg(54,119,204)' 
          }}>            
          <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                {apartmentItem.description}
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Price: ${apartmentItem.price}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Location: {apartmentItem.location}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bedrooms: {apartmentItem.bedrooms}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bathrooms: {apartmentItem.bathrooms}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Amenities: {apartmentItem.amenities}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Availability: {apartmentItem.availability}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Policies: {apartmentItem.policies}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Rating: {apartmentItem.rating}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => router.back()}>
          Back to Listings
        </Button>
      </Box>
    </Box>
  );
};

export default ApartmentDescriptionPage;
