"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Grid, Button, Rating, CircularProgress} from '@mui/material';
import { getCoordinatesOfAddress } from '../../utils';
import Maps from '../../components/map-card';
import { useSession } from 'next-auth/react';
interface ApartmentItem {
  id: number;
  user_id: number;
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

interface Location {
  latitude: number;
  longitude: number;
  description: string;
}

const ApartmentDescriptionPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params['id'];
  const [locations, setLocations] = useState<Location[]>([]);
  const address = [''];
  const { data: session, status } = useSession();
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

  if (loading) return <div>
    <Box sx={{ position:'absolute', top:'50%', left:'50%'}}>
  <CircularProgress size='4rem'/>
</Box></div>;
  if (error) return <div>{error}</div>;
  if (!apartmentItem) return <div>No apartment item found.</div>;
  address.push(apartmentItem?.location);

  const handleContactLister = () => {
    if (status === 'unauthenticated') {
      const res = confirm("You must be logged in to contact the lister. Do you want to log in or sign up?");
      if (res) {
        router.push('/login'); 
      }
    } else {
      router.push(`/messages?recipientId=${apartmentItem?.user_id}&sellerId=${session?.user?.id}`);
    }
  };


  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '20px auto' }}>
      <Card
        sx={{boxShadow: 6,
          borderRadius: 2,
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 4}}
      >
        <Grid container spacing={2}>
            <CardMedia
              component="img"
              height="100"
              image={apartmentItem.pics[0] || "https://via.placeholder.com/400x300"}
              alt="Apartment Listing Image"
              sx={{ objectFit: 'cover', borderRadius: 5 }}
            />
         

          {/* Info Card on the right */}
          {/* <Grid item xs={12} md={5}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '20px',
              border: '1px solid rbg(54,119,204)'
            }}> */}
              <CardContent>
                <Typography variant="h4" component="div" gutterBottom>
                  {apartmentItem.description}
                </Typography>
                <Typography variant="h6">OVERVIEW:</Typography>

                <Typography variant="body1" color="text.secondary" sx={{paddingBottom:'1rem' ,display:'flex', flexDirection:'row'}}>
                  {/* Rating: {apartmentItem.rating} */}
                  Rating:  <Rating sx={{}} name="listing-rating" value={apartmentItem.rating} readOnly />
                </Typography>
                <Card sx={{padding:4, borderRadius:10, minWidth:300}}>

                
                <Grid item xs={6}
                  sx={{display:'flex', flexDirection:'row'}}
                >
                <Typography variant="h6" color="text.secondary" sx={{paddingBottom:'1rem'}}>
                  Price: $ {apartmentItem.price} / per month
                </Typography>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                <Typography variant="h6" color="text.secondary">
                  Location: {apartmentItem.location}
                </Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="h6" color="text.secondary">
                  {apartmentItem.bedrooms} Bedroom
                </Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="h6" color="text.secondary">
                   {apartmentItem.bathrooms} Bathroom
                </Typography>
                </Grid>


                <Grid item xs={6}>
                <Typography variant="h6" color="text.secondary">
                  Amenities: {apartmentItem.amenities}
                </Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="h6" color="text.secondary">
                  Availability: {apartmentItem.availability}
                </Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="h6" color="text.secondary">
                  Policies: {apartmentItem.policies}
                </Typography>
                </Grid>

                <Grid item xs={6}>
                  {locations.length > 0 ? (
                    <Box sx={{ height: '300px', marginTop: '10px' }}>
                      <Maps locations={locations} names={address} />
                    </Box>
                  ) : (
                    <Typography variant="h6" color="text.secondary">
                      Location Unknown
                    </Typography>
                  )}
                  </Grid>
                  <Grid item xs={6}>
                  <Typography variant="h6" color="text.secondary" sx={{paddingBottom:1}}>
                  Seller:
                </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`../profile?userId=${apartmentItem.user_id}`)}
                  >
                    View Profile
                  </Button>
                    <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleContactLister}
              sx={{ marginLeft: '10px' }}
            >
              Contact Lister
            </Button>
                  </Grid>
                </Grid>
         
                </Card>
              </CardContent>

        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={() => router.back()}>
            Back to Listings
          </Button>
        </Box>

      </Card>
    </Box>
  );
};

export default ApartmentDescriptionPage;
