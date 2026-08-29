import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TimesheetTable from '../components/TimesheetTable';
import TrackMap from '../components/TrackMap';
import Controls from '../components/Controls';
import ProgressBar from '../components/ProgressBar';
import DriverDetail from '../components/DriverDetail';
import FinalPositions from '../components/FinalPositions';
import WeatherWidget from '../components/WeatherWidget';
import RaceControlFeed from '../components/RaceControlFeed';
import TelemetryCompareModal from '../components/TelemetryCompareModal';

const WS_URL = `ws://${window.location.hostname}:3001/ws`;
const API_BASE_URL = `http://${window.location.hostname}:3001/api`;

const SESSIONS_2026 = [
  { key: '2026-01', name: 'R1: Australian GP', circuit: 'Melbourne', flag: '🇦🇺' },
  { key: '2026-02', name: 'R2: Chinese GP', circuit: 'Shanghai', flag: '🇨🇳' },
  { key: '2026-03', name: 'R3: Japanese GP', circuit: 'Suzuka', flag: '🇯🇵' },
  { key: '2026-04', name: 'R4: Bahrain GP', circuit: 'Sakhir', flag: '🇧🇭' },
  { key: '2026-05', name: 'R5: Saudi Arabian GP', circuit: 'Jeddah', flag: '🇸🇦' },
  { key: '2026-06', name: 'R6: Miami GP', circuit: 'Miami', flag: '🇺🇸' },
  { key: '2026-07', name: 'R7: Emilia Romagna GP', circuit: 'Imola', flag: '🇮🇹' },
  { key: '2026-08', name: 'R8: Monaco GP', circuit: 'Monaco', flag: '🇲🇨' },
  { key: '2026-09', name: 'R9: Spanish GP', circuit: 'Barcelona', flag: '🇪🇸' },
  { key: '2026-10', name: 'R10: Canadian GP', circuit: 'Montreal', flag: '🇨🇦' },
  { key: '2026-11', name: 'R11: Austrian GP', circuit: 'Spielberg', flag: '🇦🇹' },
  { key: '2026-12', name: 'R12: British GP', circuit: 'Silverstone', flag: '🇬🇧' },
  { key: '2026-13', name: 'R13: Belgian GP', circuit: 'Spa', flag: '🇧🇪' },
  { key: '2026-14', name: 'R14: Hungarian GP', circuit: 'Budapest', flag: '🇭🇺' },
  { key: '2026-15', name: 'R15: Dutch GP', circuit: 'Zandvoort', flag: '🇳🇱' },
  { key: '2026-16', name: 'R16: Italian GP', circuit: 'Monza', flag: '🇮🇹' },
  { key: '2026-17', name: 'R17: Azerbaijan GP', circuit: 'Baku', flag: '🇦🇿' },
  { key: '2026-18', name: 'R18: Singapore GP', circuit: 'Singapore', flag: '🇸🇬' },
  { key: '2026-19', name: 'R19: United States GP', circuit: 'Austin', flag: '🇺🇸' },
  { key: '2026-20', name: 'R20: Mexico City GP', circuit: 'Mexico City', flag: '🇲🇽' },
  { key: '2026-21', name: 'R21: São Paulo GP', circuit: 'Interlagos', flag: '🇧🇷' },
  { key: '2026-22', name: 'R22: Las Vegas GP', circuit: 'Las Vegas', flag: '🇺🇸' },
  { key: '2026-23', name: 'R23: Qatar GP', circuit: 'Lusail', flag: '🇶🇦' },
  { key: '2026-24', name: 'R24: Abu Dhabi GP', circuit: 'Yas Marina', flag: '🇦🇪' },
];

