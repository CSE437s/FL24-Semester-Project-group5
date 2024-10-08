const express = require('express');
const next = require('next');
const cors = require('cors'); 
const path = require('path');
const furnitureRoutes = require('./src/app/api/furniture'); 
const apartmentRoutes = require('./src/app/api/apartment'); 

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express(); 
  const port =  5001;

  // Use JSON middleware
  server.use(express.json());

  // Use CORS middleware
  server.use(cors({
    origin: 'http://localhost:3000', 
  }));
  

  server.use('/api/furniture', furnitureRoutes); 
  server.use('/api/apartment', apartmentRoutes);

  // Catch all other requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${port}`);
  });
});
