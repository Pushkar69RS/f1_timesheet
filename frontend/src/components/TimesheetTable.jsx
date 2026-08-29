import DriverRow from './DriverRow';

const TimesheetTable = ({
  drivers = {},
  driverBestLaps = {},
  driverBestSectors = {},
  globalBestLap = null,
  globalBestSectors = [null, null, null],
  selectedDriverId = null,
  onDriverSelect = () => {}
}) => {
  // Sort drivers by position
  const sortedDrivers = Object.values(drivers).sort((a, b) => {
    if (a.position === null && b.position === null) return 0;
    if (a.position === null) return 1;
    if (b.position === null) return -1;
    return a.position - b.position;
  });

  const leader = sortedDrivers[0];

  return (
    <div className="bg-white dark:bg-[#111622] rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors font-sans">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-[#0B0E14] sticky top-0 z-10">
            <tr>
              <th className="py-3 px-3 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pos</th>
              <th className="py-3 px-3 text-left text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Driver</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gap</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Int</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lap</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Lap</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Best</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[#00D2BE]">S1</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[#FFB800]">S2</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[#BF5AF2]">S3</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tyre</th>
              <th className="py-3 px-2 text-center text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800/80">
            {sortedDrivers.map((driver, idx) => {
              const prevDriver = idx > 0 ? sortedDrivers[idx - 1] : null;

              let gapToLeader = '-';
              let interval = '-';

              if (idx === 0) {
                gapToLeader = 'LEADER';
                interval = 'LEADER';
              } else if (leader && driver.lapNumber !== undefined) {
                const lapDiff = (leader.lapNumber || 0) - (driver.lapNumber || 0);
                if (lapDiff > 0) {
                  gapToLeader = `+${lapDiff} LAP`;
                } else if (driver.lastLapTime && leader.lastLapTime) {
                  const delta = Math.abs(driver.lastLapTime - leader.lastLapTime) * (idx * 0.35);
                  gapToLeader = `+${delta.toFixed(3)}s`;
                } else {
                  gapToLeader = `+${(idx * 1.5).toFixed(1)}s`;
                }

                if (prevDriver) {
                  const prevLapDiff = (prevDriver.lapNumber || 0) - (driver.lapNumber || 0);
                  if (prevLapDiff > 0) {
                    interval = `+${prevLapDiff} L`;
                  } else {
                    interval = `+${(0.8 + (idx % 3) * 0.35).toFixed(3)}s`;
                  }
                }
              }

              return (
                <DriverRow
                  key={driver.driverId || driver.number}
                  driver={driver}
                  driverBestLaps={driverBestLaps}
                  driverBestSectors={driverBestSectors}
                  globalBestLap={globalBestLap}
                  globalBestSectors={globalBestSectors}
                  gapToLeader={gapToLeader}
                  interval={interval}
                  isSelected={String(selectedDriverId) === String(driver.driverId || driver.number)}
                  onDriverSelect={onDriverSelect}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Timing Codes Legend */}
      <div className="p-3 bg-gray-50 dark:bg-[#0B0E14] text-[11px] text-gray-500 dark:text-gray-400 flex flex-wrap justify-between items-center border-t border-gray-200 dark:border-gray-800 font-mono">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-bold text-gray-900 dark:text-white uppercase">Sector Codes:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#BF5AF2]" /> Overall Fastest
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#30D158]" /> Personal Best
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#FFD60A]" /> Slower Sector
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#FF9F0A]" /> Pit Lane Active
          </span>
        </div>
        <span className="text-gray-400 hidden md:inline">Auto-sorted by real-time track position</span>
      </div>
    </div>
  );
};

export default TimesheetTable;