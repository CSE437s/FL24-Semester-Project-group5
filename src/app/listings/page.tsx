'use client';

import React, { useEffect, useState } from 'react';
import { ApartmentCard } from '../components/apartment-card';
import ApartmentFilter from '../components/apartment-filter-card';
import Maps from '../components/map-card';
import { getCoordinatesOfAddress, haversineDistance } from './utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ApartmentItems {
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
  favorite: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
  description: string;
}

const Listings = () => {
  const [apartmentItems, setApartmentItems] = useState<ApartmentItems[]>([]);
  const [suggestions, setSuggestions] = useState<ApartmentItems[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [distRange, setDistRange] = useState<number[]>([0, 3]);
  const [filteredItems, setFilteredItems] = useState<ApartmentItems[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [bedNum, setBedNum] = useState<string>("Any");
  const [bathNum, setBathNum] = useState<string>("Any");
  const { data: session, status } = useSession();
  const router = useRouter();

  // const fetchSuggestions = async () => {
  //   if (!session?.user?.id) return;

  //   try {
  //     const response = await fetch(
  //       `http://localhost:5001/api/apartment/suggestions?user_id=${session.user.id}`
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSuggestions(data);
  //     } else {
  //       console.error("Error fetching suggestions");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching suggestions:", error);
  //   }
  // };

  const handleAddListing = () => {
    if (status === 'unauthenticated') {
      const res = confirm("You must be logged in to add a apartment listing. Do you want to log in or sign up?");
      if (res) {
        router.push('/login');
      }
    } else {
      router.push('/listings/upload');
    }
  };

  useEffect(() => {
    const fetchApartmentItems = async () => {
      try {
        let response;
        if (session?.user?.id) {

          response = await fetch(`http://localhost:5001/api/apartment?user_id=${session.user.id}`);
        } else if (status === "unauthenticated") {

          response = await fetch('http://localhost:5001/api/apartment');
        } else {
          return;
        }

        const text = await response.text();
        if (response.ok) {
          const data = JSON.parse(text);
          setApartmentItems(data);


          const locationsData = await Promise.all(data.map(async (item: ApartmentItems) => {
            const coords = await getCoordinatesOfAddress(item.location);
            if (coords) {
              return {
                latitude: coords.latitude,
                longitude: coords.longitude,
                description: item.description || "Apartment"
              };
            }
            return null;
          }));

          setLocations(locationsData.filter(loc => loc !== null));
        } else {
          console.error(`Error: ${response.status} - ${text}`);
        }
      } catch (error) {
        console.error('Error fetching apartment items:', error);
      }
    };

    if (status !== "loading") {
      // fetchSuggestions();
      fetchApartmentItems();
    }
  }, [session, status]);

  useEffect(()=>{
    console.log("apartmentItems", apartmentItems);
    console.log("filteredItems", filteredItems);

  }, [apartmentItems,filteredItems ])

  useEffect(() => {
    //massive filter proccess
    const filterItems = async () => {
      const newFilteredItems = await Promise.all(apartmentItems.map(async (item, index) => {

        const isInRange = item.price >= priceRange[0] && item.price <= priceRange[1];
        const isNumBeds = bedNum === "Any" || (bedNum === "4+" && item.bedrooms >= 4) ||
          (bedNum !== "4+" && item.bedrooms === parseInt(bedNum || '0'));
        const isNumBaths = bathNum === "Any" || (bathNum === "4+" && item.bathrooms >= 4) ||
          (bathNum !== "4+" && item.bathrooms === parseInt(bathNum || '0'));
        const apartmentLocation = locations[index];
        if (apartmentLocation) {
          const distToUser = haversineDistance(apartmentLocation.latitude, apartmentLocation.longitude);
          const isWithinDistance = await distToUser <= distRange[1] && await distToUser >= distRange[0];
          console.log(priceRange[1]);
          if (isInRange && isNumBeds && isNumBaths && isWithinDistance) {

            return item;
          }
        }
        return null;
      }));

      //build location filter for map icon
      const validFilteredItems = newFilteredItems.filter(item => item !== null) as ApartmentItems[];

      setFilteredItems(validFilteredItems);

      const validFilteredLocations = locations.filter((_, index) =>
        validFilteredItems.some(item => item.id === apartmentItems[index].id)
      );
      setFilteredLocations(validFilteredLocations);
    };

    filterItems();
  }, [apartmentItems, locations, priceRange, distRange, bedNum, bathNum]);

  let hi = [''];
  filteredItems.filter(item => {
    hi.push(item.location);
  });


  const toggleFavorite = async (id: number) => {
    if (session) {
      const updatedItems = apartmentItems.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      );
      setApartmentItems(updatedItems);

      try {
        await fetch(`http://localhost:5001/api/apartment/${id}/favorite`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session.user.id,
            listing_id: id,
            listing_type: "apartment",
            favorite: updatedItems.find((item) => item.id === id)?.favorite,
          }),
        });
        // fetchSuggestions();
      } catch (error) {
        console.error("Error updating favorite:", error);
      }
    } else {
      const res = confirm(
        "You must be logged in to heart an apartment listing. Do you want to log in or sign up?"
      );
      if (res) {
        router.push("/login");
      }
    }
  };


  return (
    <div className="flex flex-col  lg:flex-row p-8 space-x-0 lg:space-x-4">
      {/* Map Section */}
      <div className="w-full lg:w-7/10 h-[1000px]">
        <Maps locations={filteredLocations} names={hi} />
      </div>

      {/* Apartment Listings Section */}
      <div className="w-full lg:w-3/10 flex-grow pt-2 lg:pt-0 lg:pl-8 overflow-y-auto">
        <ApartmentFilter
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          distRange={distRange}
          setDistRange={setDistRange}
          bedrooms={bedNum}
          setBedrooms={setBedNum}
          bathrooms={bathNum}
          setBathrooms={setBathNum}
          handleAddApartment={handleAddListing}
        />

        {suggestions.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Suggested Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 p-1">
              {suggestions.map((item) => (
                <div key={item.id} className="auto">
                  <ApartmentCard
                    title={item.description || "Apartment"}
                    address={item.location}
                    price={`$${item.price}`}
                    images={
                      item.pics?.length > 0
                        ? item.pics
                        : ["https://via.placeholder.com/345x140"]
                    }
                    linkDestination={
                      item.user_id === session?.user.id
                        ? `/listings/edit/${item.id}`
                        : `/listings/${item.id}`
                    }
                    favorite={item.favorite}
                    onFavoriteToggle={() => toggleFavorite(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}



        {/* Centered Grid of Apartment Cards */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Other Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 p-1">
            {filteredItems.map((item) => (
              <div key={item.id} className="auto">
                <ApartmentCard
                  title={item.description || "Apartment"}
                  address={item.location}
                  price={`$${item.price}`}
                  images={
                    item.pics?.length > 0
                      ? item.pics
                      : ["https://via.placeholder.com/345x140"]
                  }
                  linkDestination={
                    item.user_id === session?.user.id
                      ? `/listings/edit/${item.id}`
                      : `/listings/${item.id}`
                  }
                  favorite={item.favorite}
                  onFavoriteToggle={() => toggleFavorite(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Listings;

