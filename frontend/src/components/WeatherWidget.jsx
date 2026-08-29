export default function WeatherWidget({ weather = null, circuitName = 'Silverstone Circuit' }) {
  const defaultWeather = {
    trackTemp: 32,
    airTemp: 23,
    humidity: 52,
    windSpeed: 12,
    windDir: 'SW',
    rainRisk: 15,
    condition: 'Dry / Optimal',
  };

  const data = weather || defaultWeather;

  return (
    <div className="bg-white dark:bg-[#111622] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-colors">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">⛅</span>
        <div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block leading-none">
            Track Conditions
          </span>
          <span className="font-bold text-gray-900 dark:text-white text-xs">{data.condition}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px]">
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
          <span className={`font-bold ${data.rainRisk > 30 ? 'text-amber-500' : 'text-green-500'}`}>
            {data.rainRisk}%
          </span>
        </div>

        <div className="flex items-center gap-1.5 hidden sm:flex">
          <span className="text-gray-400">Wind:</span>
          <span className="font-bold text-gray-700 dark:text-gray-300">
            {data.windSpeed} km/h {data.windDir}
          </span>
        </div>
      </div>
    </div>
  );
}
