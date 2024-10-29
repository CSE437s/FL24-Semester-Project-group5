const express = require('express');
const next = require('next');
const cors = require('cors'); 
const path = require('path');
const jwt = require('jsonwebtoken');
const furnitureRoutes = require('./src/app/api/furniture'); 
const apartmentRoutes = require('./src/app/api/apartment'); 
const messageRoutes = require('./src/app/api/messages');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = express(); 
  const port =  5001;

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

  const httpServer = require("http").Server(server);
  const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    },
  });
  // define users and messages
  let users = [];
  const messages = {

  }

  io.on('connection', socket => {
    console.log('Client connected');

    socket.on('join server', (userId)=> {
      const user = {
        id: userId,
        socketId: socket.id,
      };
      user.push(user);
      io.emit('new user', users); //broadcasts that a new user has joined.
    });

    socket.on("join room", async ({userId, recipientId}, cb) => {
      // socket.join(roomName);
      try {
        // Fetch userIds from the database based on user IDs
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
    
        if (!user || !recipient) return cb({ error: 'User not found' });
    
        // Generate room ID using sorted userIds
        const roomId = [user.userId, recipient.userId].sort().join('-');
        
        // Join the room
        socket.join(roomId);
    
        // Check if the room exists in the messages object
        if (!messages[roomId]) {
          messages[roomId] = [];
    
          await prisma.conversation.create({
            data: {
              user1_id: user.id,
              user2_id: recipient.id,
            },
          });
        }
    
        // Send existing (or empty) messages back to the user on joining
        cb(messages[roomId]);
      } catch (error) {
        console.error(error);
        cb({ error: 'Failed to join room' });
      }
    });

    socket.on('send message', ({content, to, sender, chatName}) =>{
      const payload = {
        content, 
        chatName: sender,
        sender
      };
      // emit a message to a particular user
      socket.to(to).emit('new message', payload)
      if (messages[chatName]){
        messages[chatName].push({
          sender, 
          content,
        });
      }
    });

    socket.on('disconnect', () => {
      users = users.filter(u=> u.socketId !== socket.id);
      // the client side is waiting for this emit to update the users currently connected
      io.emit('new user', users)
      console.log('Client disconnected');
    });
  });

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
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${port}`);
  });
});
