import { useState, useEffect, useRef } from 'react';
import { soundFX } from '../utils/soundFx';

export default function ReactionGameModal({ isOpen, onClose }) {
  // Game states: 'idle' | 'starting' | 'ready' | 'jump_start' | 'finished'
  const [gameState, setGameState] = useState('idle');
  const [lightCount, setLightCount] = useState(0);
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [history, setHistory] = useState([]);

  const startTimeRef = useRef(0);
  const timerSequenceRef = useRef([]);

  // Load saved best score from localStorage
  useEffect(() => {
    try {
      const savedBest = localStorage.getItem('f1_reaction_best');
      if (savedBest) setBestTime(Number(savedBest));
    } catch {
      // ignore
    }
  }, []);

  const clearTimers = () => {
    timerSequenceRef.current.forEach(t => clearTimeout(t));
    timerSequenceRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const startSequence = () => {
    clearTimers();
    setGameState('starting');
    setLightCount(0);
    setReactionTime(null);

    // Sequence: 5 lights turn on at 1-second intervals
    for (let i = 1; i <= 5; i++) {
      const timer = setTimeout(() => {
        setLightCount(i);
        soundFX.playLightOnBeep();
      }, i * 1000);
      timerSequenceRef.current.push(timer);
    }

    // Random hold after 5 lights: between 0.4s and 3.2s
    const randomHold = 5000 + 400 + Math.random() * 2800;
    const lightsOutTimer = setTimeout(() => {
      setLightCount(0);
      setGameState('ready');
      startTimeRef.current = performance.now();
      soundFX.playLightsOutBeep();
    }, randomHold);
    timerSequenceRef.current.push(lightsOutTimer);
  };

  const handleTrigger = () => {
    if (gameState === 'idle' || gameState === 'finished' || gameState === 'jump_start') {
      startSequence();
      return;
    }

    if (gameState === 'starting') {
      // User pressed before lights went out! JUMP START!
      clearTimers();
      setGameState('jump_start');
      setLightCount(5);
      return;
    }

    if (gameState === 'ready') {
      // Valid reaction!
      const endTime = performance.now();
      const diffMs = Math.round(endTime - startTimeRef.current);
      setReactionTime(diffMs);
      setGameState('finished');

      setHistory(prev => [diffMs, ...prev.slice(0, 4)]);

      if (!bestTime || diffMs < bestTime) {
        setBestTime(diffMs);
        try {
          localStorage.setItem('f1_reaction_best', String(diffMs));
        } catch {
          // ignore
        }
      }
    }
  };

  // Keyboard shortcut listener (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleTrigger();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen) return null;

  const getRating = (ms) => {
    if (ms < 190) return { label: '🔥 ALONSO SPEED (ELITE)', color: 'text-amber-400', desc: 'World Champion reflexes!' };
    if (ms < 220) return { label: '⚡ F1 DRIVER LEVEL', color: 'text-green-400', desc: 'Faster than most of the grid!' };
    if (ms < 280) return { label: '🏎️ COMPETITIVE PRO', color: 'text-blue-400', desc: 'Solid Grand Prix launch!' };
    if (ms < 350) return { label: '🚗 AVERAGE MOTORIST', color: 'text-yellow-400', desc: 'A bit sluggish off the line.' };
    return { label: '🐢 TRACTOR LAUNCH', color: 'text-red-400', desc: 'You got swamped into Turn 1!' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-xl bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 overflow-hidden font-mono">
        {/* Header */}
        <div className="p-4 px-6 bg-gray-950 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚦</span>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-white">
                F1 Five Red Lights Reaction Test
              </h3>
              <p className="text-[10px] text-gray-400 font-sans">Test your launch reaction time against real Formula 1 drivers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold text-lg px-2 py-0.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Interactive Click Area */}
        <div
          onClick={handleTrigger}
          className="p-8 py-10 flex flex-col items-center justify-center cursor-pointer select-none bg-gradient-to-b from-gray-900 to-gray-950 hover:brightness-105 active:scale-[0.99] transition-all min-h-[300px]"
        >
          {/* 5 Gantry Light Columns */}
          <div className="flex items-center justify-center gap-3 md:gap-5 p-4 md:p-6 bg-black/90 rounded-2xl border-2 border-gray-800 shadow-2xl mb-8">
            {[1, 2, 3, 4, 5].map((index) => {
              const isOn = lightCount >= index;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-2 bg-gray-950 rounded-xl border border-gray-800"
                >
                  {/* Top Black Cap */}
                  <div className="w-8 h-2 bg-gray-900 rounded-t-sm" />
                  {/* Pair of Red LEDs */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-100 ${
                      isOn
                        ? 'bg-red-600 border-red-400 shadow-[0_0_20px_#E10600]'
                        : 'bg-red-950/40 border-gray-800'
                    }`}
                  />
                  <div
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-100 ${
                      isOn
                        ? 'bg-red-600 border-red-400 shadow-[0_0_20px_#E10600]'
                        : 'bg-red-950/40 border-gray-800'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Dynamic Status / Feedback Display */}
          <div className="text-center space-y-2">
            {gameState === 'idle' && (
              <div>
                <span className="text-sm font-black text-amber-400 block mb-1">TAP ANYWHERE OR PRESS SPACE TO START</span>
                <span className="text-xs text-gray-400 font-sans">Wait for all 5 red lights to turn on, then release / click immediately when they go OUT!</span>
              </div>
            )}

            {gameState === 'starting' && (
              <div>
                <span className="text-base font-black text-red-500 animate-pulse block">GET READY...</span>
                <span className="text-xs text-gray-400 font-sans">Do NOT click early! Hold your nerve...</span>
              </div>
            )}

            {gameState === 'ready' && (
              <div>
                <span className="text-2xl font-black text-green-400 animate-bounce block">LIGHTS OUT! GO! GO! GO!</span>
                <span className="text-xs text-green-300 font-sans">CLICK NOW!</span>
              </div>
            )}

            {gameState === 'jump_start' && (
              <div className="p-3 bg-red-950/80 border border-red-600 rounded-xl">
                <span className="text-lg font-black text-red-400 block">🛑 FALSE START! +5s PENALTY</span>
                <span className="text-xs text-gray-300 font-sans">You jumped the start before the lights went out! Tap to try again.</span>
              </div>
            )}

            {gameState === 'finished' && reactionTime && (
              <div className="space-y-2">
                <div className="text-4xl font-black text-white">
                  {reactionTime} <span className="text-lg text-gray-400">ms</span>
                </div>
                {(() => {
                  const rating = getRating(reactionTime);
                  return (
                    <div>
                      <span className={`font-black text-sm block ${rating.color}`}>{rating.label}</span>
                      <span className="text-xs text-gray-400 font-sans">{rating.desc}</span>
                    </div>
                  );
                })()}
                <span className="text-[11px] text-gray-500 block pt-2">Tap anywhere or press Space to retry</span>
              </div>
            )}
          </div>
        </div>

        {/* Benchmarks & Personal Best Footer */}
        <div className="p-4 px-6 bg-gray-950 border-t border-gray-800 flex flex-wrap justify-between items-center text-xs gap-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-gray-500 uppercase block">Personal Best</span>
              <span className="font-bold text-amber-400">{bestTime ? `${bestTime} ms` : '—'}</span>
            </div>
            {history.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Recent Runs</span>
                <span className="text-gray-300 font-mono">{history.map(t => `${t}ms`).join(' | ')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span>🏁 Alonso: <b>180ms</b></span>
            <span>Verstappen: <b>195ms</b></span>
            <span>Hamilton: <b>210ms</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}
