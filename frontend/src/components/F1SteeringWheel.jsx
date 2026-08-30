import { useEffect, useState } from 'react';

export default function F1SteeringWheel({ driver = null }) {
  const [rpmPct, setRpmPct] = useState(0.65);
  const [gForce, setGForce] = useState({ x: 0, y: 0 });

  // Simulate dynamic engine revs and cornering Gs based on driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 350;
      // Oscillate RPM between 7000 and 12500 RPM
      const simulatedRpm = 0.5 + 0.45 * Math.abs(Math.sin(time));
      setRpmPct(simulatedRpm);

      // Oscillate lateral and longitudinal Gs (-4.5G to +4.5G)
      const gx = Math.sin(time * 1.3) * 3.8;
      const gy = Math.cos(time * 0.9) * 2.5;
      setGForce({ x: gx, y: gy });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const totalLeds = 15;
  const activeLeds = Math.floor(rpmPct * totalLeds);
  const currentGear = driver?.position ? Math.min(8, Math.max(2, 9 - Math.floor((driver.position % 4) + (rpmPct * 3)))) : 7;
  const currentSpeedKmh = Math.round(240 + (rpmPct * 90) - (Math.abs(gForce.x) * 12));

  return (
    <div className="p-4 bg-gray-950 text-white rounded-xl border border-gray-800 shadow-xl font-mono flex flex-col gap-3 select-none">
      {/* Top Shift Lights LED Bar */}
      <div className="flex items-center justify-between gap-1.5 p-2 px-3 bg-black/90 rounded-lg border border-gray-800">
        {[...Array(totalLeds)].map((_, i) => {
          const isActive = i < activeLeds;
          // Green: 0-4, Yellow/Amber: 5-9, Red: 10-12, Blue/Purple: 13-14
          let color = 'bg-gray-800 border-gray-900';
          let glow = '';

          if (isActive) {
            if (i < 5) {
              color = 'bg-green-500 border-green-300';
              glow = 'shadow-[0_0_8px_#22C55E]';
            } else if (i < 10) {
              color = 'bg-yellow-400 border-yellow-200';
              glow = 'shadow-[0_0_8px_#FACC15]';
            } else if (i < 13) {
              color = 'bg-red-600 border-red-400';
              glow = 'shadow-[0_0_10px_#EF4444]';
            } else {
              color = 'bg-purple-500 border-purple-300';
              glow = 'shadow-[0_0_12px_#A855F7] animate-pulse';
            }
          }

          return (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-75 ${color} ${glow}`}
            />
          );
        })}
      </div>

      {/* Steering Display Center */}
      <div className="grid grid-cols-3 gap-2 text-center items-center bg-gray-900/90 p-3 rounded-lg border border-gray-800">
        {/* Speed */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 uppercase">Speed</span>
          <span className="text-xl font-black text-white">{currentSpeedKmh}</span>
          <span className="text-[9px] text-gray-500">KM/H</span>
        </div>

        {/* Gear Box */}
        <div className="flex flex-col items-center p-1 bg-black/80 rounded border border-gray-800">
          <span className="text-[9px] text-gray-400 uppercase font-bold">GEAR</span>
          <span className="text-2xl font-black text-amber-400 leading-none">{currentGear}</span>
          <span className="text-[8px] text-green-400 font-bold">DRS OK</span>
        </div>

        {/* G-Force 2-Axis Friction Ball */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400 uppercase">G-Force</span>
          <div className="relative w-10 h-10 rounded-full border border-gray-700 bg-black/80 flex items-center justify-center overflow-hidden my-0.5">
            {/* Center Crosshair */}
            <div className="absolute w-full h-[1px] bg-gray-800" />
            <div className="absolute h-full w-[1px] bg-gray-800" />
            {/* Friction Ball */}
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444] transition-all duration-75"
              style={{
                transform: `translate(${Math.max(-14, Math.min(14, gForce.x * 3.5))}px, ${Math.max(-14, Math.min(14, gForce.y * 3.5))}px)`
              }}
            />
          </div>
          <span className="text-[9px] text-gray-400">{Math.abs(gForce.x).toFixed(1)}G LAT</span>
        </div>
      </div>
    </div>
  );
}
