import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils/formatTime';
import { getTeamColor, getTyreStyle } from '../utils/teamColors';
import DriverAvatar from './DriverAvatar';

const DriverRow = ({
  driver,
  driverBestLaps,
  driverBestSectors,
  globalBestLap,
  globalBestSectors,
  gapToLeader = '-',
  interval = '-',
  isSelected = false,
  onDriverSelect
}) => {
  const rowRef = useRef(null);
  const prevPosition = useRef(driver.position);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    if (rowRef.current && prevPosition.current !== driver.position && prevPosition.current !== null) {
      const oldPos = prevPosition.current;
      const newPos = driver.position;
      const rowHeight = rowRef.current.offsetHeight || 40;
      const translateY = (oldPos - newPos) * rowHeight;

      rowRef.current.style.transition = 'none';
      rowRef.current.style.transform = `translateY(${translateY}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (rowRef.current) {
            rowRef.current.style.transition = 'transform 0.3s ease-out';
            rowRef.current.style.transform = 'translateY(0)';
          }
        });
      });
    }
    prevPosition.current = driver.position;

    if (driver.flash) {
      setFlashClass('bg-red-500/20 transition-colors duration-300');
      const timer = setTimeout(() => {
        setFlashClass('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [driver.position, driver.flash]);

  const getSectorColorClass = (sectorTime, sectorIndex) => {
    if (sectorTime === null || sectorTime === undefined) return 'text-gray-400 dark:text-gray-500';
    const driverPB = driverBestSectors[driver.driverId] ? driverBestSectors[driver.driverId][sectorIndex] : null;
    const globalPB = globalBestSectors[sectorIndex];

    if (globalPB !== null && sectorTime <= globalPB) {
      return 'text-[#BF5AF2] font-bold bg-[#BF5AF2]/20 px-1 py-0.5 rounded';
    } else if (driverPB !== null && sectorTime <= driverPB) {
      return 'text-[#16A34A] dark:text-[#30D158] font-bold';
    } else if (sectorTime > (driverPB || 0)) {
      return 'text-[#D97706] dark:text-[#FFD60A]';
    }
    return 'text-gray-800 dark:text-gray-300';
  };

  const getLapTimeColorClass = (lapTime) => {
    if (lapTime === null || lapTime === undefined) return 'text-gray-400 dark:text-gray-500';
    const driverPB = driverBestLaps[driver.driverId] ? driverBestLaps[driver.driverId].overall : null;
    const globalPB = globalBestLap;

    if (globalPB !== null && lapTime <= globalPB) {
      return 'text-[#BF5AF2] font-bold bg-[#BF5AF2]/20 px-1.5 py-0.5 rounded';
    } else if (driverPB !== null && lapTime <= driverPB) {
      return 'text-[#16A34A] dark:text-[#30D158] font-bold';
    }
    return 'text-gray-900 dark:text-gray-200';
  };

  const teamColor = driver.team_colour ? `#${driver.team_colour}` : getTeamColor(driver.team);
  const tyreStyle = getTyreStyle(driver.tyres);

  return (
    <tr
      ref={rowRef}
      className={`relative border-b border-gray-200 dark:border-gray-800/80 transition-colors duration-150 cursor-pointer ${flashClass} ${
        isSelected ? 'bg-red-500/15 dark:bg-red-600/20' : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
      } ${driver.isPitLap ? 'bg-orange-500/15' : ''}`}
      onClick={() => onDriverSelect(driver.driverId)}
    >
      {/* Position */}
      <td className="py-2.5 px-3 text-center font-black text-xs">
        <div className="flex items-center justify-center gap-1">
          <span className="w-5 text-right text-gray-900 dark:text-white font-mono font-bold">
            {driver.position || '-'}
          </span>
          {driver.positionChanged === 1 && <span className="text-green-600 dark:text-green-400 text-xs font-bold">▲</span>}
          {driver.positionChanged === -1 && <span className="text-red-600 dark:text-red-500 text-xs font-bold">▼</span>}
          {driver.positionChanged === 0 && <span className="text-gray-400 dark:text-gray-600 text-[10px]">—</span>}
        </div>
      </td>

      {/* Driver Info */}
      <td className="py-2 px-3">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-7 rounded-full shrink-0" style={{ backgroundColor: teamColor }} />
          <DriverAvatar driver={driver} size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-gray-900 dark:text-white">
                {driver.driverName || 'Unknown'}
              </span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                {driver.number}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-none">
              {driver.team || '-'}
            </span>
          </div>
        </div>
      </td>

      {/* Gap to Leader */}
      <td className="py-2 px-2 text-center text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
        {gapToLeader}
      </td>

      {/* Interval to car ahead */}
      <td className="py-2 px-2 text-center text-xs font-mono text-gray-500 dark:text-gray-400">
        {interval}
      </td>

      {/* Lap Number */}
      <td className="py-2 px-2 text-center font-mono text-xs text-gray-800 dark:text-gray-200">
        {driver.lapNumber || 1}
      </td>

      {/* Last Lap Time */}
      <td className={`py-2 px-2 text-center font-mono text-xs ${getLapTimeColorClass(driver.lastLapTime)}`}>
        {formatTime(driver.lastLapTime)}
      </td>

      {/* Best Lap Time */}
      <td className={`py-2 px-2 text-center font-mono text-xs ${getLapTimeColorClass(driver.bestLapTime)}`}>
        {formatTime(driver.bestLapTime)}
      </td>

      {/* Sector 1 */}
      <td className={`py-2 px-2 text-center font-mono text-xs ${getSectorColorClass(driver.sectorTimes?.[0], 0)}`}>
        {formatTime(driver.sectorTimes?.[0])}
      </td>

      {/* Sector 2 */}
      <td className={`py-2 px-2 text-center font-mono text-xs ${getSectorColorClass(driver.sectorTimes?.[1], 1)}`}>
        {formatTime(driver.sectorTimes?.[1])}
      </td>

      {/* Sector 3 */}
      <td className={`py-2 px-2 text-center font-mono text-xs ${getSectorColorClass(driver.sectorTimes?.[2], 2)}`}>
        {formatTime(driver.sectorTimes?.[2])}
      </td>

      {/* Pirelli Tyre Compound Badge */}
      <td className="py-2 px-2 text-center">
        {tyreStyle ? (
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full font-black text-[11px] shadow-sm"
            style={{
              backgroundColor: tyreStyle.bg,
              color: tyreStyle.text,
              border: `1.5px solid ${tyreStyle.border}`,
            }}
            title={driver.tyres}
          >
            {tyreStyle.label}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </td>

      {/* Pit Stop Counter */}
      <td className="py-2 px-2 text-center font-mono text-xs font-semibold">
        {driver.isPitLap ? (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF9F0A] text-black animate-pulse">
            PIT
          </span>
        ) : driver.pitStopCount > 0 ? (
          <span className="text-gray-900 dark:text-white font-bold">{driver.pitStopCount}</span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
};

export default DriverRow;