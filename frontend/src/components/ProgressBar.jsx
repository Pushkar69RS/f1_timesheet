import { useState, useRef, useEffect, useCallback } from 'react';

const ProgressBar = ({
  progress = 0,
  currentLap = 1,
  totalLaps = 52,
  isPaused = true,
  onSeek = () => {},
  totalDurationMs = 5400000 // default ~90 mins if not provided
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(progress);
  const [hoverPct, setHoverPct] = useState(null);
  const [hoverClientX, setHoverClientX] = useState(0);
  const trackRef = useRef(null);

  // Sync dragProgress with incoming WebSocket progress when NOT dragging
  useEffect(() => {
    if (!isDragging) {
      setDragProgress(progress);
    }
  }, [progress, isDragging]);

  const displayProgress = isDragging ? dragProgress : progress;

  // Calculate formatted time hh:mm:ss from percentage
  const formatRaceTime = (pct) => {
    const totalSeconds = Math.max(0, Math.floor((totalDurationMs || 5400000) / 1000));
    const currentSeconds = Math.floor(totalSeconds * (Math.min(100, Math.max(0, pct)) / 100));
    const hrs = Math.floor(currentSeconds / 3600);
    const mins = Math.floor((currentSeconds % 3600) / 60);
    const secs = currentSeconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRacePhase = (pct) => {
    if (pct >= 99.5) return { label: '🏁 CHEQUERED FLAG', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
    if (pct <= 1.0) return { label: '🚦 FORMATION GRID', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' };
    if (pct >= 25 && pct <= 40) return { label: '🛞 PIT STOP WINDOW 1', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' };
    if (pct >= 58 && pct <= 72) return { label: '🛞 PIT STOP WINDOW 2', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' };
    if (pct >= 85) return { label: '🔥 FINAL STINT PUSH', color: 'text-red-400 bg-red-400/10 border-red-400/30' };
    return { label: '🟢 GREEN FLAG RUNNING', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' };
  };

  const calculatePctFromEvent = useCallback((e) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    return (offsetX / rect.width) * 100;
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const newPct = calculatePctFromEvent(e);
    setDragProgress(newPct);
    onSeek(newPct, !isPaused);
  };

  const handlePointerMove = useCallback((e) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      setHoverPct((offsetX / rect.width) * 100);
      setHoverClientX(offsetX);
    }

    if (isDragging) {
      const newPct = calculatePctFromEvent(e);
      setDragProgress(newPct);
      onSeek(newPct, !isPaused);
    }
  }, [isDragging, isPaused, calculatePctFromEvent, onSeek]);

  const handlePointerUp = useCallback((e) => {
    if (isDragging) {
      setIsDragging(false);
      const finalPct = calculatePctFromEvent(e);
      setDragProgress(finalPct);
      onSeek(finalPct, !isPaused);
    }
  }, [isDragging, isPaused, calculatePctFromEvent, onSeek]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Jump helpers for precision scrub
  const jumpLaps = (delta) => {
    const targetLap = Math.max(1, Math.min(totalLaps, (currentLap || 1) + delta));
    const targetPct = ((targetLap - 1) / totalLaps) * 100;
    onSeek(targetPct, !isPaused);
  };

  const jumpToStart = () => onSeek(0, !isPaused);
  const jumpToFinish = () => onSeek(100, false);

  const hoverLap = hoverPct !== null
    ? Math.min(totalLaps, Math.max(1, Math.floor((hoverPct / 100) * totalLaps) + 1))
    : currentLap;

  const currentPhase = getRacePhase(displayProgress);
  const hoverPhase = hoverPct !== null ? getRacePhase(hoverPct) : null;

  return (
    <div className="bg-white dark:bg-[#111622] p-4 md:p-5 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 font-sans transition-all select-none">
      {/* Header Info Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
            Grand Prix Replay Timeline
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${currentPhase.color}`}>
            {currentPhase.label}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            Clock: <strong className="text-gray-900 dark:text-white font-bold">{formatRaceTime(displayProgress)}</strong> / {formatRaceTime(100)}
          </span>
          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold">
            {displayProgress.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Interactive Video Player Scrubber Container */}
      <div className="relative py-3 group">
        {/* Hover Tooltip Bubble */}
        {hoverPct !== null && (
          <div
            className="absolute -top-10 pointer-events-none transform -translate-x-1/2 z-30 transition-opacity duration-150"
            style={{ left: `${hoverClientX}px` }}
          >
            <div className="bg-gray-900/95 dark:bg-black/95 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-2xl border border-gray-700/80 backdrop-blur-md flex items-center gap-2 whitespace-nowrap">
              <span className="text-[#E10600] font-black">LAP {hoverLap}/{totalLaps}</span>
              <span className="text-gray-400">|</span>
              <span className="text-cyan-400">{formatRaceTime(hoverPct)}</span>
              <span className="text-gray-400">|</span>
              <span className="text-amber-400">{hoverPhase?.label.replace(/^[^\w\s]+/, '').trim()}</span>
            </div>
            {/* Tooltip triangle indicator */}
            <div className="w-2 h-2 bg-gray-900 dark:bg-black border-r border-b border-gray-700/80 transform rotate-45 mx-auto -mt-1" />
          </div>
        )}

        {/* Hover Guideline Bar */}
        {hoverPct !== null && (
          <div
            className="absolute top-3 bottom-3 w-0.5 bg-white/40 dark:bg-white/30 pointer-events-none z-10"
            style={{ left: `${hoverClientX}px` }}
          />
        )}

        {/* Scrubber Track Bar */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverPct(null)}
          className="relative w-full h-3 md:h-3.5 bg-gray-200 dark:bg-gray-950 rounded-full cursor-pointer overflow-visible border border-gray-300 dark:border-gray-800 shadow-inner group-hover:h-4 transition-all duration-200"
        >
          {/* Visual Pit Window Segments on Track */}
          <div
            className="absolute top-0 bottom-0 bg-orange-500/15 dark:bg-orange-500/20 border-x border-orange-500/30 rounded-xs pointer-events-none"
            style={{ left: '25%', width: '15%' }}
            title="Pit Stop Window 1"
          />
          <div
            className="absolute top-0 bottom-0 bg-orange-500/15 dark:bg-orange-500/20 border-x border-orange-500/30 rounded-xs pointer-events-none"
            style={{ left: '58%', width: '14%' }}
            title="Pit Stop Window 2"
          />

          {/* Hover Ghost Fill */}
          {hoverPct !== null && (
            <div
              className="absolute top-0 bottom-0 left-0 bg-white/20 dark:bg-white/10 rounded-full pointer-events-none"
              style={{ width: `${hoverPct}%` }}
            />
          )}

          {/* Active Played Fill (Red-Orange F1 Glow Gradient) */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-600 via-orange-500 to-[#E10600] rounded-full shadow-[0_0_12px_rgba(225,6,0,0.5)] transition-all duration-75 ease-linear pointer-events-none"
            style={{ width: `${displayProgress}%` }}
          />

          {/* Milestone Tick Marks (25%, 50%, 75%) */}
          {[25, 50, 75].map(tick => (
            <div
              key={tick}
              className="absolute top-0 bottom-0 w-0.5 bg-gray-400/40 dark:bg-gray-700/60 pointer-events-none"
              style={{ left: `${tick}%` }}
            />
          ))}

          {/* Draggable Scrubber Thumb Head with Glowing Pulse Ring */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-20 transition-transform duration-75"
            style={{ left: `${displayProgress}%` }}
          >
            <div className={`relative flex items-center justify-center ${isDragging ? 'scale-125' : 'group-hover:scale-110'} transition-transform`}>
              {/* Outer Glowing Radar Pulse */}
              <div className="absolute w-6 h-6 rounded-full bg-red-600/30 animate-ping pointer-events-none" />
              {/* Main Thumb */}
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-tr from-red-600 to-[#E10600] border-2 border-white shadow-lg shadow-red-600/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Scrubber Footer: Lap Navigation & Skip Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          <span className="font-bold text-gray-900 dark:text-white">
            LAP {currentLap || 1}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">{totalLaps || 52}</span>
        </div>

        {/* Quick Lap Stepper Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={jumpToStart}
            className="p-1 px-2 rounded bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold border border-gray-200 dark:border-gray-800 transition-colors"
            title="Jump to Lights Out"
          >
            ⏮ Start
          </button>
          <button
            onClick={() => jumpLaps(-5)}
            className="p-1 px-2 rounded bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold border border-gray-200 dark:border-gray-800 transition-colors"
            title="Step Back 5 Laps"
          >
            -5 Laps
          </button>
          <button
            onClick={() => jumpLaps(-1)}
            className="p-1 px-2 rounded bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold border border-gray-200 dark:border-gray-800 transition-colors"
            title="Step Back 1 Lap"
          >
            ◀ -1
          </button>
          <button
            onClick={() => jumpLaps(1)}
            className="p-1 px-2 rounded bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold border border-gray-200 dark:border-gray-800 transition-colors"
            title="Step Forward 1 Lap"
          >
            +1 ▶
          </button>
          <button
            onClick={() => jumpLaps(5)}
            className="p-1 px-2 rounded bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold border border-gray-200 dark:border-gray-800 transition-colors"
            title="Step Forward 5 Laps"
          >
            +5 Laps
          </button>
          <button
            onClick={jumpToFinish}
            className="p-1 px-2 rounded bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold border border-gray-200 dark:border-gray-800 transition-colors"
            title="Jump to Chequered Flag"
          >
            🏁 Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;