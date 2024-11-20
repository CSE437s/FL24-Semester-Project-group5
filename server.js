const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const furnitureRoutes = require("./src/app/api/furniture");
const apartmentRoutes = require("./src/app/api/apartment");
const messagesRoutes = require("./src/app/api/message");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 5001;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function connectWithRetry() {
  const pool = new Pool({
    connectionString: `postgresql://cse437group5:swe workshop@db:5432/subletifydev_v2`,
  });

  for (let i = 0; i < 5; i++) {
    try {
      await pool.connect();
      console.log("Database connection established.");
      return pool;
    } catch (error) {
      console.error(`Database connection failed. Retry ${i + 1}/5...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  throw new Error("Could not connect to the database after multiple attempts.");
}

app.prepare().then(() => {
  const expressServer = express();
  const httpServer = createServer(expressServer);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  connectWithRetry().then((pool) => {
    expressServer.use(express.json());
    expressServer.use(
      cors({
        origin: "http://localhost:3000",
      })
    );

    expressServer.use("/api/furniture", furnitureRoutes);
    expressServer.use("/api/apartment", apartmentRoutes);
    expressServer.use("/api/message", messagesRoutes);

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("message", (messageData) => {
        socket.broadcast.emit("message", messageData);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    expressServer.all("*", (req, res) => {
      return handle(req, res);
    });

    httpServer.listen(port, () => {
      console.log(`> Server running on http://${hostname}:${port}`);
    });
  }).catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process if the database connection fails
  });
});
