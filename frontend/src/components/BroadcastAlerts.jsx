import { useState, useEffect, useRef } from 'react';
import { getTeamColor } from '../utils/teamColors';
import { soundFX } from '../utils/soundFx';

export default function BroadcastAlerts({ drivers = {}, activeLap = 1 }) {
  const [alerts, setAlerts] = useState([]);
  const prevPositionsRef = useRef({});
  const prevLapRef = useRef(activeLap);

  useEffect(() => {
    const driverList = Object.values(drivers);
    if (driverList.length === 0) return;

    // Detect position changes
    driverList.forEach((d) => {
      const driverId = String(d.driverId || d.number);
      const curPos = d.position;
      const prevPos = prevPositionsRef.current[driverId];

      if (prevPos && curPos && curPos < prevPos && prevPos - curPos <= 3) {
        // Driver gained position (Overtake!)
        const alertId = `${driverId}-${curPos}-${Date.now()}`;
        const newAlert = {
          id: alertId,
          type: 'overtake',
          driverName: d.driverName || d.full_name,
          number: d.number,
          team: d.team,
          team_colour: d.team_colour,
          gained: prevPos - curPos,
          newPos: curPos,
          lap: d.lapNumber || activeLap,
          timestamp: Date.now()
        };

        soundFX.playOvertakeChime();

        setAlerts(prev => [newAlert, ...prev.slice(0, 2)]);

        // Auto remove alert after 3.8s
        setTimeout(() => {
          setAlerts(prev => prev.filter(a => a.id !== alertId));
        }, 3800);
      }

      if (curPos) {
        prevPositionsRef.current[driverId] = curPos;
      }
    });

    prevLapRef.current = activeLap;
  }, [drivers, activeLap]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5 pointer-events-none font-sans">
      {alerts.map((alert) => {
        const teamColor = alert.team_colour ? `#${alert.team_colour}` : getTeamColor(alert.team);

        return (
          <div
            key={alert.id}
            className="animate-slideUp flex items-center bg-gray-950/95 text-white rounded-xl shadow-2xl border border-gray-700/80 backdrop-blur-md overflow-hidden font-mono min-w-[320px] max-w-md border-l-4 shadow-red-950/30"
            style={{ borderLeftColor: teamColor }}
          >
            <div className="p-3 px-4 flex items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-md"
                  style={{ backgroundColor: teamColor }}
                >
                  #{alert.number}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <span>⚡ OVERTAKE</span>
                      <span className="text-green-400 font-bold">+{alert.gained}</span>
                    </span>
                    <span className="text-[9px] text-gray-400">LAP {alert.lap}</span>
                  </div>
                  <div className="text-xs font-black text-white truncate max-w-[170px]">
                    {alert.driverName}
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase">Now</span>
                <span className="text-sm font-black text-amber-400">
                  P{alert.newPos}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
