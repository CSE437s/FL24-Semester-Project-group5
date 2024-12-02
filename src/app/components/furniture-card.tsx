import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

interface FurnitureCardProps {
  title: string;
  price: string;
  images: string[];
  linkDestination: string;
  favorite: boolean;
  onFavoriteToggle: () => void; 
  sold: boolean;
  handleSold: () => void;
}

const FurnitureCard = ({ 
  title, 
  price, 
  images, 
  linkDestination, 
  favorite, 
  onFavoriteToggle, sold, handleSold
}: FurnitureCardProps) => {

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
    onFavoriteToggle(); 
  };
  const isSold = () =>{
    handleSold();
  }
  return (
    <Link href={linkDestination} passHref>
      <Card className="w-full sm:w-52 md:w-60 lg:w-72 border border-gray-300 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        {images.length > 1 ? (
          <Swiper
            spaceBetween={10}
            pagination={true}
            modules={[Pagination]}
            className="h-52 w-full"
          >
            {images.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imageUrl}
                  alt={`${title} - Image ${index + 1}`}
                  className="h-52 w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src={images[0]}
            alt={title}
            className="h-52 w-full object-cover border-b border-gray-300"
          />
        )}
        <CardContent className="relative flex flex-col gap-0.5 px-4 py-2">
       
        <IconButton
          className="absolute top-2 right-4"
          size="small"
          aria-label="toggle favorite"
          onClick={handleFavoriteClick}
        >
          {favorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
 

          <Box className="text-left">
            <Typography
              variant="h6"
              color="primary"
              className="text-blue-800 text-lg p-0 m-0 font-medium"
            >
              {price}
            </Typography>
          </Box>
          {sold && (
              <div>
                <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bgcolor="gray"
                color="white"
                py={-1}
                textAlign="center"
                fontWeight="bold"
                zIndex={10}
                >
                <h2>SOLD</h2>
                </Box>
              </div>
            ) }
        </CardContent>
      </Card>
    </Link>
  );
};

export default FurnitureCard;