function Dashboard() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState({});
  const [sessionInfo, setSessionInfo] = useState(null);
  const [selectedSessionKey, setSelectedSessionKey] = useState('2026-12');
  const [isPaused, setIsPaused] = useState(true);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentLap, setCurrentLap] = useState(1);
  const [totalLaps, setTotalLaps] = useState(52);
  const [_totalDurationMs, setTotalDurationMs] = useState(0);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [globalBestLap, setGlobalBestLap] = useState(null);
  const [globalBestSectors, setGlobalBestSectors] = useState([null, null, null]);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const driverBestLaps = useRef({});
  const driverBestSectors = useRef({});

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const compareParam = searchParams.get('compare');
    if (compareParam === 'true') setIsCompareOpen(true);

    const driverParam = searchParams.get('driver');
    if (driverParam) setSelectedDriverId(driverParam);

    const finishedParam = searchParams.get('finished');
    if (finishedParam === 'true') setProgress(100);

    const themeParam = searchParams.get('theme');
    if (themeParam === 'light') {
      setDarkMode(false);
    } else if (themeParam === 'dark') {
      setDarkMode(true);
    } else {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        setDarkMode(JSON.parse(savedMode));
      } else {
        setDarkMode(true);
      }
    }
  }, [searchParams]);

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
        case 'snapshot': {
          driverBestLaps.current = {};
          driverBestSectors.current = {};

          const initialDrivers = message.payload || {};
          const updatedDrivers = {};
          let newGlobalBestLap = null;
          const newGlobalBestSectors = [null, null, null];

          Object.values(initialDrivers).forEach(driver => {
            updatedDrivers[driver.driverId] = { ...driver, flash: false, positionChanged: 0 };
            driverBestLaps.current[driver.driverId] = { overall: driver.bestLapTime };
            driverBestSectors.current[driver.driverId] = Array.isArray(driver.bestSectorTimes) ? [...driver.bestSectorTimes] : [null, null, null];
            if (driver.bestLapTime && (newGlobalBestLap === null || driver.bestLapTime < newGlobalBestLap)) {
              newGlobalBestLap = driver.bestLapTime;
            }
            if (Array.isArray(driver.bestSectorTimes)) {
              driver.bestSectorTimes.forEach((sTime, index) => {
                if (sTime !== null && (newGlobalBestSectors[index] === null || sTime < newGlobalBestSectors[index])) {
                  newGlobalBestSectors[index] = sTime;
                }
              });
            }
          });
          setDrivers(updatedDrivers);
          setGlobalBestLap(newGlobalBestLap);
          setGlobalBestSectors(newGlobalBestSectors);
          break;
        }
        case 'control_state': {
          if (message.payload.isPaused !== undefined) setIsPaused(message.payload.isPaused);
          if (message.payload.replaySpeed !== undefined) setReplaySpeed(message.payload.replaySpeed);
          if (message.payload.progress !== undefined) setProgress(message.payload.progress);
          if (message.payload.currentLap !== undefined && message.payload.currentLap > 0) {
            setCurrentLap(message.payload.currentLap);
          }
          if (message.payload.totalLaps !== undefined) setTotalLaps(message.payload.totalLaps);
          if (message.payload.totalDurationMs !== undefined) setTotalDurationMs(message.payload.totalDurationMs);
          if (message.payload.globalBestLap !== undefined) setGlobalBestLap(message.payload.globalBestLap);
          if (message.payload.globalBestSectors !== undefined) setGlobalBestSectors(message.payload.globalBestSectors);
          break;
        }
        case 'replay_finished': {
          setIsPaused(true);
          setProgress(100);
          break;
        }
        default:
          console.warn('Unknown message type:', message.type);
      }
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      if (!event.wasClean) {
        reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (ws.current) ws.current.close();
    };
  }, []);

  const fetchSessionInfo = useCallback(() => {
    fetch(`${API_BASE_URL}/session-info`)
      .then(res => res.json())
      .then(data => {
        setSessionInfo(data);
        if (data.session_laps) setTotalLaps(data.session_laps);
        if (data.session_key) setSelectedSessionKey(String(data.session_key));
      })
      .catch(err => console.error('Failed to fetch session info:', err));
  }, []);

  useEffect(() => {
    fetchSessionInfo();
    fetch(`${API_BASE_URL}/snapshot`)
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setDrivers(data);
        }
      })
      .catch(err => console.error('Failed to fetch initial snapshot:', err));
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connectWebSocket, fetchSessionInfo]);

  const sendControlMessage = (action, payload = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'control', action, payload }));
    } else {
      console.warn('WebSocket not open. Cannot send control message.');
    }
  };

  const handlePlayPause = () => {
    const nextState = isPaused ? 'play' : 'pause';
    sendControlMessage(nextState);
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
    setSelectedDriverId(prev => (prev === driverId ? null : driverId));
  };

  const handleSessionChange = async (e) => {
    const newSessionKey = e.target.value;
    setSelectedSessionKey(newSessionKey);
    setIsLoadingSession(true);
    try {
      const res = await fetch(`${API_BASE_URL}/load-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_key: newSessionKey }),
      });
      if (res.ok) {
        fetchSessionInfo();
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const selectedDriver = selectedDriverId ? drivers[selectedDriverId] : null;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 bg-gray-100 dark:bg-[#07090E] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      {/* Top Navigation Bar */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-1.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-white font-bold text-xs rounded-lg transition-colors border border-gray-200 dark:border-gray-800 flex items-center gap-1.5 shadow-sm"
          >
            ← 2026 Calendar
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider text-gray-900 dark:text-white">
              <span className="text-[#E10600]">PACE</span>TRACER
            </span>
            <span className="px-2 py-0.5 rounded bg-red-600/10 dark:bg-red-600/20 text-[#E10600] font-black text-[10px] uppercase tracking-widest border border-red-600/30">
              2026 FIA PRO TELEMETRY
            </span>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 2026 Grand Prix Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Grand Prix:</span>
            <select
              value={selectedSessionKey}
              onChange={handleSessionChange}
              disabled={isLoadingSession}
              className="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
            >
              {SESSIONS_2026.map(s => (
                <option key={s.key} value={s.key} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {s.flag} {s.name} ({s.circuit})
                </option>
              ))}
            </select>
          </div>

          {/* Head-to-Head Compare Modal Trigger */}
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <span>⚔️</span> Compare Drivers
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 px-3 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold transition-colors border border-gray-200 dark:border-gray-800 shadow-sm"
            title="Toggle theme"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* Top Banner: Weather & Track Status */}
      <div className="mb-6">
        <WeatherWidget weather={sessionInfo?.weather} circuitName={sessionInfo?.circuit_short_name} />
      </div>

      {/* Main Grid: Left Timesheet (60%), Right Track Map & Telemetry (40%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-grow">
        {/* Left Column: Timesheet Tower */}
        <div className="xl:col-span-7 flex flex-col space-y-6">
          <TimesheetTable
            drivers={drivers}
            driverBestLaps={driverBestLaps.current}
            driverBestSectors={driverBestSectors.current}
            globalBestLap={globalBestLap}
            globalBestSectors={globalBestSectors}
            selectedDriverId={selectedDriverId}
            onDriverSelect={handleDriverSelect}
          />
          <FinalPositions drivers={drivers} isVisible={progress >= 98} />
        </div>

        {/* Right Column: Track Map, Playback Controls, Driver Telemetry, Race Control */}
        <div className="xl:col-span-5 flex flex-col space-y-6">
          {/* Live 2D Track Map */}
          <TrackMap
            drivers={drivers}
            sessionInfo={sessionInfo}
            selectedDriverId={selectedDriverId}
            onDriverSelect={handleDriverSelect}
          />

          {/* Replay Controls & Scrubber */}
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

          {/* Live Race Control Feed */}
          <RaceControlFeed
            drivers={drivers}
            currentLap={currentLap}
            progress={progress}
            globalBestLap={globalBestLap}
            isPaused={isPaused}
          />

          {/* Selected Driver Telemetry Card */}
          <DriverDetail
            driver={selectedDriver}
            onOpenCompare={() => setIsCompareOpen(true)}
          />
        </div>
      </div>

      {/* Head to Head Telemetry Comparison Modal */}
      <TelemetryCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        drivers={drivers}
      />

      {/* Footer */}
      <footer className="mt-10 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-xs flex flex-wrap justify-between items-center gap-2 font-mono">
        <span>PaceTracer Telemetry &copy; 2026 | FIA Formula 1 World Championship Regulations</span>
        <span>24-Round Live Replay & Precision Telemetry Platform</span>
      </footer>
    </div>
  );
}

export default Dashboard;
