// backend/src/replayEngine.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { normalizeOpenF1 } = require('./normalize');
const { getCircuit, interpolateTrackPosition } = require('./circuitData');
const { SEASON_2026_CALENDAR, DRIVERS_2026, generate2026RaceData } = require('./season2026');

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
    this.driversData = [];
    this.currentSnapshot = {};
    this.driverBestLaps = {};
    this.driverBestSectors = {};
    this.globalBestLap = null;
    this.globalBestSectors = [null, null, null];
    this.activeLapNumber = 1;
    this.replayInterval = null;
    this.currentEventIndex = 0;
    this.replayStartTime = 0;
    this.sessionEventStartTime = 0;
    this.replaySpeed = REPLAY_SPEEDS[process.env.REPLAY_SPEED_DEFAULT] || 1.0;
    this.isPaused = true;
    this.totalDurationMs = 0;
    this.lastEventTimestamp = 0;

    this.wsClients = new Set();
    this.lastLogTime = Date.now();
    this.eventsProcessedSinceLastLog = 0;
  }

  addWsClient(ws) {
    this.wsClients.add(ws);
    if (Object.keys(this.currentSnapshot).length > 0) {
      ws.send(JSON.stringify({ type: 'snapshot', payload: this.currentSnapshot }));
    }
    ws.send(JSON.stringify({
      type: 'control_state',
      payload: {
        isPaused: this.isPaused,
        replaySpeed: this.replaySpeed,
        progress: this.getProgress(),
        currentLap: this.getCurrentLap(),
        totalLaps: this.sessionInfo ? (this.sessionInfo.session_laps || 52) : 52,
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
        stints: `/stints?session_key=${sessionKey}`,
        drivers: `/drivers?session_key=${sessionKey}`,
        position: `/position?session_key=${sessionKey}`,
        location: `/location?session_key=${sessionKey}`,
        pit: `/pit?session_key=${sessionKey}`,
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
            const result = await response.json();
            fetchedData[key] = Array.isArray(result) ? result : [result];
            break;
          } catch (error) {
            retries--;
            if (retries === 0) {
              console.warn(`Failed to fetch ${key} after 3 attempts:`, error.message);
              fetchedData[key] = [];
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      }
      return fetchedData;
    } catch (error) {
      console.error('Error fetching data from OpenF1 API:', error.message);
      return null;
    }
  }

  async loadSession(sessionKey = null, forceOffline = false) {
    this.stopReplay();
    let rawData;

    if (sessionKey && String(sessionKey).startsWith('2026')) {
      console.log(`Loading 2026 Grand Prix session: ${sessionKey}`);
      rawData = generate2026RaceData(sessionKey);
    } else if (forceOffline || !sessionKey) {
      console.log('Loading session data from local file:', DEFAULT_RACE_DATA_PATH);
      try {
        rawData = JSON.parse(fs.readFileSync(DEFAULT_RACE_DATA_PATH, 'utf8'));
      } catch {
        console.log('Fallback to 2026 British Grand Prix session data.');
        rawData = generate2026RaceData('2026-12');
      }
    } else {
      const fetchedData = await this._fetchFromApi(sessionKey);
      rawData = fetchedData || generate2026RaceData('2026-12');
    }

    this.events = normalizeOpenF1(rawData);

    if (!Array.isArray(this.events)) {
      this.events = [];
    }

    this.sessionInfo = rawData.session && rawData.session.length > 0 ? rawData.session[0] : null;
    this.driversData = Array.isArray(rawData.drivers) ? rawData.drivers : [];

    console.log(`Loaded ${this.events.length} events, ${this.driversData.length} drivers`);

    if (this.events.length > 0) {
      const laps = this.events.filter(e => e.kind === 'lap');
      const firstLapTime = laps.length > 0 ? laps[0].timestamp.getTime() : this.events[0].timestamp.getTime();
      const lastEventTime = this.events[this.events.length - 1].timestamp.getTime();

      // Anchor timeline so Lap 1 starts immediately
      const raceStartTime = Math.max(this.events[0].timestamp.getTime(), firstLapTime - 45000);

      this.sessionEventStartTime = isNaN(raceStartTime) ? 0 : raceStartTime;
      this.lastEventTimestamp = isNaN(lastEventTime) ? 0 : lastEventTime;
      this.totalDurationMs = Math.max(1000, this.lastEventTimestamp - this.sessionEventStartTime);

      this.events = this.events.filter(e => e.timestamp.getTime() >= this.sessionEventStartTime);
    } else {
      this.sessionEventStartTime = 0;
      this.lastEventTimestamp = 0;
      this.totalDurationMs = 0;
    }

    this.activeLapNumber = 1;
    this.initializeSnapshot(this.driversData);
    this.resetReplay();
    console.log(`Session loaded. Total events: ${this.events.length}. Duration: ${(this.totalDurationMs / 1000).toFixed(1)}s`);
  }

  initializeSnapshot(driversData) {
    this.currentSnapshot = {};
    this.driverBestLaps = {};
    this.driverBestSectors = {};
    this.globalBestLap = null;
    this.globalBestSectors = [null, null, null];
    this.activeLapNumber = 1;

    const circuit = getCircuit(this.sessionInfo ? this.sessionInfo.circuit_short_name : 'Silverstone');

    driversData.forEach((d, idx) => {
      const gridFraction = Math.max(0, 0.05 - (idx * 0.0025));
      const lateral = (idx % 2 === 0 ? -10 : 10);
      const initPos = interpolateTrackPosition(circuit, gridFraction, lateral);

      this.currentSnapshot[d.driver_number] = {
        driverId: d.driver_number,
        driverName: d.full_name,
        number: d.driver_number,
        code: d.name_acronym || String(d.driver_number),
        team: d.team_name,
        team_colour: d.team_colour || null,
        headshot_url: d.headshot_url || null,
        country_code: d.country_code || null,
        position: idx + 1,
        lapNumber: 1,
        lastLapTime: null,
        bestLapTime: null,
        sectorTimes: [null, null, null],
        bestSectorTimes: [null, null, null],
        tyres: idx < 8 ? 'SOFT' : (idx % 2 === 0 ? 'MEDIUM' : 'HARD'),
        isPitLap: false,
        pitStopCount: 0,
        trackProgress: gridFraction,
        x: initPos.x,
        y: initPos.y,
        flash: false,
        positionChanged: 0,
      };
      this.driverBestLaps[d.driver_number] = { overall: null };
      this.driverBestSectors[d.driver_number] = [null, null, null];
    });
  }

  resetReplay() {
    this.stopReplay();
    this.currentEventIndex = 0;
    this.isPaused = true;
    this.replayStartTime = 0;
    this.activeLapNumber = 1;
    this.initializeSnapshot(this.driversData || []);

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
        currentLap: 1,
        totalLaps: this.sessionInfo ? (this.sessionInfo.session_laps || 52) : 52,
        totalDurationMs: this.totalDurationMs,
        globalBestLap: this.globalBestLap,
        globalBestSectors: this.globalBestSectors,
      }
    });
  }

  startReplay() {
    if (!this.isPaused && this.replayInterval) return;

    this.isPaused = false;
    const currentEventTimestamp = this.events[this.currentEventIndex]?.timestamp?.getTime();
    if (isNaN(currentEventTimestamp)) {
      this.replayStartTime = Date.now();
    } else {
      const elapsedEventTime = currentEventTimestamp - this.sessionEventStartTime;
      this.replayStartTime = Date.now() - (elapsedEventTime / this.replaySpeed);
    }

    this.replayInterval = setInterval(() => {
      this.processEvents();
    }, 50);
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
    this.isPaused = true;

    const targetEventTimeMs = this.sessionEventStartTime + (this.totalDurationMs * (progress / 100));
    let targetIndex = 0;
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].timestamp.getTime() >= targetEventTimeMs) {
        targetIndex = i;
        break;
      }
      targetIndex = i;
    }

    this.currentEventIndex = targetIndex;
    this.initializeSnapshot(this.driversData || []);

    for (let i = 0; i < this.currentEventIndex; i++) {
      this.applyEventToSnapshot(this.events[i], true);
    }
    if (this.currentEventIndex < this.events.length) {
      this.applyEventToSnapshot(this.events[this.currentEventIndex], true);
    }

    // Re-evaluate active lap
    const totalLaps = this.sessionInfo?.session_laps || 52;
    const estimatedLap = Math.min(totalLaps, Math.max(1, Math.floor((progress / 100) * totalLaps) + 1));
    const snapshotLaps = Object.values(this.currentSnapshot).map(d => d.lapNumber || 0);
    this.activeLapNumber = Math.max(estimatedLap, ...snapshotLaps);

    this.updateTrackCoordinates(progress / 100);

    const actualSeekedEventTime = this.events[this.currentEventIndex]?.timestamp?.getTime();
    if (!isNaN(actualSeekedEventTime)) {
      const elapsedEventTime = actualSeekedEventTime - this.sessionEventStartTime;
      this.replayStartTime = Date.now() - (elapsedEventTime / this.replaySpeed);
    } else {
      this.replayStartTime = Date.now();
    }

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
        totalLaps: this.sessionInfo ? (this.sessionInfo.session_laps || 52) : 52,
        totalDurationMs: this.totalDurationMs,
        globalBestLap: this.globalBestLap,
        globalBestSectors: this.globalBestSectors,
      }
    });
  }

  setSpeed(speed) {
    const numSpeed = parseFloat(speed);
    if (!isNaN(numSpeed) && numSpeed > 0) {
      this.replaySpeed = numSpeed;
      this.broadcast({ type: 'control_state', payload: { replaySpeed: this.replaySpeed } });
      if (!this.isPaused) {
        this.stopReplay();
        this.startReplay();
      }
    }
  }

  processEvents() {
    if (this.isPaused || this.currentEventIndex >= this.events.length) {
      if (this.currentEventIndex >= this.events.length) {
        this.pauseReplay();
        this.broadcast({ type: 'replay_finished' });
      }
      return;
    }

    const currentTime = Date.now();
    const elapsedRealTime = (currentTime - this.replayStartTime) * this.replaySpeed;
    const targetEventTime = this.sessionEventStartTime + elapsedRealTime;

    let eventsToProcess = [];
    while (this.currentEventIndex < this.events.length &&
           this.events[this.currentEventIndex].timestamp.getTime() <= targetEventTime) {
      eventsToProcess.push(this.events[this.currentEventIndex]);
      this.currentEventIndex++;
    }

    const currentProgressFrac = this.totalDurationMs > 0 ? (elapsedRealTime / this.totalDurationMs) : 0;
    this.updateTrackCoordinates(currentProgressFrac);

    if (eventsToProcess.length > 0) {
      this.eventsProcessedSinceLastLog += eventsToProcess.length;
      eventsToProcess.forEach(event => this.applyEventToSnapshot(event));
    }

    // Maintain stable current lap
    const totalLaps = this.sessionInfo?.session_laps || 52;
    const estimatedLap = Math.min(totalLaps, Math.max(1, Math.floor(currentProgressFrac * totalLaps) + 1));
    const snapshotLaps = Object.values(this.currentSnapshot).map(d => d.lapNumber || 0);
    this.activeLapNumber = Math.max(estimatedLap, ...snapshotLaps);

    this.broadcast({ type: 'snapshot', payload: this.currentSnapshot });
    this.broadcast({
      type: 'control_state',
      payload: {
        progress: this.getProgress(),
        currentLap: this.getCurrentLap(),
        totalLaps: this.sessionInfo ? (this.sessionInfo.session_laps || 52) : 52,
        globalBestLap: this.globalBestLap,
        globalBestSectors: this.globalBestSectors,
      }
    });
  }

  updateTrackCoordinates(overallProgress) {
    const circuit = getCircuit(this.sessionInfo ? this.sessionInfo.circuit_short_name : 'Silverstone');
    const totalLaps = this.sessionInfo?.session_laps || 52;

    Object.values(this.currentSnapshot).forEach(driver => {
      const pos = driver.position || 10;
      const lapProgress = ((driver.lapNumber || 1) + (overallProgress * totalLaps % 1));
      const trackProgress = (lapProgress + (20 - pos) * 0.003) % 1;

      const lateral = (pos % 2 === 0 ? 8 : -8);
      const coords = interpolateTrackPosition(circuit, trackProgress, lateral);

      driver.x = coords.x;
      driver.y = coords.y;
      driver.trackProgress = trackProgress;
    });
  }

  applyEventToSnapshot(event, isSeek = false) {
    const driver = this.currentSnapshot[event.driverId];
    if (!driver) return;

    if (!isSeek) {
      Object.values(this.currentSnapshot).forEach(d => {
        d.flash = false;
        d.positionChanged = 0;
      });
    }

    switch (event.kind) {
      case 'lap':
        driver.lapNumber = Math.max(driver.lapNumber || 1, event.lapNumber);
        driver.lastLapTime = event.lapTimeSeconds;
        driver.sectorTimes = event.sectorTimes;
        driver.isPitLap = event.isPitLap;
        driver.tyres = event.tyres;
        driver.flash = true;

        if (event.lapNumber && event.lapNumber > this.activeLapNumber) {
          this.activeLapNumber = event.lapNumber;
        }

        if (event.lapTimeSeconds !== null && (!this.driverBestLaps[driver.driverId]?.overall || event.lapTimeSeconds < this.driverBestLaps[driver.driverId].overall)) {
          this.driverBestLaps[driver.driverId] = { overall: event.lapTimeSeconds };
          driver.bestLapTime = event.lapTimeSeconds;
        }
        if (event.lapTimeSeconds !== null && (!this.globalBestLap || event.lapTimeSeconds < this.globalBestLap)) {
          this.globalBestLap = event.lapTimeSeconds;
        }

        if (Array.isArray(event.sectorTimes)) {
          event.sectorTimes.forEach((sTime, index) => {
            if (sTime !== null) {
              if (!this.driverBestSectors[driver.driverId]?.[index] || sTime < this.driverBestSectors[driver.driverId][index]) {
                if (!this.driverBestSectors[driver.driverId]) this.driverBestSectors[driver.driverId] = [null, null, null];
                this.driverBestSectors[driver.driverId][index] = sTime;
                driver.bestSectorTimes[index] = sTime;
              }
              if (!this.globalBestSectors[index] || sTime < this.globalBestSectors[index]) {
                this.globalBestSectors[index] = sTime;
              }
            }
          });
        }
        break;

      case 'sector':
        if (Array.isArray(event.sectorTimes)) {
          event.sectorTimes.forEach((sTime, index) => {
            if (sTime !== null) {
              driver.sectorTimes[index] = sTime;
              if (!this.driverBestSectors[driver.driverId]?.[index] || sTime < this.driverBestSectors[driver.driverId][index]) {
                if (!this.driverBestSectors[driver.driverId]) this.driverBestSectors[driver.driverId] = [null, null, null];
                this.driverBestSectors[driver.driverId][index] = sTime;
                driver.bestSectorTimes[index] = sTime;
              }
              if (!this.globalBestSectors[index] || sTime < this.globalBestSectors[index]) {
                this.globalBestSectors[index] = sTime;
              }
            }
          });
        }
        break;

      case 'pit':
        driver.isPitLap = true;
        driver.tyres = event.tyres;
        driver.pitStopCount += 1;
        driver.flash = true;
        break;

      case 'position':
        if (driver.position !== null && event.position !== driver.position) {
          driver.positionChanged = event.position < driver.position ? 1 : -1;
        }
        driver.position = event.position;
        break;
    }
  }

  getProgress() {
    if (this.totalDurationMs === 0) return 0;
    if (this.currentEventIndex === 0) return 0;

    const currentEventTime = this.events[this.currentEventIndex - 1]?.timestamp?.getTime();
    if (isNaN(currentEventTime)) return 0;

    const elapsedEventTime = currentEventTime - this.sessionEventStartTime;
    return Math.min(100, Math.max(0, (elapsedEventTime / this.totalDurationMs) * 100));
  }

  getCurrentLap() {
    return Math.max(1, this.activeLapNumber || 1);
  }

  getSessionInfo() {
    const circuit = getCircuit(this.sessionInfo ? this.sessionInfo.circuit_short_name : 'Silverstone');
    return {
      ...(this.sessionInfo || {}),
      circuit,
    };
  }
}

module.exports = ReplayEngine;