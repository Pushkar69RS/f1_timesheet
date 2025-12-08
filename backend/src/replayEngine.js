// backend/src/replayEngine.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { normalizeOpenF1 } = require('./normalize');
const { parseOpenF1Date } = require('./utils');

const DEFAULT_RACE_DATA_PATH = path.join(__dirname, '../raceData.json');
const OPENF1_BASE = process.env.OPENF1_BASE || 'https://api.openf1.org/v1';
const REPLAY_SPEEDS = {
  '0.25': 0.25,
  '0.5': 0.5,
  '1': 1,
  '2': 2,
  '4': 4,
};

class ReplayEngine {
  constructor() {
    this.events = [];
    this.sessionInfo = null;
    this.driversData = []; // To store the original driver list
    this.currentSnapshot = {}; // Stores the latest state of all drivers
    this.driverBestLaps = {}; // { driverId: { overall: time } }
    this.driverBestSectors = {}; // { driverId: [s1, s2, s3] }
    this.globalBestLap = null;
    this.globalBestSectors = [null, null, null];
    this.replayInterval = null;
    this.currentEventIndex = 0;
    this.replayStartTime = 0; // Timestamp when replay started (real time)
    this.sessionEventStartTime = 0; // Absolute timestamp of the first event in the session (event time)
    this.replaySpeed = REPLAY_SPEEDS[process.env.REPLAY_SPEED_DEFAULT] || 1.0;
    this.isPaused = true;
    this.totalDurationMs = 0; // Total duration of the race in milliseconds
    this.lastEventTimestamp = 0; // Timestamp of the last event in the normalized data

    this.wsClients = new Set(); // WebSocket clients
    this.lastLogTime = Date.now();
    this.eventsProcessedSinceLastLog = 0;
  }

  addWsClient(ws) {
    this.wsClients.add(ws);
    // Send current snapshot to new client
    if (Object.keys(this.currentSnapshot).length > 0) {
      ws.send(JSON.stringify({ type: 'snapshot', payload: this.currentSnapshot }));
    }
    // Send initial replay state
    ws.send(JSON.stringify({
      type: 'control_state',
      payload: {
        isPaused: this.isPaused,
        replaySpeed: this.replaySpeed,
        progress: this.getProgress(),
        currentLap: this.getCurrentLap(),
        totalLaps: this.sessionInfo ? this.sessionInfo.session_laps : 0,
        totalDurationMs: this.totalDurationMs,
        globalBestLap: this.globalBestLap,
        globalBestSectors: this.globalBestSectors,
      }
    }));
  }

  removeWsClient(ws) {
    this.wsClients.delete(ws);
  }

  broadcast(message) {
    this.wsClients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  async _fetchFromApi(sessionKey) {
    console.log(`Fetching session data for key: ${sessionKey} from OpenF1 API.`);
    try {
      const endpoints = {
        laps: `/laps?session_key=${sessionKey}`,
        sectors: `/sectors?session_key=${sessionKey}`,
        stints: `/stints?session_key=${sessionKey}`,
        drivers: `/drivers?session_key=${sessionKey}`,
        positions: `/positions?session_key=${sessionKey}`,
        location: `/location?session_key=${sessionKey}`,
        session: `/sessions?session_key=${sessionKey}`,
      };

      const fetchedData = {};
      for (const [key, endpoint] of Object.entries(endpoints)) {
        let retries = 3;
        while (retries > 0) {
          try {
            const response = await fetch(`${OPENF1_BASE}${endpoint}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status} for ${endpoint}`);
            }
            fetchedData[key] = await response.json();
            console.log(`  Fetched ${fetchedData[key].length} records for ${key}.`);
            break; // Success, break retry loop
          } catch (error) {
            console.warn(`Failed to fetch ${key} (retries left: ${retries - 1}):`, error.message);
            retries--;
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
          }
        }
      }
      return fetchedData;
    } catch (error) {
      console.error('Error fetching from OpenF1 API:', error.message);
      return null;
    }
  }

