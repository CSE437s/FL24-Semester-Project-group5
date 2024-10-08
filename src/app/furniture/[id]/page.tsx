"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ColorData {
  colors: string[] | null; // Allow colors to be null
}

interface FurnitureItem {
  id: number;
  userId: number; 
  price: number;
  description: string;
  condition: string;
  rating: number;
  colors: ColorData | null; // Allow colors to be null
}

const FurnitureDescriptionPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params['id']; 

  const [furnitureItem, setFurnitureItem] = useState<FurnitureItem | null>(null); 
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

  console.log(furnitureItem.colors);

  // Handle the case where colors might be null or an empty array
  const colorList = furnitureItem.colors
    ? furnitureItem.colors.join(', ') 
    : 'None'; 

  return (
    <div>
      <h1>{furnitureItem.description}</h1>
      <p>Price: ${furnitureItem.price}</p>
      <p>Condition: {furnitureItem.condition}</p>
      <p>Rating: {furnitureItem.rating}</p>
      <p>Colors: {colorList}</p> 
    </div>
  );
};

export default FurnitureDescriptionPage;
