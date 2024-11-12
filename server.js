const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize Express app
const app = express();

// Create server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server);

// Serve static files (e.g., styles, images)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the chat.html page when the user accesses the /chat route
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Socket.io events to handle real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // Broadcast when a user sends a message
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);  // Emit the message to all clients
  });

  // Handle typing indicator
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);  // Broadcast the typing indicator to others
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
