const express = require('express');
const next = require('next');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
// const  { createServer } = require ('http');
// import { Server } from "socket.io";
// const furnitureRoutes = require('./src/app/api/furniture'); 
// const apartmentRoutes = require('./src/app/api/apartment'); 
const messageRoutes = require('./src/app/api/messages');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const port = 5001;

  // Use JSON middleware
  server.use(express.json());

  // Use CORS middleware
  server.use(cors({
    origin: 'http://localhost:3000',
  }));


  // server.use('/api/furniture', furnitureRoutes); 
  // server.use('/api/apartment', apartmentRoutes);
  server.use('/api/messages', messageRoutes)

  // Catch all other requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // const httpServer = require("http").createServer();
  // const io = require("socket.io")(httpServer, {
  //   cors: {
  //     origin: "http://localhost:3000",
  //   },
  // });
  // io.on('connection', socket => {
  //   console.log('Client connected');

  //   socket.on('disconnect', () => {
  //     console.log('Client disconnected');
  //   });
  // });

  // io.use((socket, next)=>{
  //   const token = socket.handshake.auth.token;
  //   if (token) {
  //     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //       if (err) {
  //         return next(new Error('Authentication error'));
  //       }
  //       socket.user = decoded; // Attach user info to socket
  //       next(); // Call next to continue
  //     });
  //   } else {
  //     next(new Error('Authentication error'));
  //   }
  // });

  // Start the server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${port}`);
  });
});