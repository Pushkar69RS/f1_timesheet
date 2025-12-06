import React from 'react';

const Controls = ({ isPaused, replaySpeed, progress, currentLap, totalLaps, onPlayPause, onSpeedChange, onSeek, onRestart }) => {
  const speedOptions = [0.25, 0.5, 1, 2, 4];

  const handleSeekChange = (e) => {
    onSeek(parseFloat(e.target.value));
  };

  return (
    <div className="bg-secondary dark:bg-secondary-dark p-4 rounded-lg shadow-lg flex flex-col space-y-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-center space-x-4">
        <button
          onClick={onPlayPause}
          className="px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          {isPaused ? 'Play' : 'Pause'}
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-2 rounded-md bg-gray-200 text-app-text dark:bg-gray-700 dark:text-app-text-dark font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Restart
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="speed" className="text-muted-text dark:text-muted-text-dark">Speed:</label>
        <select
          id="speed"
          value={replaySpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="flex-grow p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-app-text dark:text-app-text-dark"
        >
          {speedOptions.map(speed => (
            <option key={speed} value={speed}>{speed}x</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="seek" className="text-muted-text dark:text-muted-text-dark">Seek: {currentLap}/{totalLaps} Laps ({progress.toFixed(1)}%)</label>
        <input
          type="range"
          id="seek"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeekChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
        />
      </div>
    </div>
  );
};

export default Controls;