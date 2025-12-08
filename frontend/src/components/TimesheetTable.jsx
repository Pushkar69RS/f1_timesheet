import React from 'react';
import DriverRow from './DriverRow';

const TimesheetTable = ({ drivers, driverBestLaps, driverBestSectors, globalBestLap, globalBestSectors, onDriverSelect }) => {
  // Sort drivers by position for display
  const sortedDrivers = Object.values(drivers).sort((a, b) => {
    if (a.position === null && b.position === null) return 0;
    if (a.position === null) return 1;
    if (b.position === null) return -1;
    return a.position - b.position;
  });

  return (
    <div className="bg-secondary dark:bg-secondary-dark rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">Pos</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">#</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">Driver</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">Lap</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">Last Lap</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">Best</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">S1</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">S2</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">S3</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">Tyres</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-text dark:text-muted-text-dark uppercase tracking-wider">Pits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedDrivers.map((driver) => (
              <DriverRow
                key={driver.driverId}
                driver={driver}
                driverBestLaps={driverBestLaps}
                driverBestSectors={driverBestSectors}
                globalBestLap={globalBestLap}
                globalBestSectors={globalBestSectors}
                onDriverSelect={onDriverSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 text-sm text-muted-text dark:text-muted-text-dark">
        <h3 className="font-semibold mb-2">Legend:</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-sector-purple mr-1"></span> Overall Fastest
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-sector-green mr-1"></span> Personal Best
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-sector-yellow mr-1"></span> Slower Sector
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-pit-stop mr-1"></span> Pit Stop Lap
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimesheetTable;