"use client";

import { Card, CardContent, CardMedia, Typography, Box, Grid, Button, Paper } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Maps from '../../components/map-card';
import { getCoordinatesOfAddress } from '../../utils'; 

// const theme = createTheme({
//   typography: {
//     fontFamily: '',
//   },
// });

interface ColorData {
  colors: string[] | null;
}

interface FurnitureItem {
  id: number;
  user_id: number;
  price: number;
  description: string;
  condition: string;
  rating: number;
  location: string;
  colors: ColorData | null;
  pics: string[];
  name: string;
}

interface Location {
  latitude: number;
  longitude: number;
  description: string;
}


const FurnitureDescriptionPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params['id'];
  const [locations, setLocations] = useState<Location[]>([]);
  const address = [''];
  

  const [furnitureItem, setFurnitureItem] = useState<FurnitureItem | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (id) {
      const fetchFurnitureItem = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/furniture/${id}`);
          const data = await response.json();
          if (response.ok) {
            if (data.location) {
              const coords = await getCoordinatesOfAddress(data.location);
            if (coords) {
              setLocations([{
                latitude: coords.latitude,
                longitude: coords.longitude,
                description: data.description || "Furniture",
              }]);
            }
          }
            setFurnitureItem(data);
          } else {
            setError(`Error: ${response.status} - ${data.message}`);
          }
        } catch (error) {
          setError('Error fetching furniture item: ' + error);
        } finally {
          setLoading(false); 
        }
      };
      fetchFurnitureItem();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>; 
  if (!furnitureItem) return <div>No furniture item found.</div>; 
  address.push(furnitureItem?.location);

  
  const colorList = Array.isArray(furnitureItem.colors) 
  ? furnitureItem.colors.join(', ') 
  : 'None';

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
        <Paper elevation={10}>
        <CardMedia
          component="img"
          height="300"
          image={furnitureItem.pics[0] || "https://via.placeholder.com/400x300"}
          alt="Listing Image"
          sx={{ objectFit: 'cover' }}
        />
        </Paper>
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
            <Grid item xs={6}>
            {locations.length > 0 ? (
          <Box sx={{  height: '200px', marginTop: '10px' }}>
            <Maps locations={locations} names={address} />
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No pick-up location set
          </Typography>
        )}
         </Grid>

         <Grid item xs={6}>
              <Typography variant="h6" color="text.secondary">
                Seller:
              </Typography>
              <Button 
  variant="contained" 
  color="primary" 
  onClick={() => router.push(`../profile?userId=${furnitureItem.user_id}`)}
>
  View Profile
</Button>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
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
