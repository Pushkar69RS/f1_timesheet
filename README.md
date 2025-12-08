# F1 Timesheet Replay - PaceTracer

This project provides a real-time replay of past Formula 1 race timesheets using historical timing data. It features live track mapping, driver position tracking, sector analysis, and a professional F1-themed interface.

## Recent Updates & Bug Fixes (December 2024)

### 🐛 **Critical Bug Fixes**
- **Fixed Array Undefined Errors**: Added comprehensive guards for all array operations in backend normalization and replay engine to prevent `forEach on undefined` crashes
- **Enhanced Position Data Parsing**: Implemented robust `parseXY()` function to handle multiple coordinate formats (object, string, lat/lon)
- **Fixed Live Track Map**: Track map now properly displays and updates driver positions in real-time with visible canvas rendering
- **Position Column Updates**: Driver positions now update correctly in real-time via WebSocket
- **Sector Times Display**: All three sectors (S1, S2, S3) display correctly with color-coding (purple for fastest overall, green for personal best)
- **Pit Stop Counter**: Now accurately tracks and displays the number of pit stops per driver

### ✨ **New Features**
- **Live Track Map Viewer**: Real-time visualization of all driver positions on track with team color-coding and smooth animations
- **Driver Avatar System**: Professional driver headshots with intelligent fallback to team-colored initials
- **Enhanced Landing Page**:
  - Official F1 logo integration
  - Prominent F1 car display with glow effects
  - SVG trophy representations for WDC and WCC championships
  - Complete 2025 F1 calendar with all 24 races
  - Responsive design optimized for all screen sizes
- **React Router Navigation**: Smooth navigation between landing page and timing dashboard
- **Improved Data Validation**: All incoming data from OpenF1 API is validated before processing

### 🔧 **Technical Improvements**
- Enhanced WebSocket snapshot structure with proper position data (x, y coordinates)
- Added logging for debugging (events processed, drivers loaded, position data received)
- Improved error handling and fallback mechanisms throughout the application
- Better bounds calculation for track map display
- Optimized canvas rendering with gradient backgrounds and shadows

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
## Testing the Application

### End-to-End Smoke Test

1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   - Verify console output shows: `Loaded X events, Y drivers`
   - Confirm no `forEach on undefined` errors appear
   - Check that WebSocket server is running

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   - Open `http://localhost:5173` in your browser

3. **Test Landing Page:**
   - Verify F1 logo appears in header
   - Confirm F1 car image is visible with glow effect
   - Check trophy SVGs render correctly (gold star for WDC, silver trophy for WCC)
   - Scroll to verify 2025 F1 calendar displays all 24 races
   - Click "ENTER TIMING DASHBOARD" button

4. **Test Timing Dashboard:**
   - **WebSocket Connection**: Open browser console, verify "WebSocket connected" message
   - **Driver Table**: 
     - Confirm all drivers appear with positions (P1, P2, P3, etc.)
     - Verify sector times (S1, S2, S3) display with appropriate colors
     - Check pit stop counter shows numbers (not just "P")
     - Click any driver row to see detailed stats
   - **Track Map**:
     - Verify track map canvas is visible (not hidden)
     - Confirm "LIVE TRACK MAP" title appears
     - Check driver markers (colored dots with numbers) are visible
     - Verify driver count is displayed (e.g., "20 drivers tracked")
   - **Playback Controls**:
     - Click Play button
     - Watch driver positions update in real-time
     - Verify track map markers move smoothly
     - Test speed controls (0.25x, 0.5x, 1x, 2x, 4x)
     - Try seek bar to jump to different race moments

5. **Browser Console Checks:**
   - No errors should appear
   - Look for logs: `Received snapshot timestamp`, `Rendered X markers`
   - WebSocket messages should arrive regularly during playback

### Feature-Specific Tests

#### Live Track Map Viewer
- Map should display immediately after data loads
- Driver dots should be color-coded by team
- Hovering near markers shows driver numbers clearly
- Map updates smoothly without flickering during replay

