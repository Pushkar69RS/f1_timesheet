import React, { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils/formatTime'; // Assuming a utils file for formatting
import { getTeamColor } from '../utils/teamColors'; // Assuming a utils file for team colors

const DriverRow = ({ driver, driverBestLaps, driverBestSectors, globalBestLap, globalBestSectors, onDriverSelect }) => {
  const rowRef = useRef(null);
  const prevPosition = useRef(driver.position);
  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    // Handle position change animation
    if (rowRef.current && prevPosition.current !== driver.position && prevPosition.current !== null) {
      const oldPos = prevPosition.current;
      const newPos = driver.position;
      const rowHeight = rowRef.current.offsetHeight;
      const translateY = (oldPos - newPos) * rowHeight;

      rowRef.current.style.transition = 'none';
      rowRef.current.style.transform = `translateY(${translateY}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          rowRef.current.style.transition = 'transform 0.3s ease-out';
          rowRef.current.style.transform = 'translateY(0)';
        });
      });
    }
    prevPosition.current = driver.position;

    // Handle flash animation for updates
    if (driver.flash) {
      setFlashClass('animate-flash dark:animate-flash-dark');
      const timer = setTimeout(() => {
        setFlashClass('');
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [driver.position, driver.flash]);

  const getSectorColorClass = (sectorTime, sectorIndex) => {
    if (sectorTime === null) return '';
    const driverPB = driverBestSectors[driver.driverId] ? driverBestSectors[driver.driverId][sectorIndex] : null;
    const globalPB = globalBestSectors[sectorIndex];

    if (sectorTime === globalPB) {
      return 'text-sector-purple font-bold'; // Overall fastest sector
    } else if (sectorTime === driverPB) {
      return 'text-sector-green font-bold'; // Personal best sector
    } else if (sectorTime > (driverPB || 0)) { // If slower than personal best
      return 'text-sector-yellow';
    }
    return '';
  };

  const getLapTimeColorClass = (lapTime) => {
    if (lapTime === null) return '';
    const driverPB = driverBestLaps[driver.driverId] ? driverBestLaps[driver.driverId].overall : null;
    const globalPB = globalBestLap;

    if (lapTime === globalPB) {
      return 'text-sector-purple font-bold'; // Overall fastest lap
    } else if (lapTime === driverPB) {
      return 'text-sector-green font-bold'; // Personal best lap
    }
    return '';
  };

  const teamColor = getTeamColor(driver.team);

  return (
    <tr 
      ref={rowRef} 
      className={`relative ${flashClass} ${driver.isPitLap ? 'bg-pit-stop/20' : ''} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}
      onClick={() => onDriverSelect(driver.driverId)}
    >
      <td className="py-2 px-4 text-center font-bold text-app-text dark:text-app-text-dark">{driver.position || '-'}</td>
      <td className="py-2 px-4 text-center text-app-text dark:text-app-text-dark">{driver.number}</td>
      <td className="py-2 px-4 flex items-center space-x-2 text-app-text dark:text-app-text-dark">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColor }}></div>
        <span>{driver.driverName}</span>
        <span className="text-muted-text dark:text-muted-text-dark text-sm hidden md:inline">({driver.team})</span>
      </td>
      <td className="py-2 px-4 text-center text-app-text dark:text-app-text-dark">{driver.lapNumber || '-'}</td>
      <td className={`py-2 px-4 text-center ${getLapTimeColorClass(driver.lastLapTime)}`}>
        {formatTime(driver.lastLapTime)}
      </td>
      <td className={`py-2 px-4 text-center ${getLapTimeColorClass(driver.bestLapTime)}`}>
        {formatTime(driver.bestLapTime)}
      </td>
      <td className={`py-2 px-4 text-center ${getSectorColorClass(driver.sectorTimes[0], 0)}`}>
        {formatTime(driver.sectorTimes[0])}
      </td>
      <td className={`py-2 px-4 text-center ${getSectorColorClass(driver.sectorTimes[1], 1)}`}>
        {formatTime(driver.sectorTimes[1])}
      </td>
      <td className={`py-2 px-4 text-center ${getSectorColorClass(driver.sectorTimes[2], 2)}`}>
        {formatTime(driver.sectorTimes[2])}
      </td>
      <td className="py-2 px-4 text-center text-app-text dark:text-app-text-dark">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${driver.tyres ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
          {driver.tyres || '-'}
        </span>
      </td>
      <td className="py-2 px-4 text-center text-app-text dark:text-app-text-dark">{driver.isPitLap ? 'P' : ''}</td>
    </tr>
  );
};

export default DriverRow;