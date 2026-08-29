const ProgressBar = ({ progress, currentLap, totalLaps }) => {
  return (
    <div className="bg-white dark:bg-[#111622] p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 font-mono transition-colors">
      <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        <span>Grand Prix Progress</span>
        <span className="text-gray-900 dark:text-white font-bold">{progress.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-950 rounded-full h-2 overflow-hidden border border-gray-300 dark:border-gray-800">
        <div
          className="bg-gradient-to-r from-red-600 via-orange-500 to-[#E10600] h-2 rounded-full transition-all duration-100 ease-linear shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-400 mt-2">
        <span className="font-bold">Lap: {currentLap || 1} / {totalLaps || 52}</span>
        <span className="font-semibold text-gray-800 dark:text-gray-300">
          {progress >= 100 ? '🏁 Chequered Flag' : (progress > 0 ? '🟢 Green Flag Running' : '🟡 Formation Grid')}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;