#### Driver Positions
- Position column (Pos) updates in real-time
- Positions are sorted correctly (P1 at top)
- Position changes are reflected immediately

#### Sector Times
- S1, S2, S3 columns show times in format "MM:SS.mmm"
- Purple text indicates overall fastest sector
- Green text indicates driver's personal best
- Yellow text indicates slower sector

#### Pit Stop Counter
- "Pits" column shows numerical count (1, 2, 3, etc.)
- Counter increments when driver pits
- Initial value shows "-" if no pit stops yet

#### Driver Avatars
- Driver detail panel shows avatar (headshot or initials)
- Fallback works when image not found
- Avatar has team color border

### Known Limitations
- Driver headshot images require manual addition to `/frontend/public/assets/drivers/{driverCode}.jpg`
- Track map uses simplified circular markers (car.png integration pending)
- Location data may not be available for all historical sessions

## Adding Driver Images

To add driver headshots:

1. Create folder: `frontend/public/assets/drivers/`
2. Add images named by driver code: `VER.jpg`, `HAM.jpg`, `LEC.jpg`, etc.
3. Format: JPG/PNG, recommended size: 300x300px
4. If image is missing, system automatically shows colored initials as fallback


---

## Technical Deep Dive: Critical Bug Fixes

### Problem 1: `forEach on undefined` Crashes

**Root Cause**: The backend normalization code assumed all data arrays existed, but some sessions return empty arrays or missing fields.

**Solution Implemented**:
- Added comprehensive null/undefined guards for all array operations
- Default empty arrays for missing endpoints: `const { laps = [], sectors = [], ... } = openf1Json;`
- Guard every `.forEach()` with `if (!Array.isArray(data))` checks
- Ensured `raceData.json` always contains all expected keys (even if empty arrays)

**Files Modified**:
- `backend/src/normalize.js` - Added guards around all array operations
- `backend/src/replayEngine.js` - Added validation before processing events
- `backend/scripts/fetch_session.js` - Ensured empty arrays written on fetch failures

### Problem 2: Sector Times Not Displaying

**Root Cause**: Code was looking for a separate `sectors` endpoint with `sector_duration` field, but OpenF1 actually includes sector times **directly in the lap data** as `duration_sector_1`, `duration_sector_2`, `duration_sector_3`.

**Solution Implemented**:
- Updated lap processing to extract sector times from lap object:
  ```javascript
  const sectorTimes = [
    lap.duration_sector_1 !== undefined ? lap.duration_sector_1 : null,
    lap.duration_sector_2 !== undefined ? lap.duration_sector_2 : null,
    lap.duration_sector_3 !== undefined ? lap.duration_sector_3 : null,
  ];
  ```
- Kept separate sectors endpoint processing as supplementary (for detailed segment data)
- Frontend already had proper rendering logic, just needed correct data shape

**Files Modified**:
- `backend/src/normalize.js` - Lines 62-66: Extract sectors from lap data

### Problem 3: Pit Stops Not Tracked

**Root Cause**: Two issues:
1. `is_pit_out_lap` flag in lap data was ignored
2. Dedicated `/pit` endpoint was never fetched
3. Pit counter in frontend only showed "P" indicator, not count

**Solution Implemented**:
- Extract `is_pit_out_lap` directly from lap data (line 77)
- Added `/pit` endpoint to fetch scripts
- Process pit endpoint data as dedicated pit events
- Backend tracks `pitStopCount` per driver
- Frontend displays numerical count instead of just indicator

**Files Modified**:
- `backend/src/normalize.js` - Lines 77, 177-200: Pit detection and processing
- `backend/scripts/fetch_session.js` - Line 24: Added pit endpoint
- `backend/src/replayEngine.js` - Lines 86, 201: Pit counter tracking
- `frontend/src/components/DriverRow.jsx` - Lines 104-106: Display count

### Problem 4: Position Column Not Updating

