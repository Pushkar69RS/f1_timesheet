import { useState } from 'react';
import { getTeamColor, getTyreStyle } from '../utils/teamColors';
import { formatTime } from '../utils/formatTime';
import DriverAvatar from './DriverAvatar';

export default function TelemetryCompareModal({
  isOpen = false,
  onClose = () => {},
  drivers = {}
}) {
  const driverList = Object.values(drivers);
  const [driverAId, setDriverAId] = useState(driverList[0]?.driverId || driverList[0]?.number);
  const [driverBId, setDriverBId] = useState(driverList[1]?.driverId || driverList[1]?.number);

  if (!isOpen) return null;

  const driverA = driverList.find(d => String(d.driverId || d.number) === String(driverAId)) || driverList[0];
  const driverB = driverList.find(d => String(d.driverId || d.number) === String(driverBId)) || driverList[1];

  if (!driverA || !driverB) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#111622] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl overflow-hidden flex flex-col font-sans transition-colors max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#0B0E14]">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Head-to-Head Telemetry Comparison
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6">
          {/* Driver Selectors Header */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Driver A Card */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center">
              <select
                value={driverAId}
                onChange={(e) => setDriverAId(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-bold p-2 rounded-lg mb-3"
              >
                {driverList.map(d => (
                  <option key={d.driverId || d.number} value={d.driverId || d.number}>
                    #{d.number} {d.driverName} ({d.team})
                  </option>
                ))}
              </select>

              <DriverAvatar driver={driverA} size="xl" />
              <h4 className="font-black text-base text-gray-900 dark:text-white mt-2">
                {driverA.driverName}
              </h4>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded text-white mt-1"
                style={{ backgroundColor: colorA }}
              >
                {driverA.team} #{driverA.number}
              </span>
              <span className="text-xs font-mono font-bold text-gray-500 mt-2">
                Current Position: P{driverA.position || '-'}
              </span>
            </div>

            {/* Driver B Card */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center">
              <select
                value={driverBId}
                onChange={(e) => setDriverBId(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-bold p-2 rounded-lg mb-3"
              >
                {driverList.map(d => (
                  <option key={d.driverId || d.number} value={d.driverId || d.number}>
                    #{d.number} {d.driverName} ({d.team})
                  </option>
                ))}
              </select>

              <DriverAvatar driver={driverB} size="xl" />
              <h4 className="font-black text-base text-gray-900 dark:text-white mt-2">
                {driverB.driverName}
              </h4>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded text-white mt-1"
                style={{ backgroundColor: colorB }}
              >
                {driverB.team} #{driverB.number}
              </span>
              <span className="text-xs font-mono font-bold text-gray-500 mt-2">
                Current Position: P{driverB.position || '-'}
              </span>
            </div>
          </div>

          {/* Delta Banner */}
          {lapDelta !== null && (
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-center font-mono text-xs">
              <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-1">
                Fastest Lap Pace Delta
              </span>
              <span className={`text-base font-black ${lapDelta < 0 ? 'text-green-500' : 'text-red-500'}`}>
                {lapDelta < 0
                  ? `${driverA.driverName} is -${Math.abs(lapDelta).toFixed(3)}s faster`
                  : `${driverB.driverName} is -${Math.abs(lapDelta).toFixed(3)}s faster`}
              </span>
            </div>
          )}

          {/* Side-by-Side Comparison Metrics Table */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden font-mono text-xs">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 text-left">{driverA.code}</th>
                  <th className="py-2.5 px-3 text-center">Telemetry Metric</th>
                  <th className="py-2.5 px-3 text-right">{driverB.code}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-900 dark:text-gray-200">
                <tr>
                  <td className="py-2.5 px-3 font-bold">{formatTime(driverA.bestLapTime)}</td>
                  <td className="py-2.5 px-3 text-center text-gray-500 text-[11px]">Best Lap Time</td>
                  <td className="py-2.5 px-3 text-right font-bold">{formatTime(driverB.bestLapTime)}</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-3 font-bold ${s1A && s1B && s1A < s1B ? 'text-green-500' : ''}`}>{formatTime(s1A)}</td>
                  <td className="py-2.5 px-3 text-center text-[#00D2BE] text-[11px] font-bold">Sector 1</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${s1A && s1B && s1B < s1A ? 'text-green-500' : ''}`}>{formatTime(s1B)}</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-3 font-bold ${s2A && s2B && s2A < s2B ? 'text-green-500' : ''}`}>{formatTime(s2A)}</td>
                  <td className="py-2.5 px-3 text-center text-[#FFB800] text-[11px] font-bold">Sector 2</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${s2A && s2B && s2B < s2A ? 'text-green-500' : ''}`}>{formatTime(s2B)}</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-3 font-bold ${s3A && s3B && s3A < s3B ? 'text-green-500' : ''}`}>{formatTime(s3A)}</td>
                  <td className="py-2.5 px-3 text-center text-[#BF5AF2] text-[11px] font-bold">Sector 3</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${s3A && s3B && s3B < s3A ? 'text-green-500' : ''}`}>{formatTime(s3B)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">
                    {tyreStyleA ? (
                      <span className="inline-flex items-center gap-1.5 font-bold">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: tyreStyleA.bg, color: tyreStyleA.text }}>
                          {tyreStyleA.label}
                        </span>
                        {driverA.tyres}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center text-gray-500 text-[11px]">Current Tyre</td>
                  <td className="py-2.5 px-3 text-right">
                    {tyreStyleB ? (
                      <span className="inline-flex items-center justify-end gap-1.5 font-bold">
                        {driverB.tyres}
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: tyreStyleB.bg, color: tyreStyleB.text }}>
                          {tyreStyleB.label}
                        </span>
                      </span>
                    ) : '-'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">{driverA.pitStopCount || 0} stops</td>
                  <td className="py-2.5 px-3 text-center text-gray-500 text-[11px]">Pit Stops</td>
                  <td className="py-2.5 px-3 text-right font-bold">{driverB.pitStopCount || 0} stops</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0E14] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
