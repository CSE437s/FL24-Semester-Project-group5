"use client";


import { useSession } from 'next-auth/react';
import { Container, Typography, Box, CircularProgress, Grid, Avatar, Card, CardMedia } from '@mui/material';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FurnitureCard from '../components/furniture-card';
import Link from 'next/link';
import { ApartmentCard } from '../components/apartment-card';




type UserProfile = {
 email: string;
 name: string | null;
 bio: string | null;
};


type FurnitureListing = {
 id: number;
 description: string;
 price: number;
 pics: string[];
};


type ApartmentListing = {
 id: number;
 description: string;
 price: number;
 pics: string[];
 location: string;
};




const ProfileContent = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<FurnitureListing[]>([]);
  const [apartmentListings, setApartmentListings] = useState<ApartmentListing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  let userId = searchParams.get("userId");


  useEffect(() => {
    if (!session || !session.user) {
      router.push('/furniture');
      return;
    }

    fetchProfile();
    fetchListings();
    fetchApartmentListings();
  }, [session]);

  async function fetchProfile() {
    let profile_id;
    if(userId){
      profile_id = userId;
    }
    else if (session){
      profile_id = session.user.id;
    }
    try {
      const response = await fetch(`/api/user/profile?id=${profile_id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error("Failed to fetch profile data");

      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchListings() {
    let profile_id;
    if(userId){
      profile_id = userId;
    }
    else if (session){
      profile_id = session.user.id;
    }
    try {
      const listingsResponse = await fetch(`http://localhost:5001/api/furniture?user_id=${profile_id}`);
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        setListings(listingsData);
      }

    }
    catch (error) {
      console.error("Error fetching listings", error)
    }
    finally {
      setLoading(false);
    }
  }

  async function fetchApartmentListings() {
    let profile_id;
    if(userId){
      profile_id = userId;
    }
    else if (session){
      profile_id = session.user.id;
    }
    try {
      const response = await fetch(`http://localhost:5001/api/apartment?user_id=${profile_id}`);
      if (response.ok) {
        const data = await response.json();
        setApartmentListings(data);
      }
    } catch (error) {
      console.error("Error fetching apartment listings", error);
    }
  }

  if (!session || !session.user) {
    return <Typography variant="h6">You must be logged in to view your profile.</Typography>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      {userId ? 'Seller Profile' : 'Your Profile'}
    </Typography>
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Email:</Typography>
      <Typography>{profile?.email || 'Not available'}</Typography>
  
      <Typography variant="h6" sx={{ mt: 2 }}>Full Name:</Typography>
      <Typography>{profile?.name || 'Not provided'}</Typography>
  
      <Typography variant="h6" sx={{ mt: 2 }}>Bio:</Typography>
      <Typography>{profile?.bio || 'Not provided'}</Typography>
    </Box>
    {userId ? (
  <>
    <Typography variant="h5" sx={{ mt: 4 }}>Seller's Furniture Listings</Typography>
    <div style={{ flexGrow: 1 }}>
      {listings.length > 0 ? (
        <Grid container spacing={4}>
          {listings.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <FurnitureCard
                title={item.description}
                price={`$${item.price}`}
                imageUrl={item.pics[0] || "https://via.placeholder.com/345x140"}
                linkDestination={`/furniture/${item.id}`}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Seller has no furniture listings.
        </Typography>
      )}
    </div>

    <Typography variant="h5" sx={{ mt: 4 }}>Seller's Apartment Listings</Typography>
    <div style={{ flexGrow: 1 }}>
      {apartmentListings.length > 0 ? (
        <Grid container spacing={4}>
          {apartmentListings.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <ApartmentCard
                title={item.description}
                address={item.location}
                price={`$${item.price}`}
                imageUrl={item.pics[0] || "https://via.placeholder.com/345x140"}
                linkDestination={`/listings/${item.id}`}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Seller has no apartment listings.
        </Typography>
      )}
    </div>
  </>
) : (
  <>
  <Typography variant="h5" sx={{ mt: 4 }}>Your Furniture Listings</Typography>
  <div style={{ flexGrow: 1 }}>
    {listings.length > 0 ? (
      <Grid container spacing={4}>
        {listings.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <FurnitureCard
              title={item.description}
              price={`$${item.price}`}
              imageUrl={item.pics[0] || "https://via.placeholder.com/345x140"}
              linkDestination={`/furniture/edit/${item.id}`}
            />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography variant="body1" sx={{ mt: 2 }}>
        You have no furniture listings.
      </Typography>
    )}
  </div>

  <Typography variant="h5" sx={{ mt: 4 }}>Your Apartment Listings</Typography>
  <div style={{ flexGrow: 1 }}>
    {apartmentListings.length > 0 ? (
      <Grid container spacing={4}>
        {apartmentListings.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <ApartmentCard
              title={item.description}
              address={item.location}
              price={`$${item.price}`}
              imageUrl={item.pics[0] || "https://via.placeholder.com/345x140"}
              linkDestination={`/listings/edit/${item.id}`}
            />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography variant="body1" sx={{ mt: 2 }}>
        You have no apartment listings.
      </Typography>
    )}
  </div>
</>
)}

    
  </Container>
  
  
  );
};


const Profile = () => (
 <Suspense fallback={<CircularProgress />}>
   <ProfileContent />
 </Suspense>
);


export default Profile;