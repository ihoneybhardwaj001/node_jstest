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
# node_jstest
