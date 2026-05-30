const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON and text/raw body parsing
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Simple logger middleware to print request details
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// 1. Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    memoryUsage: process.memoryUsage(),
    platform: process.platform,
  });
});

// 2. Random endpoint: returns a random number, optionally scoped by min/max query parameters
app.get('/random', (req, res) => {
  const min = parseInt(req.query.min, 10) || 1;
  const max = parseInt(req.query.max, 10) || 100;

  if (min > max) {
    return res.status(400).json({
      error: 'Invalid range: min cannot be greater than max.',
    });
  }

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  res.json({
    min,
    max,
    number: randomNumber,
  });
});

// 3. Delay endpoint: simulates a slow response by waiting for specified milliseconds
app.get('/delay', (req, res) => {
  const delayMs = parseInt(req.query.ms, 10) || 1000;

  console.log(`Delaying response for ${delayMs}ms...`);
  setTimeout(() => {
    res.json({
      delayed: true,
      durationMs: delayMs,
      message: `Successfully waited ${delayMs}ms before responding.`,
    });
  }, delayMs);
});

// 4. Echo endpoint: echoes back all request details
app.all('/echo', (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
  });
});

// Wildcard fallback route
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'Available endpoints: GET /health, GET /random, GET /delay, ALL /echo',
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Test backend is running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`Random Number: http://localhost:${PORT}/random`);
  console.log(`Delay Endpoint: http://localhost:${PORT}/delay`);
  console.log(`Echo Endpoint: http://localhost:${PORT}/echo`);
  console.log(`=========================================`);
});
