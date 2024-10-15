import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define custom marker icon
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41], 
});

interface Location {
    latitude: number;
    longitude: number;
  }
  
  interface MapsProps {
    locations: Location[]; 
    names: string[];
  }

const Maps: React.FC<MapsProps> = ({ locations , names }) => {
  console.log("names",names);
    if (locations[0] === undefined){
      return (
      <MapContainer
      //brookings as center
        center={[38.648942, -90.311551]}  
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

      </MapContainer>
    );

    }else{
    return (
    
      <MapContainer
       //brookings as centers
       center={[38.648942, -90.311551]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location, index) => (
          <Marker key={index} position={[location.latitude, location.longitude]} icon={customIcon}>
            <Popup>
              Location: {names[index + 1]}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
}
  };

export default Maps;
