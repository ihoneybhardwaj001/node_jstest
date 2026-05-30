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

// Helper to interpret WMO weather codes
function getWeatherDescription(code) {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return codes[code] || 'Unknown';
}

// 5. Weather endpoint: returns current weather details for Delhi
app.get('/weather', async (req, res) => {
  // Delhi coordinates
  const lat = 28.6139;
  const lon = 77.2090;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    
    const data = await response.json();
    const current = data.current;
    
    res.json({
      location: 'Delhi, India',
      coordinates: { latitude: lat, longitude: lon },
      timezone: data.timezone,
      timestamp: current.time,
      weather: {
        temperature: `${current.temperature_2m}${data.current_units.temperature_2m}`,
        feelsLike: `${current.apparent_temperature}${data.current_units.apparent_temperature}`,
        humidity: `${current.relative_humidity_2m}${data.current_units.relative_humidity_2m}`,
        condition: getWeatherDescription(current.weather_code),
        isDay: current.is_day === 1 ? 'Yes' : 'No',
        precipitation: `${current.precipitation}${data.current_units.precipitation}`,
        windSpeed: `${current.wind_speed_10m}${data.current_units.wind_speed_10m}`
      },
      source: 'Open-Meteo (Free Weather API)'
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({
      error: 'Failed to retrieve weather details',
      details: error.message
    });
  }
});

// 6. UUID endpoint: returns one or more generated UUIDs
app.get('/uuid', (req, res) => {
  const crypto = require('crypto');
  const count = Math.min(Math.max(parseInt(req.query.count, 10) || 1, 1), 100);
  const uuids = Array.from({ length: count }, () => crypto.randomUUID());
  
  res.json({
    count,
    uuids: count === 1 ? uuids[0] : uuids,
  });
});

// 7. IP endpoint: returns the requester's IP address
app.get('/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.json({ ip });
});

// 8. Headers endpoint: returns all request headers
app.get('/headers', (req, res) => {
  res.json({ headers: req.headers });
});

// 9. User-Agent endpoint: returns client's User-Agent
app.get('/user-agent', (req, res) => {
  res.json({ 'user-agent': req.headers['user-agent'] || 'unknown' });
});

// Wildcard fallback route
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'Available endpoints: GET /health, GET /random, GET /delay, ALL /echo, GET /weather, GET /uuid, GET /ip, GET /headers, GET /user-agent',
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Test backend is running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`Random Number: http://localhost:${PORT}/random`);
  console.log(`Delay Endpoint: http://localhost:${PORT}/delay`);
  console.log(`Echo Endpoint: http://localhost:${PORT}/echo`);
  console.log(`Weather Delhi: http://localhost:${PORT}/weather`);
  console.log(`UUID Generator: http://localhost:${PORT}/uuid?count=1`);
  console.log(`IP Address: http://localhost:${PORT}/ip`);
  console.log(`Request Headers: http://localhost:${PORT}/headers`);
  console.log(`User Agent: http://localhost:${PORT}/user-agent`);
  console.log(`=========================================`);
});
