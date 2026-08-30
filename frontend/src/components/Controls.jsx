import { useEffect } from 'react';

const Controls = ({
  isPaused = true,
  replaySpeed = 1,
  onPlayPause = () => {},
  onSpeedChange = () => {},
  onRestart = () => {},
}) => {
  const speedOptions = [0.25, 0.5, 1, 2, 4];

  // Global Keyboard Shortcuts (Space to play/pause, keys 1-5 for speed)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or select
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        onPlayPause();
      } else if (e.key === '1') {
        onSpeedChange(0.25);
      } else if (e.key === '2') {
        onSpeedChange(0.5);
      } else if (e.key === '3') {
        onSpeedChange(1);
      } else if (e.key === '4') {
        onSpeedChange(2);
      } else if (e.key === '5') {
        onSpeedChange(4);
      } else if (e.key === 'r' || e.key === 'R') {
        onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onSpeedChange, onRestart]);

  return (
    <div className="bg-white dark:bg-[#111622] p-4 md:p-5 rounded-2xl shadow-xl flex flex-col space-y-4 border border-gray-200 dark:border-gray-800 transition-all font-sans">
      {/* Primary Playback Deck */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPlayPause}
          className={`flex-1 py-3 px-5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
            isPaused
              ? 'bg-gradient-to-r from-red-600 to-[#E10600] hover:from-red-500 hover:to-red-600 text-white shadow-red-600/40 hover:scale-[1.02]'
              : 'bg-[#FFD60A] hover:bg-yellow-400 text-black shadow-yellow-500/30 hover:scale-[1.02]'
          }`}
        >
          <span className="text-base">{isPaused ? '▶' : '❚❚'}</span>
          <span>{isPaused ? 'START REPLAY' : 'PAUSE REPLAY'}</span>
        </button>

        <button
          onClick={onRestart}
          className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800 active:scale-95 shadow-sm flex items-center gap-1.5"
          title="Restart Replay from Lap 1 (Press R)"
        >
          <span>↺</span>
          <span className="hidden sm:inline">RESTART</span>
        </button>
      </div>

      {/* Speed Multiplier & Keyboard Helper */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-100 dark:border-gray-800/80">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Speed:
          </label>
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-950 p-1 rounded-lg border border-gray-200 dark:border-gray-800/80">
            {speedOptions.map(speed => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`py-1 px-2.5 rounded text-xs font-black font-mono transition-all ${
                  replaySpeed === speed
                    ? 'bg-gradient-to-r from-red-600 to-[#E10600] text-white shadow-sm scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcut Indicator */}
        <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 hidden md:inline">
          ⌨️ <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">Space</kbd> Play/Pause
        </span>
      </div>
    </div>
  );
};

export default Controls;