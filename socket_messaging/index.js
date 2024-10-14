// merge with other server file when done
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { Client } = require('pg');
// require('dotenv').config();
require('dotenv').config({ path: '/Users/jola/Desktop/compsci/WashU/cse 437/FL24-Semester-Project-group5/.env' });

// come back to do CORS layer

// adding sql connection for pg
async function main() {
  console.log( process.env.PG_DATABASE)
  // Connect to PostgreSQL
  const client = new Client({
    user: process.env.PG_USER,       // Replace with your PostgreSQL username
    host: process.env.PG_HOST,           // Replace with your PostgreSQL host
    database: process.env.PG_DATABASE,   // Replace with your database name
    password: process.env.PG_PASSWORD,   // Replace with your password
    port: process.env.PG_PORT,                  // Default PostgreSQL port
  });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'socket.html'));
});

io.on('connection', async(socket) => {
  socket.on('retrieve message', async (msg) => {
    let result;
    // let userID;
    try {
      const result = await client.query('INSERT INTO messages (content) VALUES ($1) RETURNING id', [msg])

      // const res = await client.query('SELECT id FROM users WHERE username = $1', [username]);
      // if(res.rows.length > 0){
      //   // userID = res.rows[0].id;
      // } else{
      //   const insertResult = await client.query('INSERT INTO messages (content) VALUES ($1) RETURNING id', [msg])
      //   userID = insertResult.rows[0].id
      // }
      result = res.rows[0]; // Get the inserted row
    } catch (e) {
      console.error('Error inserting message:', e);
      console.log("error could not insert, check pg query and connections")
      return;
    }finally {
      
    }
    io.emit('chat message', msg, result.id);
  });
    
    if (!socket.recovered) {
      // If the connection state recovery was not successful
      try {
        const serverOffset = socket.handshake.auth.serverOffset || 0;
        const res = await client.query('SELECT id, content FROM messages WHERE id > $1', [serverOffset]);
    
        // Emit each message to the socket
        res.rows.forEach(row => {
          socket.emit('chat message', row.content, row.id);
        });
      } catch (e) {
        console.log("Couldn't recover properly:", e);
      }
    }
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg)
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
}
main().catch(e => console.error('Error starting server:', e));