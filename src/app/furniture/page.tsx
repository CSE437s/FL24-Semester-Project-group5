"use client";

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import FurnitureCard from '../components/furniture-card';
import Filter from '../components/furniture-filter-card';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ColorData {
  colors: string[];
}
interface FurnitureItem {
  id: number;
  userId: number;
  price: number;
  description: string;
  condition: string;
  rating: number;
  colors: ColorData;
  pics: string[];
}

const FurniturePage = () => {
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [colorsValue, setColors] = useState<string[]>([]);

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleAddFurniture = () => {
    if (status === 'unauthenticated') {
      const res = confirm("You must be logged in to add a furniture listing. Do you want to log in or sign up?");
      if (res) {
        router.push('/login');
      }
    } else {
      router.push('/furniture/upload');
    }
  };

  useEffect(() => {
    const fetchFurnitureItems = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/furniture');
        const text = await response.text();
        if (response.ok) {
          const data = JSON.parse(text);
          setFurnitureItems(data);
        } else {
          console.error(`Error: ${response.status} - ${text}`);
        }
      } catch (error) {
        console.error('Error fetching furniture items:', error);
      }
    };

    fetchFurnitureItems();
  }, []);

  const filteredItems = furnitureItems.filter(item => {
    const isInPriceRange = item.price >= priceRange[0] && item.price <= priceRange[1];
    const isTagged = tags.length === 0 || tags.some(tag => item.description.toLowerCase().includes(tag.toLowerCase()));
    const isInRating = item.rating >= ratingValue;
    let isColorMatch = colorsValue.length === 0;
    const colors = item.colors as unknown as string[];
    if (colors) {
      for (let i = 0; i < colors.length; i++) {
        if (colorsValue.includes(colors[i])) {
          isColorMatch = true;
          break;
        }
      }
    }

    return isInPriceRange && isTagged && isInRating && isColorMatch;
  });


  return (
    <div style={{ display: 'flex', padding: '30px' }}>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', height: '100px' }}>
        <Button variant="contained" onClick={handleAddFurniture}>Add Furniture</Button>
      </div>

      <div style={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          {filteredItems.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <FurnitureCard
                title={item.description}
                price={`$${item.price}`}
                imageUrl={item.pics[0] || "https://via.placeholder.com/345x140"}
                linkDestination={`/furniture/${item.id}`}
              />
            </Grid>
          ))}
        </Grid>
      </div>

      <div style={{ display: 'flex', marginLeft: '15px' }}>
        <Filter
          tags={tags}
          setTags={setTags}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          ratingValue={ratingValue}
          setRatingValue={setRatingValue}
          colorsValue={colorsValue}
          setColors={setColors}
        />
      </div>
    </div>
  );
};

export default FurniturePage;