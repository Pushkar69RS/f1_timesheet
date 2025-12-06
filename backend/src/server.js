// backend/src/server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const ReplayEngine = require('./replayEngine');
const path = require('path');

const PORT = process.env.PORT || 3001;
const SESSION_KEY = process.env.SESSION_KEY;
const OFFLINE = process.env.OFFLINE === 'true';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const replayEngine = new ReplayEngine();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for development
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Endpoints
app.get('/api/snapshot', (req, res) => {
  res.json(replayEngine.currentSnapshot);
});

app.get('/api/session-info', (req, res) => {
  res.json(replayEngine.getSessionInfo());
});

app.post('/api/load-session', async (req, res) => {
  const { session_key } = req.body;
  if (!session_key) {
    return res.status(400).json({ error: 'session_key is required' });
  }
  try {
    await replayEngine.loadSession(session_key, false); // Force offline false
    res.json({ message: `Session ${session_key} loaded successfully.` });
  } catch (error) {
    console.error('Failed to load session via API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket Server
wss.on('connection', ws => {
  console.log('WebSocket client connected.');
  replayEngine.addWsClient(ws);

  ws.on('message', message => {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'control') {
        const { action, payload } = parsedMessage;
        switch (action) {
          case 'play':
            replayEngine.startReplay();
            break;
          case 'pause':
            replayEngine.pauseReplay();
            break;
          case 'seek':
            replayEngine.seekReplay(payload.progress);
            break;
          case 'speed':
            replayEngine.setSpeed(payload.speed);
            break;
          case 'restart':
            replayEngine.resetReplay();
            break;
          default:
            console.warn('Unknown control action:', action);
        }
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error.message);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected.');
    replayEngine.removeWsClient(ws);
  });

  ws.on('error', error => {
    console.error('WebSocket error:', error.message);
  });
});

// Initialize and start the replay engine
async function init() {
  try {
    await replayEngine.loadSession(SESSION_KEY, OFFLINE);
    server.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
      console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
    });
  } catch (error) {
    console.error('Failed to initialize replay engine:', error.message);
    process.exit(1);
  }
}

init();