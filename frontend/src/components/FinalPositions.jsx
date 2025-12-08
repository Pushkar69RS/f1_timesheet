import React from 'react';
import { getTeamColor } from '../utils/teamColors';

const FinalPositions = ({ drivers, isVisible }) => {
  if (!isVisible) return null;

  const pointsSystem = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
  };

  const driverArray = Object.values(drivers).filter(d => d && d.driverName);

  const sortedDrivers = driverArray.sort((a, b) => {
    const posA = a.position || 999;
    const posB = b.position || 999;
    return posA - posB;
  });

  return (
    <div className="bg-secondary dark:bg-secondary-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary-dark text-center">
        🏁 Final Race Classification
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="text-left py-2 px-3 font-bold text-app-text dark:text-app-text-dark">Pos</th>
              <th className="text-left py-2 px-3 font-bold text-app-text dark:text-app-text-dark">Driver</th>
              <th className="text-left py-2 px-3 font-bold text-app-text dark:text-app-text-dark">Team</th>
              <th className="text-center py-2 px-3 font-bold text-app-text dark:text-app-text-dark">Laps</th>
              <th className="text-center py-2 px-3 font-bold text-app-text dark:text-app-text-dark">Best Lap</th>
              <th className="text-center py-2 px-3 font-bold text-app-text dark:text-app-text-dark">Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedDrivers.map((driver, idx) => {
              const position = driver.position || idx + 1;
              const points = pointsSystem[position] || 0;
              const teamColor = getTeamColor(driver.team);

              return (
                <tr
                  key={driver.driverId || idx}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-app-text dark:text-app-text-dark">{position}</span>
                      <div
                        className="w-1 h-8 rounded"
                        style={{ backgroundColor: teamColor }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: teamColor }}
                      >
                        {driver.number}
                      </div>
                      <span className="font-semibold text-app-text dark:text-app-text-dark">
                        {driver.driverName || driver.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted-text dark:text-muted-text-dark">
                    {driver.team || driver.team_name || '-'}
                  </td>
                  <td className="py-3 px-3 text-center text-app-text dark:text-app-text-dark">
                    {driver.lapNumber || driver.lap || '-'}
                  </td>
                  <td className="py-3 px-3 text-center text-app-text dark:text-app-text-dark">
                    {driver.bestLapTime ? (typeof driver.bestLapTime === 'number' ? driver.bestLapTime.toFixed(3) : driver.bestLapTime) : '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                      {points > 0 ? points : '-'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinalPositions;
