# F1 Timesheet Replay

This project provides a real-time replay of past Formula 1 race timesheets using historical timing data. It's designed for an 8-hour hackathon, focusing on reliability, a polished UI, and ease of deployment.

## Architecture

```
+-------------------+       +-------------------+
|     Frontend      |       |      Backend      |
| (React, Vite, JS) |       | (Node.js, Express)|
|                   |       |                   |
| +---------------+ |       | +---------------+ |
| |  App.jsx      | |       | |  server.js    | |
| |  (UI, WS Client)|<------>| |  (API, WS Server)|
| +---------------+ |       | +---------------+ |
|         |         |       |         |         |
| +---------------+ |       | +---------------+ |
| | Components    | |       | |  replayEngine.js| |
| | (Table, Controls)|<------>| |  (Data, Replay Logic)|
| +---------------+ |       | +---------------+ |
|                   |       |         |         |
|                   |       | +---------------+ |
|                   |       | |  normalize.js | |
|                   |       | |  (Data Mapping)|
|                   |       | +---------------+ |
|                   |       |         |         |
|                   |       | +---------------+ |
|                   |       | |  raceData.json| |
|                   |       | |  (Fallback Data)|
|                   |       | +---------------+ |
+-------------------+       +-------------------+
```

## Getting Started

### Prerequisites

*   Node.js (v18+)
*   npm
*   Docker and Docker Compose (for containerized setup)

### Local Development

1.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```
2.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```
3.  **Run Backend:**
    ```bash
    cd ../backend
    npm run dev
    ```
    The backend will start on `http://localhost:3001`.
4.  **Run Frontend:**
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend will start on `http://localhost:5173`. Open your browser to this address.

### Docker Compose

To run both the backend and frontend using Docker:

```bash
docker-compose up --build
```

The frontend will be accessible at `http://localhost:5173` and the backend at `http://localhost:3001`.

### Offline Mode and Session Key

By default, the application uses the bundled `backend/raceData.json` for the **Bahrain Grand Prix 2024 (Session Key: 9158)**.

*   **Force Offline Mode:**
    To explicitly force the backend to use the local `raceData.json` even if `SESSION_KEY` is set, you can set the `OFFLINE` environment variable to `true`.
    *   **Local:** Set `OFFLINE=true` in your shell before running `npm run dev` for the backend.
    *   **Docker:** Uncomment `OFFLINE: "true"` in `docker-compose.yml` under the `backend` service.

*   **Load a Different Session:**
    To fetch and replay data from a different OpenF1 session, provide the `SESSION_KEY` environment variable.
    *   **Local:** Set `SESSION_KEY=<your_session_key>` in your shell before running `npm run dev` for the backend.
    *   **Docker:** Uncomment and set `SESSION_KEY: <your_session_key>` in `docker-compose.yml` under the `backend` service.
    *   You can find session keys from the OpenF1 API documentation or by exploring their endpoints.

### Available npm Scripts

**Backend:**
*   `npm run dev`: Starts the backend server in development mode.
*   `npm start`: Starts the backend server (production equivalent).
*   `npm run fetch_session`: Fetches data for a given `SESSION_KEY` from OpenF1 and saves it to `raceData.json`. Usage: `npm run fetch_session <session_key>`.
*   `npm run generate_mock_feed`: Starts a local WebSocket server that replays `raceData.json` for offline testing.
*   `npm test`: Runs Jest tests for the backend.

**Frontend:**
*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the frontend for production.
*   `npm start`: Serves the production build (after `npm run build`).