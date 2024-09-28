import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
}

const FurnitureDescriptionPage = () => {
  const router = useRouter();
  console.log("iam here", router.query)
  const { id } = router.query; 

  const [furnitureItem, setFurnitureItem] = useState<FurnitureItem | null>(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      console.log("Fetching furniture item with ID:", id);
      const fetchFurnitureItem = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/furniture/${id}`);
          console.log("Response status:", response.status); 
          const data = await response.json();
          console.log("Fetched data:", data); 
          if (response.ok) {
            setFurnitureItem(data);
          } else {
            console.log(`Error: ${response.status} - ${data.message}`);
          }
        } catch (error) {
          console.log('Error fetching furniture item:', error);
        }
      };
      fetchFurnitureItem();
    }
  }, [id]);
  

  if (error) return <div>{error}</div>;
  if (!furnitureItem) return <div>Loading...</div>;

  return (
    <div>
      <h1>{furnitureItem.description}</h1>
      <p>Price: ${furnitureItem.price}</p>
      <p>Condition: {furnitureItem.condition}</p>
      <p>Rating: {furnitureItem.rating}</p>
    </div>
  );
};

export default FurnitureDescriptionPage;
