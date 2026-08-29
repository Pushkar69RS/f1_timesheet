const Controls = ({
  isPaused,
  replaySpeed,
  progress,
  currentLap,
  totalLaps,
  onPlayPause,
  onSpeedChange,
  onSeek,
  onRestart
}) => {
  const speedOptions = [0.25, 0.5, 1, 2, 4];

  const handleSeekChange = (e) => {
    onSeek(parseFloat(e.target.value));
  };

  return (
    <div className="bg-white dark:bg-[#111622] p-4 rounded-xl shadow-lg flex flex-col space-y-4 border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPlayPause}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
            isPaused
              ? 'bg-gradient-to-r from-red-600 to-[#E10600] hover:from-red-500 hover:to-red-600 text-white shadow-red-600/30'
              : 'bg-[#FFD60A] hover:bg-yellow-400 text-black shadow-yellow-500/20'
          }`}
        >
          {isPaused ? '▶ START REPLAY' : '❚❚ PAUSE REPLAY'}
        </button>
        <button
          onClick={onRestart}
          className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800 active:scale-95"
          title="Restart Replay from Lap 1"
        >
          ↺ RESTART
        </button>
      </div>

      {/* Speed Selector Pills */}
      <div>
        <label className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest block mb-1.5">
          Simulation Multiplier
        </label>
        <div className="grid grid-cols-5 gap-1.5 bg-gray-50 dark:bg-gray-950 p-1 rounded-lg border border-gray-200 dark:border-gray-800/80">
          {speedOptions.map(speed => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`py-1.5 rounded text-xs font-black font-mono transition-all ${
                replaySpeed === speed
                  ? 'bg-gradient-to-r from-red-600 to-[#E10600] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber Range */}
      <div className="flex flex-col space-y-1.5">
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 font-mono">
          <span className="font-bold">Lap {currentLap || 1} / {totalLaps || 52}</span>
          <span className="font-bold text-gray-900 dark:text-white font-mono">{progress.toFixed(1)}% Complete</span>
        </div>
        <input
          type="range"
          id="seek"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeekChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-900 rounded-lg appearance-none cursor-pointer accent-[#E10600] border border-gray-300 dark:border-gray-800"
        />
      </div>
    </div>
  );
};

export default Controls;