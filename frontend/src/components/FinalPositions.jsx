import { getTeamColor } from '../utils/teamColors';
import { formatTime } from '../utils/formatTime';

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
    <div className="bg-white dark:bg-[#111622] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mt-6 transition-colors font-sans">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xl">🏁</span>
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500 uppercase tracking-wider">
          Official 2026 Race Classification & Championship Points
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="text-left py-2 px-3 font-bold">Pos</th>
              <th className="text-left py-2 px-3 font-bold">Driver</th>
              <th className="text-left py-2 px-3 font-bold">Constructor</th>
              <th className="text-center py-2 px-3 font-bold">Laps</th>
              <th className="text-center py-2 px-3 font-bold">Best Lap</th>
              <th className="text-center py-2 px-3 font-bold">FIA Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60">
            {sortedDrivers.map((driver, idx) => {
              const position = driver.position || idx + 1;
              const points = pointsSystem[position] || 0;
              const teamColor = driver.team_colour ? `#${driver.team_colour}` : getTeamColor(driver.team);

              return (
                <tr
                  key={driver.driverId || idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 dark:text-white">{position}</span>
                      <div
                        className="w-1 h-5 rounded-xs"
                        style={{ backgroundColor: teamColor }}
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: teamColor }}
                      >
                        {driver.number}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {driver.driverName || driver.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400">
                    {driver.team || driver.team_name || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center text-gray-700 dark:text-gray-300">
                    {driver.lapNumber || 1}
                  </td>
                  <td className="py-2.5 px-3 text-center text-[#BF5AF2] font-bold">
                    {formatTime(driver.bestLapTime)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`font-black text-sm ${points > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      {points > 0 ? `+${points} PTS` : '—'}
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
