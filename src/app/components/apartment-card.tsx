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
  id: number;
}

export const ApartmentCard = ({ title, address, price, imageUrl, id }: ApartmentCardProps) => {
  return (
    <Link href={`/listings/${id}`} passHref>
    <Card sx={{ maxWidth: 280, borderRadius: 2, height: '400px', boxShadow: 3 }}>
    <CardMedia
      component="img"
      sx={{ height: 180, objectFit: 'cover' }}
      image={imageUrl}
      alt={title}
    />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address}
        </Typography>
        <Box mt={2}>
          <Typography variant="h6" color="primary">
            {price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
    </Link>
  );
};
