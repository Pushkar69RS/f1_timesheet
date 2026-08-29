import { useRef, useEffect, useCallback, useState } from 'react';
import { getTeamColor } from '../utils/teamColors';
import { getCircuit } from '../utils/circuitData';

function getSplinePoint(pts, progress) {
  if (!pts || pts.length === 0) return { x: 400, y: 400 };
  const n = pts.length;
  const p = ((progress % 1) + 1) % 1;
  const exactIndex = p * n;
  const i0 = Math.floor(exactIndex) % n;
  const i1 = (i0 + 1) % n;
  const i2 = (i0 + 2) % n;
  const i_prev = (i0 - 1 + n) % n;
  const t = exactIndex - Math.floor(exactIndex);

  const p0 = pts[i_prev];
  const p1 = pts[i0];
  const p2 = pts[i1];
  const p3 = pts[i2];

  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
  };
}

export default function TrackMap({
  sessionInfo = null,
  drivers = {},
  selectedDriverId = null,
  onDriverSelect = () => {}
}) {
  const canvasRef = useRef(null);
  const [hoveredDriver, setHoveredDriver] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCorners, setShowCorners] = useState(true);
  const [showDrs, setShowDrs] = useState(true);
  const animFrameRef = useRef(null);
  const driverRenderPosRef = useRef({});

  const circuitNameKey = sessionInfo?.circuit_short_name || sessionInfo?.name || 'Silverstone';
  const circuit = sessionInfo?.circuit || getCircuit(circuitNameKey);
  const circuitPath = circuit?.path && circuit.path.length > 0 ? circuit.path : getCircuit('Silverstone').path;
  const circuitName = circuit?.name || sessionInfo?.circuit_short_name || 'Silverstone Circuit';

  // 300 dense spline points
  const densePathRef = useRef([]);
  useEffect(() => {
    const dense = [];
    const stepCount = 300;
    for (let i = 0; i < stepCount; i++) {
      const frac = i / stepCount;
      dense.push(getSplinePoint(circuitPath, frac));
    }
    densePathRef.current = dense;
  }, [circuitPath]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Compute bounding box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    circuitPath.forEach(pt => {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });

    const padding = 55;
    const pathWidth = maxX - minX || 1;
    const pathHeight = maxY - minY || 1;
    const scale = Math.min((width - padding * 2) / pathWidth, (height - padding * 2) / pathHeight);
    const offsetX = (width - pathWidth * scale) / 2 - minX * scale;
    const offsetY = (height - pathHeight * scale) / 2 - minY * scale;

    const toCanvasX = (x) => x * scale + offsetX;
    const toCanvasY = (y) => y * scale + offsetY;

    const dense = densePathRef.current;
    if (dense.length < 2) return;

    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');

    // 1. Draw Asphalt Base Outline
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#1C2433' : '#E5E7EB';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    dense.forEach((pt, i) => {
      const cx = toCanvasX(pt.x);
      const cy = toCanvasY(pt.y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.closePath();
    ctx.stroke();

    // 2. Draw Track Surface Core
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#2D3748' : '#9CA3AF';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    dense.forEach((pt, i) => {
      const cx = toCanvasX(pt.x);
      const cy = toCanvasY(pt.y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.closePath();
    ctx.stroke();

    // 3. Draw Sectors (Cyan S1, Gold S2, Purple S3)
    const sectorColors = circuit?.sectors || [
      { color: '#00D2BE', startPct: 0.0, endPct: 0.32 },
      { color: '#FFB800', startPct: 0.32, endPct: 0.68 },
      { color: '#BF5AF2', startPct: 0.68, endPct: 1.0 },
    ];

    sectorColors.forEach((sec) => {
      ctx.beginPath();
      ctx.strokeStyle = sec.color;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';

      const startIdx = Math.floor(sec.startPct * dense.length);
      const endIdx = Math.floor(sec.endPct * dense.length);

      for (let i = startIdx; i <= endIdx && i < dense.length; i++) {
        const pt = dense[i];
        const cx = toCanvasX(pt.x);
        const cy = toCanvasY(pt.y);
        if (i === startIdx) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    });

    // 4. Draw DRS Zones if enabled
    if (showDrs && circuit?.drsZonesList) {
      circuit.drsZonesList.forEach(drs => {
        ctx.beginPath();
        ctx.strokeStyle = '#00FF66';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#00FF66';
        ctx.shadowBlur = 8;
        const sIdx = Math.floor(drs.startPct * dense.length);
        const eIdx = Math.floor(drs.endPct * dense.length);
        for (let i = sIdx; i <= eIdx && i < dense.length; i++) {
          const pt = dense[i];
          const cx = toCanvasX(pt.x);
          const cy = toCanvasY(pt.y);
          if (i === sIdx) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });
    }

    // 5. Draw Start / Finish Chequered Line
    if (dense.length > 0) {
      const startPt = dense[0];
      const sX = toCanvasX(startPt.x);
      const sY = toCanvasY(startPt.y);

      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E10600';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sX, sY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? '#FFFFFF' : '#111827';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('FINISH', sX - 16, sY - 10);
      ctx.restore();
    }

    // 6. Draw Corner Labels if enabled
    if (showCorners && circuit?.cornerLabels) {
      ctx.fillStyle = isDark ? '#94A3B8' : '#4B5563';
      ctx.font = 'bold 8px sans-serif';
      circuit.cornerLabels.forEach(corner => {
        const pt = getSplinePoint(circuitPath, corner.pct);
        const cx = toCanvasX(pt.x);
        const cy = toCanvasY(pt.y);
        ctx.fillText(corner.name, cx + 7, cy - 7);
      });
    }

    // 7. Draw Driver Markers
    const driverList = Object.values(drivers);
    driverList.forEach((driver) => {
      const driverId = String(driver.driverId || driver.number);
      const targetPos = getSplinePoint(circuitPath, driver.trackProgress || 0);

      const targetCanvasX = toCanvasX(targetPos.x);
      const targetCanvasY = toCanvasY(targetPos.y);

      if (!driverRenderPosRef.current[driverId]) {
        driverRenderPosRef.current[driverId] = { x: targetCanvasX, y: targetCanvasY };
      }
      const cur = driverRenderPosRef.current[driverId];
      cur.x += (targetCanvasX - cur.x) * 0.25;
      cur.y += (targetCanvasY - cur.y) * 0.25;

      const cx = cur.x;
      const cy = cur.y;

      const isSelected = String(selectedDriverId) === driverId;
      const teamColor = driver.team_colour ? `#${driver.team_colour}` : getTeamColor(driver.team);
      const radius = isSelected ? 12 : 9;

      // Outer Selection Aura
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(225, 6, 0, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#E10600';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Main Driver Circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = teamColor;
      ctx.shadowColor = teamColor;
      ctx.shadowBlur = isSelected ? 12 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Driver Number
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${isSelected ? 10 : 8}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const numStr = String(driver.number || driverId);
      ctx.fillText(numStr, cx, cy);

      // Top 5 Position Badge
      if (driver.position && driver.position <= 5) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.beginPath();
        ctx.roundRect(cx - 9, cy - 18, 18, 9, 2);
        ctx.fill();
        ctx.fillStyle = driver.position === 1 ? '#FFD700' : '#E2E8F0';
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText(`P${driver.position}`, cx, cy - 13.5);
      }
    });

    animFrameRef.current = requestAnimationFrame(renderCanvas);
  }, [circuitPath, circuit, drivers, selectedDriverId, showCorners, showDrs]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(renderCanvas);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [renderCanvas]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setMousePos({ x: mx, y: my });

    const driverList = Object.values(drivers);
    let found = null;
    driverList.forEach((d) => {
      const driverId = String(d.driverId || d.number);
      const pos = driverRenderPosRef.current[driverId];
      if (pos) {
        const dist = Math.hypot(pos.x - mx, pos.y - my);
        if (dist < 15) {
          found = d;
        }
      }
    });
    setHoveredDriver(found);
  };

  const handleCanvasClick = () => {
    if (hoveredDriver) {
      onDriverSelect(hoveredDriver.driverId || hoveredDriver.number);
    }
  };

  return (
    <div className="relative bg-white dark:bg-[#111622] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col font-sans transition-colors">
      {/* Header Bar */}
      <div className="p-3.5 px-5 bg-gray-50 dark:bg-[#0B0E14] border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🗺️</span>
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-white">
              {circuitName}
            </h3>
            <span className="text-[11px] font-mono text-gray-500">
              {circuit?.lengthKm || 5.4} km • {circuit?.corners || 15} Turns • {circuit?.drsZones || 2} DRS Zones
            </span>
          </div>
        </div>

        {/* Interactive Overlays Toggles */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowCorners(!showCorners)}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-bold transition-all ${
              showCorners
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            Turn Names
          </button>
          <button
            onClick={() => setShowDrs(!showDrs)}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-bold transition-all ${
              showDrs
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            DRS Zones
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[480px] bg-gray-50/50 dark:bg-[#07090E] cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredDriver(null)}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />

        {/* Hover Tooltip Card */}
        {hoveredDriver && (
          <div
            className="absolute pointer-events-none z-30 p-2.5 rounded-lg bg-gray-900/95 text-white shadow-2xl border border-gray-700 text-xs font-mono transform -translate-x-1/2 -translate-y-full mb-3 backdrop-blur-md"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: hoveredDriver.team_colour ? `#${hoveredDriver.team_colour}` : getTeamColor(hoveredDriver.team) }}
              />
              <span className="font-black text-sm">#{hoveredDriver.number} {hoveredDriver.driverName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-bold">
                P{hoveredDriver.position}
              </span>
            </div>
            <div className="text-[11px] text-gray-300 space-y-0.5">
              <div>Team: <span className="text-white font-bold">{hoveredDriver.team}</span></div>
              <div>Tyre: <span className="text-yellow-400 font-bold">{hoveredDriver.tyres || 'MEDIUM'}</span></div>
              <div>Lap: <span className="text-white font-bold">{hoveredDriver.lapNumber || 1}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Sector Legend Footer */}
      <div className="p-2.5 px-4 bg-gray-50 dark:bg-[#0B0E14] border-t border-gray-200 dark:border-gray-800 flex flex-wrap justify-between items-center text-[11px] font-mono text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-[#00D2BE]" /> Sector 1
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-[#FFB800]" /> Sector 2
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-[#BF5AF2]" /> Sector 3
          </span>
          {showDrs && (
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-3 h-1 rounded-full bg-[#00FF66]" /> DRS Active
            </span>
          )}
        </div>
        <span className="text-[10px] text-gray-400 hidden sm:inline">Click car marker to inspect telemetry</span>
      </div>
    </div>
  );
}
