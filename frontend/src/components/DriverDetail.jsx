import { getTeamColor, getTyreStyle } from '../utils/teamColors';
import { formatTime } from '../utils/formatTime';
import DriverAvatar from './DriverAvatar';
import F1SteeringWheel from './F1SteeringWheel';

const DriverDetail = ({ driver, onOpenCompare = () => {} }) => {
  if (!driver) {
    return (
      <div className="bg-white dark:bg-[#111622] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center min-h-[220px] transition-colors font-sans">
        <span className="text-3xl mb-2">🏎️</span>
        <p className="font-semibold text-sm">Select a driver from the timesheet or track map to inspect live telemetry & steering cockpit.</p>
      </div>
    );
  }

  const teamColor = driver.team_colour ? `#${driver.team_colour}` : getTeamColor(driver.team || '');
  const driverNumber = driver.number || driver.driverId || '-';
  const driverName = driver.driverName || driver.full_name || 'Unknown';
  const teamName = driver.team || driver.team_name || 'Unknown';
  const tyreStyle = getTyreStyle(driver.tyres);

  // 2025 Telemetry Simulation parameters
  const speedTrap = (315 + ((driverNumber * 3) % 25)).toFixed(1);
  const batteryPct = Math.min(100, Math.max(15, 92 - ((driver.lapNumber || 1) % 10) * 5));
  const drsStatus = (driver.position && driver.position > 1 && (driver.lapNumber || 1) > 1) ? 'DRS ACTIVE (OPEN)' : 'DRS AVAILABLE';

  return (
    <div className="bg-white dark:bg-[#111622] p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-colors font-sans space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <DriverAvatar driver={driver} size="lg" />
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
              {driverName}
            </h3>
            <span
              className="text-xs font-mono font-bold px-2.5 py-0.5 rounded text-white shadow-sm"
              style={{ backgroundColor: teamColor }}
            >
              #{driverNumber}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{teamName}</p>
        </div>
      </div>

      {/* Interactive F1 Steering Wheel Cockpit (Shift LEDs & G-Force) */}
      <F1SteeringWheel driver={driver} />

      {/* Grid Telemetry Stats */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-400 font-medium block mb-0.5 text-[10px] uppercase">Position</span>
          <span className="text-base font-black text-gray-900 dark:text-white">
            {driver.position ? `P${driver.position}` : '—'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-400 font-medium block mb-0.5 text-[10px] uppercase">Current Lap</span>
          <span className="text-base font-black text-gray-900 dark:text-white font-mono">
            {driver.lapNumber || 1}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-400 font-medium block mb-0.5 text-[10px] uppercase">Last Lap</span>
          <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">
            {formatTime(driver.lastLapTime)}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-400 font-medium block mb-0.5 text-[10px] uppercase">Best Lap</span>
          <span className="text-sm font-mono font-bold text-[#BF5AF2]">
            {formatTime(driver.bestLapTime)}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-400 font-medium block mb-0.5 text-[10px] uppercase">Pirelli Tyre</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {tyreStyle ? (
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full font-black text-[10px]"
                style={{ backgroundColor: tyreStyle.bg, color: tyreStyle.text }}
              >
                {tyreStyle.label}
              </span>
            ) : null}
            <span className="font-bold text-gray-900 dark:text-white">
              {driver.tyres || '—'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-400 font-medium block mb-0.5 text-[10px] uppercase">Speed Trap</span>
          <span className="text-sm font-mono font-bold text-[#00D2BE]">
            {speedTrap} km/h
          </span>
        </div>
      </div>

      {/* 2025 DRS & Hybrid Battery Indicators */}
      <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800/80 text-[11px] font-mono space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">DRS Wing Status:</span>
          <span className={`font-bold ${drsStatus.includes('ACTIVE') ? 'text-green-500 animate-pulse' : 'text-cyan-400'}`}>
            {drsStatus}
          </span>
        </div>
        <div>
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-gray-500 dark:text-gray-400">120kW MGU-K Hybrid Energy:</span>
            <span className="text-green-500 dark:text-green-400 font-bold">{batteryPct}% SoC</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full"
              style={{ width: `${batteryPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sector breakdown */}
      {driver.sectorTimes && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5 font-mono">
            Sector Timing Matrix
          </span>
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] text-[#00D2BE] block font-bold">S1</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatTime(driver.sectorTimes[0])}</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] text-[#FFB800] block font-bold">S2</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatTime(driver.sectorTimes[1])}</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded border border-gray-200 dark:border-gray-800">
              <span className="text-[10px] text-[#BF5AF2] block font-bold">S3</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatTime(driver.sectorTimes[2])}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button: Compare */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => onOpenCompare && onOpenCompare(driver.driverId || driver.number)}
          className="w-full py-2 px-3 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-600/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <span>⚔️</span> Compare #{driverNumber} {driverName} with Rival
        </button>
      </div>
    </div>
  );
};

export default DriverDetail;