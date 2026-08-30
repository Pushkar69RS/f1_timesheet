import { useState } from 'react';

export default function WeatherWidget({ weather = null, isStormMode = false, onToggleStorm = () => {} }) {
  const [localStorm, setLocalStorm] = useState(false);

  const defaultWeather = {
    trackTemp: 32,
    airTemp: 23,
    humidity: 52,
    windSpeed: 12,
    windDir: 'SW',
    rainRisk: 15,
    condition: 'Dry / Optimal',
  };

  const isRaining = isStormMode || localStorm;

  const data = isRaining ? {
    trackTemp: 19,
    airTemp: 16,
    humidity: 94,
    windSpeed: 28,
    windDir: 'NW',
    rainRisk: 95,
    condition: '🌧️ Heavy Rain / Intermediate Surface',
  } : (weather || defaultWeather);

  const toggleRain = () => {
    setLocalStorm(prev => !prev);
    if (onToggleStorm) onToggleStorm(!isRaining);
  };

  return (
    <div className="bg-white dark:bg-[#111622] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-colors relative overflow-hidden font-sans">
      {/* Subtle Rain Droplets Overlay when Raining */}
      {isRaining && (
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none border-b-2 border-cyan-400 animate-pulse" />
      )}

      <div className="flex items-center gap-2.5 z-10">
        <span className="text-xl">{isRaining ? '🌧️' : '⛅'}</span>
        <div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block leading-none font-mono">
            Track Conditions
          </span>
          <span className="font-bold text-gray-900 dark:text-white text-xs">{data.condition}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3.5 text-[11px] font-mono z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Track:</span>
          <span className="font-bold text-red-600 dark:text-red-400">{data.trackTemp}°C</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Air:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{data.airTemp}°C</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Rain Risk:</span>
          <span className={`font-bold ${data.rainRisk > 30 ? 'text-cyan-400 animate-pulse' : 'text-green-500'}`}>
            {data.rainRisk}%
          </span>
        </div>

        <div className="flex items-center gap-1.5 hidden sm:flex">
          <span className="text-gray-400">Wind:</span>
          <span className="font-bold text-gray-700 dark:text-gray-300">
            {data.windSpeed} km/h {data.windDir}
          </span>
        </div>

        {/* Rain Simulator Toggle */}
        <button
          onClick={toggleRain}
          className={`px-2.5 py-1 rounded-md border font-bold text-[10px] transition-all flex items-center gap-1 ${
            isRaining
              ? 'bg-cyan-600/20 border-cyan-400 text-cyan-400 shadow-sm'
              : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 hover:text-gray-200'
          }`}
          title="Toggle Wet Weather Simulation"
        >
          <span>{isRaining ? '🌧️ Rain Active' : '⛅ Test Rain'}</span>
        </button>
      </div>
    </div>
  );
}
