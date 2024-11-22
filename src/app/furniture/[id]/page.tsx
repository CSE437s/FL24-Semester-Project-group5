"use client";

import { Card, CardContent, CardMedia, Typography, Box, Grid, Button, IconButton, Rating, CircularProgress } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Maps from '../../components/map-card';
import { getCoordinatesOfAddress } from '../../utils'; 
import { useSession } from 'next-auth/react';
import { Swiper, SwiperSlide } from "swiper/react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import "swiper/css";
import "swiper/css/navigation";
import { Pagination } from 'swiper/modules';
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
  favorite: boolean;
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
  const { data: session, status } = useSession();
  

  const [furnitureItem, setFurnitureItem] = useState<FurnitureItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user_id = session?.user.id;
    if (id) {

      const fetchFurnitureItem = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/furniture/${id}?user_id=${user_id}`);
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

  if (loading)return <div><Box sx={{ position:'absolute', top:'50%', left:'50%'}}>
  <CircularProgress size='4rem'/>
</Box></div>;
  if (error) return <div>{error}</div>; 
  if (!furnitureItem) return <div>No furniture item found.</div>; 
  address.push(furnitureItem?.location);


  const colorList = Array.isArray(furnitureItem.colors)
    ? furnitureItem.colors.join(', ')
    : 'None';



  const handleContactLister = () => {
    if (status === 'unauthenticated') {
      const res = confirm("You must be logged in to contact the lister. Do you want to log in or sign up?");
      if (res) {
        router.push('/login'); 
      }
    } else {
      router.push(`/messages?recipientId=${furnitureItem?.user_id}&sellerId=${session?.user?.id}`);
    }
  };

  const toggleFavorite = (id: number) => {
    if (session){ 
      const updatedFavoriteStatus = !furnitureItem?.favorite;

      // Update the favorite status locally
      setFurnitureItem((prev) =>
        prev ? { ...prev, favorite: updatedFavoriteStatus } : null
      );
    fetch(`http://localhost:5001/api/furniture/${id}/favorite`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: session.user.id, listing_id: id, listing_type: "furniture", favorite: updatedFavoriteStatus}),
    });
  }else{
    const res = confirm("You must be logged in to heart a furniture listing. Do you want to log in or sign up?");
    if(res){
      router.push('/login'); 
    }
  }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '20px auto' }}>
      <Card
        sx={{
          boxShadow: 6,
          borderRadius: 2,
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',

          padding: 4,
        }}
      >
             {furnitureItem.pics.length > 1 ? (
          // Carousel for multiple images
          <Swiper
            spaceBetween={10}
            pagination={true}
            modules={[Pagination]}
            className="h-30 w-full"
            
          >
            {furnitureItem.pics.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imageUrl}
                  
                  className="h-30 w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Single image
          <img
            src={furnitureItem.pics[0]}
      
            className="h-300 w-full object-cover border-b border-gray-300"
          />
        )}
        <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4">{furnitureItem.description}</Typography>
            <IconButton onClick={() => toggleFavorite(furnitureItem.id)}>
              {furnitureItem.favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
 
          <Grid item xs={9}>
            <Typography variant="h6" color="text.secondary">
              Rating:
            </Typography>
            {/* <Typography variant="body1">{furnitureItem.rating}</Typography> */}
            <Rating name="furniture-rating" value={furnitureItem.rating} readOnly />
          </Grid>
          <br></br>


          <Card 
            sx={{padding:4, borderRadius:3, minWidth:300}}
          >
            <Grid item xs={6} 
              sx={{display:'flex', flexDirection:'row', gap:1}}
            >
              <Typography variant="h6" color="text.secondary">
                Price:
              </Typography>

              <Typography variant="h6">${furnitureItem.price}</Typography>

        <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleContactLister}
              sx={{ marginLeft: '10px' }}
            >
              Contact Lister
            </Button>

            </Grid>
            <br></br>
            <Grid container spacing={2}>
              <Grid item xs={6} sx={{display:'flex', flexDirection:'row', gap:1}}>
                <Typography variant="h6" color="text.secondary">
                  Condition:
                </Typography>
                <Typography variant="h6">{furnitureItem.condition}</Typography>
              </Grid>

              <Grid item xs={6} sx={{display:'flex', flexDirection:'row', gap:1}}>
                <Typography variant="h6" color="text.secondary">
                  Colors:
                </Typography>
                <Typography variant="h6">{colorList}</Typography>
              </Grid>

        
              <Grid item xs={6}>
                {locations.length > 0 ? (
                  <Box sx={{ height: '200px', marginTop: '10px' }}>
                    <Maps locations={locations} names={address} />
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No pick-up location set
                  </Typography>
                )}
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" color="text.secondary" sx={{paddingBottom:2}}>
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
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', paddingTop:'1rem'}}>
            <Button variant="contained" color="primary" onClick={() => router.back()}>
              Back to Listings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box >
  );
};

export default FurnitureDescriptionPage;