  async loadSession(sessionKey, forceOffline = false) {
    let rawData;

    const loadLocalFile = () => {
      try {
        return JSON.parse(fs.readFileSync(DEFAULT_RACE_DATA_PATH, 'utf8'));
      } catch (error) {
        console.error('Error reading local raceData.json:', error.message);
        throw new Error('Failed to load local race data. Is raceData.json present and valid?');
      }
    };

    if (forceOffline || !sessionKey) {
      console.log('Loading session data from local file:', DEFAULT_RACE_DATA_PATH);
      rawData = loadLocalFile();

      // Check for sample data and auto-fetch if needed
      if (rawData.drivers && rawData.drivers.length < 20) {
        console.log('Sample data detected. Fetching full session data for Bahrain 2024 (9158)...');
        console.log('This may take a few minutes and will only happen once.');
        const fullData = await this._fetchFromApi('9158');
        if (fullData) {
          rawData = fullData;
          try {
            fs.writeFileSync(DEFAULT_RACE_DATA_PATH, JSON.stringify(rawData, null, 2));
            console.log(`Successfully saved full session data to ${DEFAULT_RACE_DATA_PATH}`);
          } catch (writeError) {
            console.error('Failed to write full raceData.json:', writeError.message);
          }
        } else {
          console.warn('Failed to fetch full data. Proceeding with sample data.');
        }
      }
    } else {
      const fetchedData = await this._fetchFromApi(sessionKey);
      if (fetchedData) {
        rawData = fetchedData;
      } else {
        console.log('Falling back to local raceData.json due to API fetch failure.');
        rawData = loadLocalFile();
      }
    }

    this.events = normalizeOpenF1(rawData);
    this.sessionInfo = rawData.session && rawData.session.length > 0 ? rawData.session[0] : null;
    this.driversData = rawData.drivers || [];

    if (this.events.length > 0) {
      const firstEventTime = this.events[0].timestamp.getTime();
      const lastEventTime = this.events[this.events.length - 1].timestamp.getTime();

      this.sessionEventStartTime = isNaN(firstEventTime) ? 0 : firstEventTime;
      this.lastEventTimestamp = isNaN(lastEventTime) ? 0 : lastEventTime;
      this.totalDurationMs = this.lastEventTimestamp - this.sessionEventStartTime;
    } else {
      this.sessionEventStartTime = 0;
      this.lastEventTimestamp = 0;
      this.totalDurationMs = 0;
    }

    this.initializeSnapshot(this.driversData);
    this.resetReplay();
    console.log(`Session loaded. Total events: ${this.events.length}. Duration: ${this.totalDurationMs / 1000}s`);
  }

  initializeSnapshot(driversData) {
    this.currentSnapshot = {};
    this.driverBestLaps = {};
    this.driverBestSectors = {};
    this.globalBestLap = null;
    this.globalBestSectors = [null, null, null];

    driversData.forEach(d => {
      this.currentSnapshot[d.driver_number] = {
        driverId: d.driver_number,
        driverName: d.full_name,
        number: d.driver_number,
        team: d.team_name,
        position: null,
        lapNumber: 0,
        lastLapTime: null,
        bestLapTime: null,
        sectorTimes: [null, null, null],
        bestSectorTimes: [null, null, null],
        tyres: null,
        isPitLap: false,
        pitStopCount: 0,
        x: null,
        y: null,
        z: null,
        flash: false, // For UI animation
        positionChanged: 0, // -1 for down, 0 for no change, 1 for up
      };
      this.driverBestLaps[d.driver_number] = { overall: null };
      this.driverBestSectors[d.driver_number] = [null, null, null];
    });
  }

  resetReplay() {
    this.stopReplay();
    this.currentEventIndex = 0;
    this.isPaused = true;
    this.replayStartTime = 0; // Reset real-world start time
    this.initializeSnapshot(this.driversData || []); // Re-initialize snapshot for clean state

    this.broadcast({
      type: 'snapshot',
      payload: this.currentSnapshot
    });
    this.broadcast({
      type: 'control_state',
      payload: {
        isPaused: this.isPaused,
        replaySpeed: this.replaySpeed,
        progress: 0,
        currentLap: 0,
        totalLaps: this.sessionInfo ? this.sessionInfo.session_laps : 0,
        totalDurationMs: this.totalDurationMs,
        globalBestLap: this.globalBestLap,
        globalBestSectors: this.globalBestSectors,
      }
    });
  }

  startReplay() {
    if (!this.isPaused && this.replayInterval) return; // Already playing

    this.isPaused = false;
    
    // Calculate replayStartTime to resume from current event index
    const currentEventTimestamp = this.events[this.currentEventIndex]?.timestamp?.getTime();
    if (isNaN(currentEventTimestamp)) {
      this.replayStartTime = Date.now(); // If no valid current event, start from now
    } else {
      const elapsedEventTime = currentEventTimestamp - this.sessionEventStartTime;
      this.replayStartTime = Date.now() - (elapsedEventTime / this.replaySpeed);
    }

    this.replayInterval = setInterval(() => {
      this.processEvents();
    }, 50); // Check for events every 50ms
    console.log('Replay started.');
    this.broadcast({ type: 'control_state', payload: { isPaused: false } });
  }

