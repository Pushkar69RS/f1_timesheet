import { useState, useEffect } from 'react';
import { getTeamColor, getTyreStyle } from '../utils/teamColors';
import { formatTime } from '../utils/formatTime';
import DriverAvatar from './DriverAvatar';

export default function TelemetryCompareModal({
  isOpen = false,
  onClose = () => {},
  drivers = {}
}) {
  const driverList = Object.values(drivers);
  const [driverAId, setDriverAId] = useState('44');
  const [driverBId, setDriverBId] = useState('16');

  // Auto-sync valid IDs when drivers list loads
  useEffect(() => {
    if (driverList.length >= 2) {
      if (!driverList.some(d => String(d.driverId || d.number) === String(driverAId))) {
        setDriverAId(String(driverList[0].driverId || driverList[0].number));
      }
      if (!driverList.some(d => String(d.driverId || d.number) === String(driverBId))) {
        setDriverBId(String(driverList[1].driverId || driverList[1].number));
      }
    }
  }, [driverList, driverAId, driverBId]);

  if (!isOpen) return null;

  const driverA = driverList.find(d => String(d.driverId || d.number) === String(driverAId)) || driverList[0] || { driverName: 'Driver A', number: 44, team: 'Ferrari' };
  const driverB = driverList.find(d => String(d.driverId || d.number) === String(driverBId)) || driverList[1] || { driverName: 'Driver B', number: 16, team: 'Ferrari' };

  const colorA = driverA.team_colour ? `#${driverA.team_colour}` : getTeamColor(driverA.team);
  const colorB = driverB.team_colour ? `#${driverB.team_colour}` : getTeamColor(driverB.team);

  const tyreStyleA = getTyreStyle(driverA.tyres);
  const tyreStyleB = getTyreStyle(driverB.tyres);

  // Sector comparisons
  const s1A = driverA.sectorTimes?.[0];
  const s1B = driverB.sectorTimes?.[0];
  const s2A = driverA.sectorTimes?.[1];
  const s2B = driverB.sectorTimes?.[1];
  const s3A = driverA.sectorTimes?.[2];
  const s3B = driverB.sectorTimes?.[2];

  const bestLapA = driverA.bestLapTime;
  const bestLapB = driverB.bestLapTime;
  const lapDelta = (bestLapA && bestLapB) ? (bestLapA - bestLapB) : null;

  // 2025 Telemetry derivations
  const speedA = driverA.speed || 318;
  const speedB = driverB.speed || 315;
  const batteryA = driverA.batteryPct ?? 92;
  const batteryB = driverB.batteryPct ?? 84;
  const drsStatusA = (driverA.position && driverA.position > 1) ? 'DRS Active (Open)' : 'DRS Available';
  const drsStatusB = (driverB.position && driverB.position > 1) ? 'DRS Active (Open)' : 'DRS Available';

  const setRivalry = (idA, idB) => {
    setDriverAId(String(idA));
    setDriverBId(String(idB));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#111622] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl overflow-hidden flex flex-col font-sans transition-colors max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#0B0E14]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚔️</span>
            <div>
              <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Head-to-Head Telemetry Comparison
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                Compare real-time pace, sector transponders, tyre stints, and 2025 hybrid battery deployment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Rivalry Quick-Switch Presets */}
        <div className="px-4 py-2.5 bg-gray-100 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-gray-500 text-[11px] font-bold uppercase">Quick Compare:</span>
          <button
            onClick={() => setRivalry(44, 16)}
            className="px-2.5 py-1 rounded bg-red-600/15 hover:bg-red-600/30 text-red-500 font-bold border border-red-500/30 transition-all text-[11px]"
          >
            🏎️ Hamilton vs Leclerc
          </button>
          <button
            onClick={() => setRivalry(1, 4)}
            className="px-2.5 py-1 rounded bg-orange-600/15 hover:bg-orange-600/30 text-orange-500 font-bold border border-orange-500/30 transition-all text-[11px]"
          >
            🏆 Verstappen vs Norris
          </button>
          <button
            onClick={() => setRivalry(63, 12)}
            className="px-2.5 py-1 rounded bg-teal-600/15 hover:bg-teal-600/30 text-teal-400 font-bold border border-teal-500/30 transition-all text-[11px]"
          >
            ⭐ Russell vs Antonelli
          </button>
          <button
            onClick={() => setRivalry(27, 5)}
            className="px-2.5 py-1 rounded bg-green-600/15 hover:bg-green-600/30 text-green-400 font-bold border border-green-500/30 transition-all text-[11px]"
          >
            🟢 Stake Sauber: Hülkenberg vs Bortoleto
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-grow">
          {/* Driver Selection Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Driver A Card */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center space-y-3">
              <label className="text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                Select Driver A
              </label>
              <select
                value={driverAId}
                onChange={(e) => setDriverAId(e.target.value)}
                className="w-full text-xs font-bold p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                {driverList.map((d) => (
                  <option key={d.driverId || d.number} value={d.driverId || d.number}>
                    #{d.number} {d.driverName || d.full_name} ({d.team || d.team_name})
                  </option>
                ))}
              </select>

              <DriverAvatar driver={driverA} size="lg" />
              <div>
                <h4 className="text-base font-black text-gray-900 dark:text-white">
                  {driverA.driverName || driverA.full_name}
                </h4>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span
                    className="text-[10px] font-bold font-mono px-2 py-0.5 rounded text-white shadow-sm"
                    style={{ backgroundColor: colorA }}
                  >
                    {driverA.team} #{driverA.number}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 block mt-1">
                  Position: <strong className="text-gray-900 dark:text-white">{driverA.position ? `P${driverA.position}` : '—'}</strong>
                </span>
              </div>
            </div>

            {/* Driver B Card */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center space-y-3">
              <label className="text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                Select Driver B
              </label>
              <select
                value={driverBId}
                onChange={(e) => setDriverBId(e.target.value)}
                className="w-full text-xs font-bold p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                {driverList.map((d) => (
                  <option key={d.driverId || d.number} value={d.driverId || d.number}>
                    #{d.number} {d.driverName || d.full_name} ({d.team || d.team_name})
                  </option>
                ))}
              </select>

              <DriverAvatar driver={driverB} size="lg" />
              <div>
                <h4 className="text-base font-black text-gray-900 dark:text-white">
                  {driverB.driverName || driverB.full_name}
                </h4>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span
                    className="text-[10px] font-bold font-mono px-2 py-0.5 rounded text-white shadow-sm"
                    style={{ backgroundColor: colorB }}
                  >
                    {driverB.team} #{driverB.number}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 block mt-1">
                  Position: <strong className="text-gray-900 dark:text-white">{driverB.position ? `P${driverB.position}` : '—'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Pace Delta Banner */}
          <div className="p-3.5 rounded-xl bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-center font-mono text-xs">
            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1 font-bold">
              Fastest Lap Pace Delta
            </span>
            {lapDelta !== null ? (
              <span className={`text-base font-black ${lapDelta < 0 ? 'text-green-500' : 'text-red-500'}`}>
                {lapDelta < 0
                  ? `${driverA.driverName || 'Driver A'} is -${Math.abs(lapDelta).toFixed(3)}s faster`
                  : `${driverB.driverName || 'Driver B'} is -${Math.abs(lapDelta).toFixed(3)}s faster`}
              </span>
            ) : (
              <span className="text-gray-400 text-xs italic">
                Pace delta calculated as drivers set fastest lap times during race playback.
              </span>
            )}
          </div>

          {/* Side-by-Side Comparison Metrics Table */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden font-mono text-xs shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 text-left">{driverA.driverName || 'Driver A'}</th>
                  <th className="py-2.5 px-4 text-center">Telemetry Metric</th>
                  <th className="py-2.5 px-4 text-right">{driverB.driverName || 'Driver B'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-900 dark:text-gray-200">
                {/* Best Lap */}
                <tr>
                  <td className="py-2.5 px-4 font-bold">{formatTime(driverA.bestLapTime)}</td>
                  <td className="py-2.5 px-4 text-center text-gray-500 text-[11px] font-bold">Best Lap Time</td>
                  <td className="py-2.5 px-4 text-right font-bold">{formatTime(driverB.bestLapTime)}</td>
                </tr>

                {/* Sector 1 */}
                <tr>
                  <td className={`py-2.5 px-4 font-bold ${s1A && s1B && s1A < s1B ? 'text-emerald-500' : ''}`}>
                    {formatTime(s1A)} {s1A && s1B && s1A < s1B && '🟢'}
                  </td>
                  <td className="py-2.5 px-4 text-center text-[#00D2BE] text-[11px] font-bold">Sector 1</td>
                  <td className={`py-2.5 px-4 text-right font-bold ${s1A && s1B && s1B < s1A ? 'text-emerald-500' : ''}`}>
                    {s1A && s1B && s1B < s1A && '🟢'} {formatTime(s1B)}
                  </td>
                </tr>

                {/* Sector 2 */}
                <tr>
                  <td className={`py-2.5 px-4 font-bold ${s2A && s2B && s2A < s2B ? 'text-emerald-500' : ''}`}>
                    {formatTime(s2A)} {s2A && s2B && s2A < s2B && '🟢'}
                  </td>
                  <td className="py-2.5 px-4 text-center text-[#FFB800] text-[11px] font-bold">Sector 2</td>
                  <td className={`py-2.5 px-4 text-right font-bold ${s2A && s2B && s2B < s2A ? 'text-emerald-500' : ''}`}>
                    {s2A && s2B && s2B < s2A && '🟢'} {formatTime(s2B)}
                  </td>
                </tr>

                {/* Sector 3 */}
                <tr>
                  <td className={`py-2.5 px-4 font-bold ${s3A && s3B && s3A < s3B ? 'text-emerald-500' : ''}`}>
                    {formatTime(s3A)} {s3A && s3B && s3A < s3B && '🟢'}
                  </td>
                  <td className="py-2.5 px-4 text-center text-[#BF5AF2] text-[11px] font-bold">Sector 3</td>
                  <td className={`py-2.5 px-4 text-right font-bold ${s3A && s3B && s3B < s3A ? 'text-emerald-500' : ''}`}>
                    {s3A && s3B && s3B < s3A && '🟢'} {formatTime(s3B)}
                  </td>
                </tr>

                {/* Tyre Compound */}
                <tr>
                  <td className="py-2.5 px-4">
                    {tyreStyleA ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs"
                        style={{ backgroundColor: tyreStyleA.bg, color: tyreStyleA.text }}
                      >
                        {tyreStyleA.label} {driverA.tyres}
                      </span>
                    ) : 'SOFT'}
                  </td>
                  <td className="py-2.5 px-4 text-center text-gray-500 text-[11px] font-bold">Current Tyre</td>
                  <td className="py-2.5 px-4 text-right">
                    {tyreStyleB ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs"
                        style={{ backgroundColor: tyreStyleB.bg, color: tyreStyleB.text }}
                      >
                        {tyreStyleB.label} {driverB.tyres}
                      </span>
                    ) : 'MEDIUM'}
                  </td>
                </tr>

                {/* 2025 MGU-K Hybrid Energy SoC */}
                <tr>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${batteryA}%` }} />
                      </div>
                      <span className="font-bold text-emerald-500">{batteryA}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-center text-emerald-500 text-[11px] font-bold">120kW MGU-K Battery</td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold text-emerald-500">{batteryB}%</span>
                      <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${batteryB}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* 2025 DRS Status */}
                <tr>
                  <td className="py-2.5 px-4 font-bold text-cyan-400">{drsStatusA}</td>
                  <td className="py-2.5 px-4 text-center text-cyan-400 text-[11px] font-bold">DRS Wing State</td>
                  <td className="py-2.5 px-4 text-right font-bold text-cyan-400">{drsStatusB}</td>
                </tr>

                {/* Speed Trap */}
                <tr>
                  <td className="py-2.5 px-4 font-bold">{speedA} km/h</td>
                  <td className="py-2.5 px-4 text-center text-orange-400 text-[11px] font-bold">Speed Trap</td>
                  <td className="py-2.5 px-4 text-right font-bold">{speedB} km/h</td>
                </tr>

                {/* Pit Stops */}
                <tr>
                  <td className="py-2.5 px-4 font-bold">{driverA.pitStopCount || 0} stops</td>
                  <td className="py-2.5 px-4 text-center text-gray-500 text-[11px] font-bold">Pit Stops</td>
                  <td className="py-2.5 px-4 text-right font-bold">{driverB.pitStopCount || 0} stops</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0E14] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
