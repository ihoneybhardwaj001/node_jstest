# Test Backend API

A lightweight, robust Node.js backend using Express, designed for testing HTTP requests, response delays, random data generation, and endpoint verification.

## Getting Started

### 1. Installation

If you haven't already, install the dependencies by running the following command in this directory:

```bash
npm install
```

### 2. Running the Server

Start the backend server:

```bash
npm start
```

By default, the server will start on port `3000`. You can customize the port by setting the `PORT` environment variable:

```bash
PORT=4000 npm start
```

---

## API Endpoints

### 1. Health Check
*   **Path**: `GET /health`
*   **Description**: Verifies that the server is running and returns simple status and system telemetry.
*   **Example curl**:
    ```bash
    curl http://localhost:3000/health
    ```
*   **Expected Response**:
    ```json
    {
      "status": "UP",
      "timestamp": "2026-05-30T14:30:00.000Z",
      "uptime": "12.34s",
      "memoryUsage": { ... },
      "platform": "darwin"
    }
    ```

### 2. Random Number Generator
*   **Path**: `GET /random`
*   **Description**: Generates a random integer within a range.
*   **Query Parameters**:
    *   `min` (optional, default: `1`)
    *   `max` (optional, default: `100`)
*   **Example curl**:
    ```bash
    curl "http://localhost:3000/random?min=10&max=50"
    ```

### 3. Response Delay Simulator
*   **Path**: `GET /delay`
*   **Description**: Simulates high latency or slow network responses. Very useful for testing client timeouts.
*   **Query Parameters**:
    *   `ms` (optional, default: `1000` milliseconds)
*   **Example curl**:
    ```bash
    curl "http://localhost:3000/delay?ms=2000"
    ```

### 4. Echo Request
*   **Path**: `ALL /echo` (supports GET, POST, PUT, DELETE, PATCH, etc.)
*   **Description**: Echoes the request headers, body, query parameters, and HTTP method back to the sender. Extremely useful for debugging clients.
*   **Example curl**:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"hello": "world"}' http://localhost:3000/echo
    ```

### 5. Delhi Weather Info
*   **Path**: `GET /weather`
*   **Description**: Fetches current, real-time weather details for Delhi, India using the free, public Open-Meteo API.
*   **Example curl**:
    ```bash
    curl http://localhost:3000/weather
    ```
*   **Expected Response**:
    ```json
    {
      "location": "Delhi, India",
      "coordinates": {
        "latitude": 28.6139,
        "longitude": 77.209
      },
      "timezone": "Asia/Kolkata",
      "timestamp": "2026-05-30T17:15",
      "weather": {
        "temperature": "32.2°C",
        "feelsLike": "35.4°C",
        "humidity": "49%",
        "condition": "Overcast",
        "isDay": "Yes",
        "precipitation": "0mm",
        "windSpeed": "5.2km/h"
      },
      "source": "Open-Meteo (Free Weather API)"
    }
    ```

### 6. UUID Generator
*   **Path**: `GET /uuid`
*   **Description**: Generates one or more random Version 4 UUIDs.
*   **Query Parameters**:
    *   `count` (optional, default: `1`, max: `100`): The number of UUIDs to generate. If `count=1`, a single UUID string is returned. If greater than 1, an array of UUIDs is returned.
*   **Example curl**:
    ```bash
    curl "http://localhost:3000/uuid?count=3"
    ```

### 7. IP Address Lookup
*   **Path**: `GET /ip`
*   **Description**: Returns the requester's IP address.
*   **Example curl**:
    ```bash
    curl http://localhost:3000/ip
    ```

### 8. Request Headers Echo
*   **Path**: `GET /headers`
*   **Description**: Returns all HTTP headers received by the server in the request.
*   **Example curl**:
    ```bash
    curl http://localhost:3000/headers
    ```

# node_jstest