  pauseReplay() {
    if (this.isPaused) return;
    this.isPaused = true;
    this.stopReplay();
    console.log('Replay paused.');
    this.broadcast({ type: 'control_state', payload: { isPaused: true } });
  }

  stopReplay() {
    if (this.replayInterval) {
      clearInterval(this.replayInterval);
      this.replayInterval = null;
    }
  }

  seekReplay(progress) {
    this.stopReplay();
    this.isPaused = true; // Pause during seek

    const targetEventTimeMs = this.sessionEventStartTime + (this.totalDurationMs * (progress / 100));
    let targetIndex = 0;
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].timestamp.getTime() >= targetEventTimeMs) {
        targetIndex = i;
        break;
      }
      targetIndex = i; // In case targetTime is beyond last event
    }

    this.currentEventIndex = targetIndex;
    this.initializeSnapshot(this.driversData || []); // Reset snapshot for clean seek

    // Re-process events up to the target index to build the snapshot
    for (let i = 0; i < this.currentEventIndex; i++) { // Loop up to, not including, currentEventIndex
      this.applyEventToSnapshot(this.events[i], true); // true to not broadcast intermediate events
    }
    // Apply the current event at targetIndex if it exists
    if (this.currentEventIndex < this.events.length) {
        this.applyEventToSnapshot(this.events[this.currentEventIndex], true);
    }


    // Adjust replayStartTime to align real-world time with the seeked event time
    const actualSeekedEventTime = this.events[this.currentEventIndex]?.timestamp?.getTime();
    if (!isNaN(actualSeekedEventTime)) {
        const elapsedEventTime = actualSeekedEventTime - this.sessionEventStartTime;
        this.replayStartTime = Date.now() - (elapsedEventTime / this.replaySpeed);
    } else {
        this.replayStartTime = Date.now(); // Fallback
    }


    console.log(`Replay seeked to ${progress}% (event index ${this.currentEventIndex}).`);
    this.broadcast({
      type: 'snapshot',
      payload: this.currentSnapshot
    });
    this.broadcast({
      type: 'control_state',
      payload: {
        isPaused: true,
        replaySpeed: this.replaySpeed,
        progress: this.getProgress(),
        currentLap: this.getCurrentLap(),
        totalLaps: this.sessionInfo ? this.sessionInfo.session_laps : 0,
        totalDurationMs: this.totalDurationMs,
        globalBestLap: this.globalBestLap,
        globalBestSectors: this.globalBestSectors,
      }
    });
  }

  setSpeed(speed) {
    if (REPLAY_SPEEDS[speed]) {
      this.replaySpeed = REPLAY_SPEEDS[speed];
      console.log(`Replay speed set to ${this.replaySpeed}x.`);
      this.broadcast({ type: 'control_state', payload: { replaySpeed: this.replaySpeed } });
      if (!this.isPaused) {
        this.stopReplay();
        this.startReplay(); // Restart interval with new speed
      }
    } else {
      console.warn(`Invalid replay speed: ${speed}`);
    }
  }

  processEvents() {
    if (this.isPaused || this.currentEventIndex >= this.events.length) {
      if (this.currentEventIndex >= this.events.length) {
        console.log('Replay finished.');
        this.pauseReplay();
        this.broadcast({ type: 'replay_finished' });
      }
      return;
    }

    const currentTime = Date.now();
    const elapsedRealTime = (currentTime - this.replayStartTime) * this.replaySpeed;
    const targetEventTime = this.sessionEventStartTime + elapsedRealTime; // Use sessionEventStartTime as base

    let eventsToProcess = [];
    while (this.currentEventIndex < this.events.length &&
           this.events[this.currentEventIndex].timestamp.getTime() <= targetEventTime) {
      eventsToProcess.push(this.events[this.currentEventIndex]);
      this.currentEventIndex++;
    }

    if (eventsToProcess.length > 0) {
      this.eventsProcessedSinceLastLog += eventsToProcess.length;
      eventsToProcess.forEach(event => this.applyEventToSnapshot(event));
      this.broadcast({ type: 'snapshot', payload: this.currentSnapshot });
      this.broadcast({
        type: 'control_state',
        payload: {
          progress: this.getProgress(),
          currentLap: this.getCurrentLap(),
          globalBestLap: this.globalBestLap,
          globalBestSectors: this.globalBestSectors,
        }
      });
    }

    // Log events/sec
    if (currentTime - this.lastLogTime >= 1000) {
      // console.log(`Processed ${this.eventsProcessedSinceLastLog} events/sec`);
      this.eventsProcessedSinceLastLog = 0;
      this.lastLogTime = currentTime;
    }
  }

  applyEventToSnapshot(event, isSeek = false) {
    const driver = this.currentSnapshot[event.driverId];
    if (!driver) return; // Should not happen if drivers are initialized correctly

    // Reset flash and positionChanged for all drivers before applying new event
    if (!isSeek) {
      Object.values(this.currentSnapshot).forEach(d => {
        d.flash = false;
        d.positionChanged = 0;
      });
    }

    switch (event.kind) {
      case 'lap':
        driver.lapNumber = event.lapNumber;
        driver.lastLapTime = event.lapTimeSeconds;
        driver.sectorTimes = event.sectorTimes;
        driver.isPitLap = event.isPitLap;
        driver.tyres = event.tyres;
        driver.flash = true; // Flash on lap completion

        // Update driver's best lap
        if (event.lapTimeSeconds !== null && (!this.driverBestLaps[driver.driverId].overall || event.lapTimeSeconds < this.driverBestLaps[driver.driverId].overall)) {
          this.driverBestLaps[driver.driverId].overall = event.lapTimeSeconds;
          driver.bestLapTime = event.lapTimeSeconds;
        }
        // Update global best lap
        if (event.lapTimeSeconds !== null && (!this.globalBestLap || event.lapTimeSeconds < this.globalBestLap)) {
          this.globalBestLap = event.lapTimeSeconds;
        }

        // Update best sectors
        event.sectorTimes.forEach((sTime, index) => {
          if (sTime !== null) {
            if (!this.driverBestSectors[driver.driverId][index] || sTime < this.driverBestSectors[driver.driverId][index]) {
              this.driverBestSectors[driver.driverId][index] = sTime;
              driver.bestSectorTimes[index] = sTime; // Update driver's current best sector
            }
            // Update global best sector
            if (!this.globalBestSectors[index] || sTime < this.globalBestSectors[index]) {
              this.globalBestSectors[index] = sTime;
            }
          }
        });
        break;
      case 'sector':
        // If a sector event comes without a lap event, update sector times
        if (event.sectorTimes) {
          event.sectorTimes.forEach((sTime, index) => {
            if (sTime !== null) {
              driver.sectorTimes[index] = sTime;
              // Update driver's current best sector if it's an improvement
              if (!this.driverBestSectors[driver.driverId][index] || sTime < this.driverBestSectors[driver.driverId][index]) {
                this.driverBestSectors[driver.driverId][index] = sTime;
                driver.bestSectorTimes[index] = sTime;
              }
              // Update global best sector
              if (!this.globalBestSectors[index] || sTime < this.globalBestSectors[index]) {
                this.globalBestSectors[index] = sTime;
              }
            }
          });
        }
        break;
      case 'pit':
        driver.isPitLap = true; // Mark as pit for the lap
        driver.tyres = event.tyres; // Update tyres immediately
        driver.pitStopCount += 1; // Increment pit stop counter
        driver.flash = true; // Flash on pit event
        break;
      case 'position':
        if (driver.position !== null && event.position !== driver.position) {
          driver.positionChanged = event.position < driver.position ? 1 : -1; // 1 for up, -1 for down
        }
        driver.position = event.position;
        break;
      case 'location':
        driver.x = event.x;
        driver.y = event.y;
        driver.z = event.z;
        break;
    }
  }

  getProgress() {
    if (this.totalDurationMs === 0) return 0;
    if (this.currentEventIndex === 0) return 0;

    // Ensure currentEventTime is a valid number
    const currentEventTime = this.events[this.currentEventIndex - 1]?.timestamp?.getTime();
    if (isNaN(currentEventTime)) return 0; // Fallback if timestamp is invalid

    const elapsedEventTime = currentEventTime - this.sessionEventStartTime;
    return Math.min(100, (elapsedEventTime / this.totalDurationMs) * 100);
  }

  getCurrentLap() {
    if (this.currentEventIndex === 0) return 0;
    return this.events[this.currentEventIndex - 1].lapNumber || 0;
  }

  getSessionInfo() {
    return this.sessionInfo;
  }
}

module.exports = ReplayEngine;