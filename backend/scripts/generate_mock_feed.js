// backend/scripts/generate_mock_feed.js
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { normalizeOpenF1 } = require('../src/normalize');

const MOCK_PORT = process.env.MOCK_PORT || 3002;
const DEFAULT_RACE_DATA_PATH = path.join(__dirname, '../raceData.json');

const wss = new WebSocket.Server({ port: MOCK_PORT });

let events = [];
let currentEventIndex = 0;
let replayInterval = null;
let replaySpeed = 1.0;
let isPaused = true;
let eventStartTime = 0;
let replayStartTime = 0;

function loadMockData() {
  try {
    const rawData = JSON.parse(fs.readFileSync(DEFAULT_RACE_DATA_PATH, 'utf8'));
    events = normalizeOpenF1(rawData);
    if (events.length > 0) {
      eventStartTime = events[0].timestamp.getTime();
    }
    console.log(`Mock data loaded. Total events: ${events.length}`);
  } catch (error) {
    console.error('Error loading mock raceData.json:', error.message);
    process.exit(1);
  }
}

function startReplay() {
  if (!isPaused && replayInterval) return;
  isPaused = false;
  replayStartTime = Date.now();
  replayInterval = setInterval(processEvents, 50);
  console.log('Mock replay started.');
}

function pauseReplay() {
  if (isPaused) return;
  isPaused = true;
  stopReplay();
  console.log('Mock replay paused.');
}

function stopReplay() {
  if (replayInterval) {
    clearInterval(replayInterval);
    replayInterval = null;
  }
}

function seekReplay(progress) {
  stopReplay();
  isPaused = true;

  const totalDurationMs = events[events.length - 1].timestamp.getTime() - eventStartTime;
  const targetTimeMs = eventStartTime + (totalDurationMs * (progress / 100));

  let targetIndex = 0;
  for (let i = 0; i < events.length; i++) {
    if (events[i].timestamp.getTime() >= targetTimeMs) {
      targetIndex = i;
      break;
    }
    targetIndex = i;
  }
  currentEventIndex = targetIndex;
  console.log(`Mock replay seeked to ${progress}% (event index ${currentEventIndex}).`);
}

function setSpeed(speed) {
  replaySpeed = speed;
  console.log(`Mock replay speed set to ${replaySpeed}x.`);
  if (!isPaused) {
    stopReplay();
    startReplay();
  }
}

function resetReplay() {
  stopReplay();
  isPaused = true;
  currentEventIndex = 0;
  console.log('Mock replay reset.');
}

function processEvents() {
  if (isPaused || currentEventIndex >= events.length) {
    if (currentEventIndex >= events.length) {
      console.log('Mock replay finished.');
      pauseReplay();
    }
    return;
  }

  const currentTime = Date.now();
  const elapsedRealTime = (currentTime - replayStartTime) * replaySpeed;
  const targetEventTime = eventStartTime + elapsedRealTime;

  while (currentEventIndex < events.length &&
         events[currentEventIndex].timestamp.getTime() <= targetEventTime) {
    const event = events[currentEventIndex];
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'event', payload: event }));
      }
    });
    currentEventIndex++;
  }
}

wss.on('connection', ws => {
  console.log('Mock WebSocket client connected.');

  // Send initial state (not a full snapshot, just control state for mock)
  ws.send(JSON.stringify({
    type: 'control_state',
    payload: {
      isPaused: isPaused,
      replaySpeed: replaySpeed,
      progress: 0, // Mock doesn't maintain full snapshot, so progress is simple
      currentLap: 0,
      totalLaps: 57, // Hardcoded for mock
      totalDurationMs: events.length > 0 ? (events[events.length - 1].timestamp.getTime() - eventStartTime) : 0
    }
  }));

  ws.on('message', message => {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'control') {
        const { action, payload } = parsedMessage;
        switch (action) {
          case 'play': startReplay(); break;
          case 'pause': pauseReplay(); break;
          case 'seek': seekReplay(payload.progress); break;
          case 'speed': setSpeed(payload.speed); break;
          case 'restart': resetReplay(); break;
          default: console.warn('Unknown mock control action:', action);
        }
      }
    } catch (error) {
      console.error('Failed to parse mock WebSocket message:', error.message);
    }
  });

  ws.on('close', () => {
    console.log('Mock WebSocket client disconnected.');
  });

  ws.on('error', error => {
    console.error('Mock WebSocket error:', error.message);
  });
});

wss.on('listening', () => {
  console.log(`Mock WebSocket server running on ws://localhost:${MOCK_PORT}`);
  loadMockData();
});