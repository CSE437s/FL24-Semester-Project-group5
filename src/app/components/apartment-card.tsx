import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';

interface ApartmentCardProps {
  title: string;
  address: string;
  price: string;
  imageUrl: string;
  linkDestination: string;
}

export const ApartmentCard = ({ title, address, price, imageUrl, linkDestination }: ApartmentCardProps) => {
  console.log(imageUrl);
  return (
    <Link href={linkDestination} passHref>
    <Card className="w-full sm:w-52 md:w-60 lg:w-72 border border-gray-300 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
    <CardMedia
      component="img"
      className="h-56 w-full object-cover border-b border-gray-300"
      image={imageUrl}
      alt={title}
    />
      <CardContent className="flex flex-col gap-0.5 px-4 py-2">
        <Typography gutterBottom variant="h5" component="div" className="text-lg p-0 m-0 font-semibold text-left">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="text-left text-gray-600">
          {address}
        </Typography>
        <Box mt={2}>
          <Typography variant="h6" color="primary" className="text-blue-800 text-lg p-0 m-0 font-medium">
            {price}
          </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};
