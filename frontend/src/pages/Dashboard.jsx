import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TimesheetTable from '../components/TimesheetTable';
import Controls from '../components/Controls';
import ProgressBar from '../components/ProgressBar';
import DriverDetail from '../components/DriverDetail';
import FinalPositions from '../components/FinalPositions';

const WS_URL = `ws://${window.location.hostname}:3001/ws`;
const API_BASE_URL = `http://${window.location.hostname}:3001/api`;

function Dashboard() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState({});
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentLap, setCurrentLap] = useState(0);
  const [totalLaps, setTotalLaps] = useState(0);
  const [totalDurationMs, setTotalDurationMs] = useState(0);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [globalBestLap, setGlobalBestLap] = useState(null);
  const [globalBestSectors, setGlobalBestSectors] = useState([null, null, null]);


  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const driverBestLaps = useRef({});
  const driverBestSectors = useRef({});

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', false);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const connectWebSocket = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return;
    }

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected.');
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'snapshot':
          driverBestLaps.current = {};
          driverBestSectors.current = {};

          const initialDrivers = message.payload;
          const updatedDrivers = {};
          let newGlobalBestLap = null;
          const newGlobalBestSectors = [null, null, null];

          Object.values(initialDrivers).forEach(driver => {
            updatedDrivers[driver.driverId] = { ...driver, flash: false, positionChanged: 0 };
            driverBestLaps.current[driver.driverId] = { overall: driver.bestLapTime };
            driverBestSectors.current[driver.driverId] = [...driver.bestSectorTimes];
            if (driver.bestLapTime && (newGlobalBestLap === null || driver.bestLapTime < newGlobalBestLap)) {
              newGlobalBestLap = driver.bestLapTime;
            }
            driver.bestSectorTimes.forEach((sTime, index) => {
              if (sTime !== null && (newGlobalBestSectors[index] === null || sTime < newGlobalBestSectors[index])) {
                newGlobalBestSectors[index] = sTime;
              }
            });
          });
          setDrivers(updatedDrivers);
          setGlobalBestLap(newGlobalBestLap);
          setGlobalBestSectors(newGlobalBestSectors);
          break;
        case 'control_state':
          setIsPaused(message.payload.isPaused !== undefined ? message.payload.isPaused : isPaused);
          setReplaySpeed(message.payload.replaySpeed !== undefined ? message.payload.replaySpeed : replaySpeed);
          setProgress(message.payload.progress !== undefined ? message.payload.progress : progress);
          setCurrentLap(message.payload.currentLap !== undefined ? message.payload.currentLap : currentLap);
          setTotalLaps(message.payload.totalLaps !== undefined ? message.payload.totalLaps : totalLaps);
          setTotalDurationMs(message.payload.totalDurationMs !== undefined ? message.payload.totalDurationMs : totalDurationMs);
          if (message.payload.globalBestLap !== undefined) setGlobalBestLap(message.payload.globalBestLap);
          if (message.payload.globalBestSectors !== undefined) setGlobalBestSectors(message.payload.globalBestSectors);
          break;
        case 'replay_finished':
          setIsPaused(true);
          setProgress(100);
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      if (!event.wasClean) {
        console.log('Attempting to reconnect in 3 seconds...');
        reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.current.close();
    };
  }, [isPaused, replaySpeed, progress, currentLap, totalLaps, totalDurationMs]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/session-info`)
      .then(res => res.json())
      .then(data => {
        setSessionInfo(data);
        setTotalLaps(data.session_laps || 0);
      })
      .catch(err => console.error('Failed to fetch session info:', err));

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connectWebSocket]);

  const sendControlMessage = (action, payload = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'control', action, payload }));
    } else {
      console.warn('WebSocket not open. Cannot send control message.');
    }
  };

  const handlePlayPause = () => {
    sendControlMessage(isPaused ? 'play' : 'pause');
  };

  const handleSpeedChange = (speed) => {
    sendControlMessage('speed', { speed });
  };

  const handleSeek = (newProgress) => {
    sendControlMessage('seek', { progress: newProgress });
  };

  const handleRestart = () => {
    sendControlMessage('restart');
  };

  const handleDriverSelect = (driverId) => {
    setSelectedDriverId(driverId);
  };

  const selectedDriver = selectedDriverId ? drivers[selectedDriverId] : null;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-secondary text-app-text dark:bg-secondary-dark dark:text-app-text-dark transition-colors duration-300">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white font-bold rounded transition-colors"
          >
            ← Home
          </button>
          <h1 className="text-4xl font-extrabold text-primary dark:text-primary-dark">F1 Timesheet Replay</h1>
          {sessionInfo && (
            <span className="text-lg text-muted-text dark:text-muted-text-dark">
              {sessionInfo.session_name} - {sessionInfo.circuit_short_name} {sessionInfo.year}
            </span>
          )}
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-app-text dark:text-app-text-dark hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row flex-grow gap-6">
        <div className="lg:w-3/4 flex flex-col space-y-6">
          <TimesheetTable
            drivers={drivers}
            driverBestLaps={driverBestLaps.current}
            driverBestSectors={driverBestSectors.current}
            globalBestLap={globalBestLap}
            globalBestSectors={globalBestSectors}
            onDriverSelect={handleDriverSelect}
          />
          <FinalPositions drivers={drivers} isVisible={progress === 100} />
        </div>

        <div className="lg:w-1/4 flex flex-col space-y-6">
          <Controls
            isPaused={isPaused}
            replaySpeed={replaySpeed}
            progress={progress}
            currentLap={currentLap}
            totalLaps={totalLaps}
            onPlayPause={handlePlayPause}
            onSpeedChange={handleSpeedChange}
            onSeek={handleSeek}
            onRestart={handleRestart}
          />
          <ProgressBar progress={progress} currentLap={currentLap} totalLaps={totalLaps} />
          <DriverDetail driver={selectedDriver} />
        </div>
      </div>

      <footer className="mt-8 text-center text-muted-text dark:text-muted-text-dark text-sm">
        Data provided by OpenF1 API.
      </footer>
    </div>
  );
}

export default Dashboard;
