# F1 Timesheet Replay Demo Guide

This guide provides quick bullet points for a 1-2 minute demonstration of the F1 Timesheet Replay application.

## Setup (Before Demo)

1.  Ensure Docker is running.
2.  Open your terminal and navigate to the `f1-timesheet` root directory.
3.  Run `docker-compose up --build` to start both backend and frontend services.
4.  Open your web browser to `http://localhost:5173`.
5.  (Optional) Have a second browser tab open to `http://localhost:3001/api/snapshot` to show the raw data.

## Demo Steps (1-2 minutes)

1.  **Introduction (10 seconds)**
    *   "This is the F1 Timesheet Replay app, built for the hackathon. It visualizes a past F1 race in real-time."
    *   "We're currently viewing the Bahrain Grand Prix 2024."

2.  **Initial State (15 seconds)**
    *   Point out the timesheet table: "You can see the initial grid, driver names, teams, and car numbers."
    *   Mention the default dark mode and responsive layout.
    *   "The data is loaded from a bundled `raceData.json` file, so it works completely offline."

3.  **Start Replay (30 seconds)**
    *   Click the "Play" button.
    *   "As the replay progresses, you'll see lap times update, driver positions change, and sector times highlighted."
    *   Explain sector colors: "Green means an improved sector, purple is a personal best, and yellow indicates a slower sector."
    *   Point out the progress bar and current lap.

4.  **Controls (30 seconds)**
    *   "We have full control over the replay."
    *   Click "Pause": "You can pause the action at any moment."
    *   Change "Speed" to `2x` or `4x`: "Speed up the replay to quickly get through the race."
    *   Use the "Seek" slider: "Jump to any point in the race, either by overall progress or by lap number."
    *   Click "Restart": "And restart the session from the beginning."

5.  **Backend & Offline Capability (15 seconds - optional, if time permits)**
    *   "The backend is a Node.js Express server with a WebSocket for real-time updates."
    *   "It can fetch live data from the OpenF1 API, but for reliability, it defaults to our bundled `raceData.json`."
    *   (If showing `docker-compose.yml`): "Everything runs easily with Docker Compose."

6.  **Conclusion (10 seconds)**
    *   "This provides a dynamic and interactive way to relive F1 races."
    *   "Thank you!"