**Root Cause**: Position events were being created but the WebSocket snapshot merging wasn't preserving race position data correctly.

**Solution Verified**: Existing code already handles this correctly via position events (kind: 'position'). The replayEngine properly merges position updates into driver snapshots.

**No Changes Needed** - Just needed to ensure position endpoint is fetched (already was).

### Problem 5: Track Map Not Visible / Not Working

**Root Cause**:
1. Location endpoint wasn't being fetched
2. Track map had no actual canvas dimensions
3. No coordinate normalization logic
4. Missing safety checks for missing location data

**Solution Implemented**:
- Added `/location` endpoint fetching (both scripts)
- Implemented `parseXY()` function to handle various coordinate formats
- Rebuilt TrackMap component with:
  - Explicit 800x500 canvas
  - Automatic bounds calculation from driver positions
  - Proper coordinate-to-pixel transformation
  - Fallback message when location data unavailable
  - Team-colored driver markers with numbers

**Files Modified**:
- `backend/src/normalize.js` - Lines 4-14, 192-220: parseXY() and location processing
- `backend/scripts/fetch_session.js` - Line 23: Added location endpoint
- `backend/src/replayEngine.js` - Lines 85, 203-205: Location coordinate storage
- `frontend/src/components/TrackMap.jsx` - Complete rebuild

### Problem 6: Driver Details Panel Crashes

**Root Cause**: Missing null checks and undefined field access.

**Solution Implemented**:
- Created `DriverAvatar` component with robust fallback logic
- Added team-colored initials when headshot unavailable
- Integrated safely into DriverDetail component with null checks

**Files Modified**:
- `frontend/src/components/DriverAvatar.jsx` - New component with fallback
- `frontend/src/components/DriverDetail.jsx` - Safe integration

### Data Flow Summary

```
OpenF1 API
    ↓
fetch_session.js → fetches all 8 endpoints (laps, sectors, stints, drivers, positions, location, pit, session)
    ↓
raceData.json → stored with all fields (even if empty arrays)
    ↓
normalize.js → processes all arrays safely, creates timeline events
    ↓
replayEngine.js → builds per-frame driver snapshots with:
    - position (race standing)
    - sectorTimes [s1, s2, s3]
    - pitStopCount
    - x, y (track coordinates)
    - lap times, tyres, etc.
    ↓
WebSocket → streams snapshots to frontend
    ↓
React Components → display with null-safe rendering
```

### Testing Checklist

To verify all fixes work:

1. **Fetch a session with complete data** (e.g., 9158 - Bahrain 2024 Race):
   ```bash
   cd backend
   npm run fetch_session 9158
   ```
   Expected: All endpoints return data, no errors

2. **Fetch a session with missing data** (e.g., 9947 - incomplete session):
   ```bash
   npm run fetch_session 9947
   ```
   Expected: Some endpoints return 0 records, but no crashes. Empty arrays written to raceData.json.

3. **Start backend**:
   ```bash
   npm run dev
   ```
   Expected: "Loaded X events, Y drivers" with no forEach errors

4. **Start frontend** and test:
   - ✅ Position column updates during replay
   - ✅ S1, S2, S3 show times with color coding
   - ✅ Pits column shows numerical count (1, 2, 3...)
   - ✅ Track map displays with driver dots
   - ✅ Clicking driver shows detail panel with avatar
   - ✅ No console errors

### API Endpoint Reference

Based on OpenF1 v1 API (https://api.openf1.org/v1/):

- `/laps` - Contains duration_sector_1/2/3, is_pit_out_lap, lap_duration
- `/sectors` - Detailed segment timing (optional, for deeper analysis)
- `/stints` - Tire compound info, stint lap ranges
- `/drivers` - Driver metadata (number, name, team, headshot_url)
- `/positions` - Race position by timestamp
- `/location` - X, Y, Z coordinates for track mapping
- `/pit` - Dedicated pit stop events with pit_duration
- `/sessions` - Session metadata

All endpoints accept `?session_key=XXXX` parameter.

