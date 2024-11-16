import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';


interface FurnitureCardProps {
  title: string;
  price: string;
  images: string[];
  // id: number;
  linkDestination: string;
}
import { Pagination } from 'swiper/modules';
const FurnitureCard = ({ title, price, images, linkDestination }: FurnitureCardProps) => {
  console.log("hi",images[0]);
  return (
    <Link href={linkDestination} passHref>
      <Card className="w-full sm:w-52 md:w-60 lg:w-72  border border-gray-300 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
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
        <CardContent className="flex flex-col gap-0.5 px-4 py-2">
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Box className="text-left">
            <Typography variant="h6" color="primary" className="text-blue-800 text-lg p-0 m-0 font-medium">
              {price}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FurnitureCard;
