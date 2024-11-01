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
  linkDestination: string;
}

const FurnitureCard = ({ title, price, imageUrl, linkDestination }: FurnitureCardProps) => {
  return (
    <Link href={linkDestination} passHref>
      <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
        <CardMedia component="img" height="140" image={imageUrl} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
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
export default FurnitureCard;