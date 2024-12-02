"use client";

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import FurnitureCard from '../components/furniture-card';
import Filter from '../components/furniture-filter-card';
import { useSession } from 'next-auth/react';  
import { useRouter } from 'next/navigation';

interface ColorData {
  colors: string[];
}
interface FurnitureItem {
  id: number;
  user_id: number; 
  price: number;
  description: string;
  condition: string;
  rating: number;
  colors: ColorData; 
  pics: string[];
  favorite: boolean;
  sold: boolean;
}

const FurniturePage = () => {
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [colorsValue, setColors] = useState<string[]>([]);
  const [sold, setSold] = useState<boolean>(false);

  const { data: session, status } = useSession(); 
  const router = useRouter();

  const handleAddFurniture = () => {
    if (status === 'unauthenticated') {
      const res = confirm("You must be logged in to add a furniture listing. Do you want to log in or sign up?");
      if(res){
        router.push('/login'); 
      }
    } else  {
      router.push('/furniture/upload'); 
    }
  };  useEffect(() => {
    const fetchFurnitureItems = async () => {
      try {
        let response;
        if (session?.user?.id) {
          
          response = await fetch(`http://localhost:5001/api/furniture?user_id=${session.user.id}`);
        } else if (status === "unauthenticated") {
    
          response = await fetch('http://localhost:5001/api/furniture');
        } else {
          return;
        }

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

    if (status !== "loading") {
      fetchFurnitureItems();
    }
  }, [session, status]);

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

  const toggleFavorite = (id: number) => {
    if (session){ 
      const updatedItems = furnitureItems.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      );
    setFurnitureItems(updatedItems);
    fetch(`http://localhost:5001/api/furniture/${id}/favorite`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: session.user.id, listing_id: id, listing_type: "furniture", favorite: updatedItems.find((item) => item.id === id)?.favorite}),
    });
  }else{
    const res = confirm("You must be logged in to heart a furniture listing. Do you want to log in or sign up?");
    if(res){
      router.push('/login'); 
    }
  }
  };

  const handleSold = (id: number, currentSoldStatus: boolean) => {
    if (sold == true) {
      const updatedSoldStatus = !currentSoldStatus;
      const updatedItems = furnitureItems.map(item =>
        item.id === id ? { ...item, sold: updatedSoldStatus } : item
      );
      setFurnitureItems(updatedItems);
      fetch(`http://localhost:5001/api/apartment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sold: updatedSoldStatus })
      });
    }
  };

  return (

    
    <div className="flex flex-col lg:flex-row gap-6 p-5 mx-10">
    {/* Grid container */}
    <div className="flex-grow">
    <Grid container spacing={4}>
  {filteredItems.map((item) => (
    <Grid item key={item.id} xs={12} sm={6} md={4}>
<FurnitureCard
    title={item.description}
    price={`$${item.price}`}
    images={item.pics && item.pics.length > 0 ? item.pics : ["https://via.placeholder.com/345x140"]}
    linkDestination={item.user_id === session?.user.id 
      ? `/furniture/edit/${item.id}` 
      : `/furniture/${item.id}`}
    favorite={item.favorite}
    onFavoriteToggle={() => toggleFavorite(item.id)}
    sold={item.sold}
    handleSold={() => handleSold(item.id, item.sold)}
/>
    </Grid>
  ))}
</Grid>
    </div>
  
    {/* Filter container */}
    <div className="w-full lg:w-1/4">
      <Filter 
        tags={tags} 
        setTags={setTags} 
        priceRange={priceRange} 
        setPriceRange={setPriceRange} 
        ratingValue={ratingValue} 
        setRatingValue={setRatingValue} 
        colorsValue={colorsValue} 
        setColors={setColors} 
        handleAddFurniture={handleAddFurniture}
      /> 
    </div>
  </div>
  
  );
};

export default FurniturePage;