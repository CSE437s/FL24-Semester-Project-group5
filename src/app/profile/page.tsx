// /src/app/profile/page.tsx

"use client";

import { useSession } from 'next-auth/react';
import { Container, Typography, Box, CircularProgress, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FurnitureCard from '../components/furniture-card';


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

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] =  useState<FurnitureListing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");


  useEffect(() => {
    if (!session || !session.user) {
        router.push('/furniture');
        return;
      }
    fetchProfile();
    fetchListings();
  }, [session]);

  async function fetchProfile(){
    const profile_id = userId || session?.user?.id;

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

    async function fetchListings(){
      const profile_id = userId || session?.user?.id;
      try {
        const listingsResponse = await fetch(`http://localhost:5001/api/furniture?user_id=${profile_id}`);
        if (listingsResponse.ok){
          const listingsData = await listingsResponse.json();
          setListings(listingsData);
        }

      }
      catch(error){
        console.error("Error fetching listings", error)
      }
      finally{
        setLoading(false);
      }
    }


  if (!session || !session.user) {
    return <Typography variant="h6">You must be logged in to view your profile.</Typography>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Email:</Typography>
        <Typography>{profile?.email || 'Not available'}</Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Full Name:</Typography>
        <Typography>{profile?.name || 'Not provided'}</Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Bio:</Typography>
        <Typography>{profile?.bio || 'Not provided'}</Typography>
      </Box>

      <Typography variant="h5" sx={{ mt: 4 }}>Your Listings</Typography>
      <div style={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          {listings.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <FurnitureCard
                title={item.description} 
                price={`$${item.price}`}
                imageUrl={item.pics[0] || "https://via.placeholder.com/345x140"}
                id={item.id}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
}