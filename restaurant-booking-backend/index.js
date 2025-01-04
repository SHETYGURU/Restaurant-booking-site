const express = require('express');
const firebaseAdmin = require('firebase-admin');
const app = express();
const port = 3001; // You can change the port as per your requirement

// Initialize Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: 'https://neina-8cf29-default-rtdb.firebaseio.com/' // Replace with your Firebase Realtime Database URL
});

const db = firebaseAdmin.database();

// Middleware to check if the server is running
app.use((req, res, next) => {
  // Simulate the check to determine if the backend server is running
  const isServerRunning = true; // Set to false if the backend is down
  if (isServerRunning) {
    next();
  } else {
    res.status(503).json({ message: 'Backend server is down, unable to delete booking.' });
  }
});

// Delete Booking Endpoint
app.delete('/delete-booking', async (req, res) => {
  const { date, slot, table } = req.query;

  // Check if required parameters are provided
  if (!date || !slot || !table) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    // Reference to the booking in the database
    const bookingRef = db.ref(`reservations/${date}/${slot}/${table}`);

    // Deleting the booking from the Realtime Database
    await bookingRef.remove();

    return res.status(200).json({ message: 'Booking deleted successfully!' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ message: 'Failed to delete booking.' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
