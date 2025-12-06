import React from 'react';
import { getTeamColor } from '../utils/teamColors';

const DriverDetail = ({ driver }) => {
  if (!driver) {
    return (
      <div className="bg-secondary dark:bg-secondary-dark p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-center text-muted-text dark:text-muted-text-dark">
        Select a driver for details.
      </div>
    );
  }

  const teamColor = getTeamColor(driver.team);

  return (
    <div className="bg-secondary dark:bg-secondary-dark p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: teamColor }}>
          {driver.number}
        </div>
        <div>
          <h3 className="text-xl font-bold text-app-text dark:text-app-text-dark">{driver.driverName}</h3>
          <p className="text-muted-text dark:text-muted-text-dark">{driver.team}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-app-text dark:text-app-text-dark">
        <div>
          <p className="font-semibold">Current Position:</p>
          <p>{driver.position || '-'}</p>
        </div>
        <div>
          <p className="font-semibold">Current Lap:</p>
          <p>{driver.lapNumber || '-'}</p>
        </div>
        <div>
          <p className="font-semibold">Last Lap Time:</p>
          <p>{driver.lastLapTime ? driver.lastLapTime.toFixed(3) : '-'}</p>
        </div>
        <div>
          <p className="font-semibold">Best Lap Time:</p>
          <p>{driver.bestLapTime ? driver.bestLapTime.toFixed(3) : '-'}</p>
        </div>
        <div>
          <p className="font-semibold">Tyres:</p>
          <p>{driver.tyres || '-'}</p>
        </div>
        <div>
          <p className="font-semibold">Pit Stop Lap:</p>
          <p>{driver.isPitLap ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default DriverDetail;