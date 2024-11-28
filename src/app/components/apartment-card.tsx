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
interface ApartmentCardProps {
  title: string;
  address: string;
  price: string;
  images: string[];
  linkDestination: string;
  favorite: boolean;
  onFavoriteToggle: () => void;
  approveButton?: React.ReactNode;
  showPendingLabel?: boolean;
  approved?: boolean;
}

export const ApartmentCard = ({ title, address, price, images, linkDestination, favorite, onFavoriteToggle, approveButton, showPendingLabel = false, approved }: ApartmentCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFavoriteToggle();
  };
  return (
    <Link href={linkDestination} passHref>
      <Card className="w-full sm:w-52 md:w-60 lg:w-72 border border-gray-300 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        {images.length > 1 ? (
          // Carousel for multiple images
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
          // Single image
          <img
            src={images[0]}
            alt={title}
            className="h-52 w-full object-cover border-b border-gray-300"
          />
        )}
        <CardContent className="relative flex flex-col gap-0.5 px-4 py-2">
          {!approveButton &&
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
          }

          <Typography gutterBottom variant="h5" component="div" className="text-lg p-0 m-0 font-semibold text-left">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="text-left text-gray-600">
            {address}
          </Typography>
          {showPendingLabel && (
            <Typography
              variant="body2"
              color={approved ? "success" : "error"}

              className="absolute top-8 left-4 font-semibold"
            >
              {approved ? "Approved" : "Pending"}
            </Typography>
          )}
          <Box mt={2}>
            <Typography variant="h6" color="primary" className="text-blue-800 text-lg p-0 m-0 font-medium">
              {price}
            </Typography>
          </Box>
          {approveButton && (
            <Box className="mt-2">
              {approveButton}
            </Box>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
export default ApartmentCard;