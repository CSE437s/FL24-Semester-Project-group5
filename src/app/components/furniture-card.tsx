import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';

interface FurnitureCardProps {
  title: string;
  price: string;
  imageUrl: string;
  // id: number;
  linkDestination: string;
}

const FurnitureCard = ({ title, price, imageUrl, linkDestination }: FurnitureCardProps) => {
  return (
    <Link href={linkDestination} passHref>
      <Card className="w-full sm:w-52 md:w-60 lg:w-72  border border-gray-300 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <CardMedia component="img" height="140" image={imageUrl} alt={title} className="h-52 w-full object-cover border-b border-gray-300" />
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
