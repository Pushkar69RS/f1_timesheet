import React from 'react';

const ProgressBar = ({ progress, currentLap, totalLaps }) => {
  return (
    <div className="bg-secondary dark:bg-secondary-dark p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2">Replay Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-muted-text dark:text-muted-text-dark mt-2">
        <span>Lap: {currentLap}/{totalLaps}</span>
        <span>{progress.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;