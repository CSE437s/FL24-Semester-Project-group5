import React, { useEffect, useState } from 'react';
import { Typography, Grid2, Box } from '@mui/material';

interface LandingPageProps {

}

const LandingPage: React.FC<LandingPageProps> = () => {
  return (

    <Grid2 size={8}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box
          
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          
        >
          </Box>
          <Grid2 sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            <Typography variant='h4'>
              Welcome!
            </Typography>
            <Typography variant='h6'>
              Select a user to chat with.
            </Typography>
          </Grid2>
        
      </Box>
    </Grid2 >
  );
};

export default LandingPage;