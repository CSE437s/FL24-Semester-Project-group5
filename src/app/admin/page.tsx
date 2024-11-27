"use client";

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import FurnitureCard from '../components/furniture-card';
import { useSession } from 'next-auth/react';  

interface FurnitureItem {
  id: number;
  user_id: number;
  price: number;
  description: string;
  condition: string;
  colors: string[];
  pics: string[];
  favorite: boolean;
}

const AdminFurniturePage = () => {
  const [pendingItems, setPendingItems] = useState<FurnitureItem[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPendingListings = async () => {
        try {
          const response = await fetch('http://localhost:5001/api/furniture/pending');
          console.log('API Response:', response);
          const data = await response.json();
          console.log('Parsed Data:', data);
          setPendingItems(data);
        } catch (error) {
          console.error('Error fetching pending furniture:', error);
        }
      };

    fetchPendingListings();
  }, []);

  const approveListing = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/furniture/${id}/approve`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setPendingItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } else {
        console.error('Error approving listing');
      }
    } catch (error) {
      console.error('Error approving listing:', error);
    }
  };

  useEffect(() =>{
    console.log("pending", pendingItems);
  },[pendingItems])

  return (
    <div>
      <h2>Pending Furniture Listings</h2>
      <Grid container spacing={4}>
        {pendingItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <FurnitureCard
              title={item.description}
              price={`$${item.price}`}
              images={
                item.pics && item.pics.length > 0
                  ? item.pics
                  : ["https://via.placeholder.com/345x140"]
              }
                linkDestination={`/furniture/${item.id}`}
                favorite={item.favorite}
                onFavoriteToggle={() => {}}
                approveButton={
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => approveListing(item.id)}
                    >
                      Approve
                    </button>
                  }
            />
            <button onClick={() => {}/*approveListing(item.id)*/}>Approve</button>

          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminFurniturePage;
