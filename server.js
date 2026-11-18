/**
 * @file Entry point for the Triviabook Express API.
 * Name: Sangye Tenphel
 * Date: 11.17.2026
 * CSC 372-01
 */

require('dotenv').config();
const express = require('express');
const triviaRouter = require('./routes/trivia-router'); // Notice this is './' not '../'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use our router for all /triviabook routes
app.use('/triviabook', triviaRouter);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Triviabook API listening on port ${PORT}`);
});