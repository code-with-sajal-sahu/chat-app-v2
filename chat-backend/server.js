import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/Routes.js';
import connectDB from './src/config/DbConnection.js';
import initializeSocket from './src/config/SocketConnection.js';
import http from 'http';
import socketConfig from './src/config/SocketConfig.js';
// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = http.createServer(app);
// Middleware
app.use(cors());
app.use(express.json());
app.use("/public/upload", express.static('public/upload'));
// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});

// const io = initializeSocket(httpServer);
const io = socketConfig(httpServer);
