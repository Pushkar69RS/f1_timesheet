import { useState, useEffect } from 'react';

export default function RaceControlFeed({
  drivers = {},
  currentLap = 1,
  progress = 0,
  globalBestLap = null,
  isPaused = true
}) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Generate authentic live race control events based on lap and progress
    const driverList = Object.values(drivers);
    if (driverList.length === 0) return;

    const newEvents = [];

    // Formation / Start
    if (progress >= 0 && progress < 3) {
      newEvents.push({ id: 'start', type: 'flag', icon: '🟢', text: 'GREEN FLAG: Lights Out - Grand Prix underway!' });
    }

    // Safety Car / Incident simulated event around Lap 18-22
    if (currentLap >= 18 && currentLap <= 22) {
      newEvents.push({ id: 'vsc', type: 'vsc', icon: '🟡', text: `LAP ${currentLap}: VSC DEPLOYED - Debris in Sector 2 cleared` });
    }

    // Fastest Lap
    if (globalBestLap) {
      const fastestDriver = driverList.find(d => d.bestLapTime === globalBestLap);
      if (fastestDriver) {
        newEvents.push({
          id: 'fastest',
          type: 'fastest',
          icon: '🟣',
          text: `FASTEST LAP: ${fastestDriver.driverName} (${fastestDriver.team}) — ${globalBestLap.toFixed(3)}s`
        });
      }
    }

    // Pit Stop activity
    const pittingDrivers = driverList.filter(d => d.isPitLap || d.pitStopCount > 0);
    if (pittingDrivers.length > 0) {
      const latestPitter = pittingDrivers[0];
      newEvents.push({
        id: `pit-${latestPitter.driverId}`,
        type: 'pit',
        icon: '🟠',
        text: `PIT LANE: #${latestPitter.number} ${latestPitter.driverName} on ${latestPitter.tyres || 'MEDIUM'} tyres`
      });
    }

    // Overtake leader
    const p1Driver = driverList.find(d => d.position === 1);
    if (p1Driver) {
      newEvents.push({
        id: 'leader',
        type: 'race',
        icon: '👑',
        text: `RACE LEADER: P1 ${p1Driver.driverName} (${p1Driver.team}) - Lap ${currentLap}`
      });
    }

    // Chequered Flag
    if (progress >= 98) {
      newEvents.push({ id: 'finish', type: 'finish', icon: '🏁', text: 'CHEQUERED FLAG: Grand Prix Replay Finished' });
    }

    setEvents(newEvents);
  }, [currentLap, progress, globalBestLap, drivers]);

  return (
    <div className="bg-white dark:bg-[#111622] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-3.5 transition-colors">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <h4 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-white">
            Race Control Live Incident Feed
          </h4>
        </div>
        <span className="text-[10px] font-mono text-gray-500 uppercase">
          {isPaused ? 'Replay Paused' : 'Live Broadcast Streaming'}
        </span>
      </div>

      <div className="space-y-1.5 max-h-24 overflow-y-auto font-mono text-[11px]">
        {events.length > 0 ? (
          events.map(ev => (
            <div
              key={ev.id}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-950/70 border border-gray-100 dark:border-gray-800/80 text-gray-800 dark:text-gray-200 animate-fadeIn"
            >
              <span>{ev.icon}</span>
              <span className="font-medium truncate">{ev.text}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-[11px] italic p-1">No active incidents. Timing stream green.</div>
        )}
      </div>
    </div>
  );
}
