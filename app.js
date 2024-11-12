const express = require('express');
const path = require('path');
const app = express();

// Import mailbox data from src/Data.js
const mailboxData = require(path.join(__dirname, 'src', 'Data'));

// Middleware to serve static files (HTML, CSS, JS) from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// API route to send mailbox data as JSON
app.get('/api/mailbox', (req, res) => {
//   console.log('Sending mailbox data:', mailboxData);  // Log mailbox data
  res.json(mailboxData);  // Return mailbox data as JSON
});

// Serve the HTML file for any route (acts as a catch-all)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
