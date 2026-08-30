import { useRef, useEffect, useCallback, useState } from 'react';
import { getTeamColor, getTyreStyle } from '../utils/teamColors';
import { getCircuit } from '../utils/circuitData';
import { formatTime } from '../utils/formatTime';

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
  safetyCarActive = false,
  onDriverSelect = () => {}
}) {
  const canvasRef = useRef(null);
  const [hoveredDriver, setHoveredDriver] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCorners, setShowCorners] = useState(true);
  const [showDrs, setShowDrs] = useState(true);
  const [showSectors, setShowSectors] = useState(true);
  const [showKerbs, setShowKerbs] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const animFrameRef = useRef(null);
  const driverRenderPosRef = useRef({});
  const driverTrailsRef = useRef({});

  const circuitNameKey = sessionInfo?.circuit_short_name || sessionInfo?.name || 'Silverstone';
  const circuit = getCircuit(circuitNameKey);
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

    const padding = 65;
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

    // 1. Draw Asphalt Run-off Foundation
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#141A26' : '#E2E8F0';
    ctx.lineWidth = 20;
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

    // 2. Draw Apex Red-White Kerbs
    if (showKerbs) {
      for (let i = 0; i < dense.length; i += 3) {
        const pt = dense[i];
        const nextPt = dense[(i + 1) % dense.length];
        const dx = nextPt.x - pt.x;
        const dy = nextPt.y - pt.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const isRed = Math.floor(i / 3) % 2 === 0;
        ctx.strokeStyle = isRed ? '#E10600' : '#FFFFFF';
        ctx.lineWidth = 3;

        const kx1 = toCanvasX(pt.x + nx * 7);
        const ky1 = toCanvasY(pt.y + ny * 7);
        const kx2 = toCanvasX(nextPt.x + nx * 7);
        const ky2 = toCanvasY(nextPt.y + ny * 7);

        ctx.beginPath();
        ctx.moveTo(kx1, ky1);
        ctx.lineTo(kx2, ky2);
        ctx.stroke();
      }
    }

    // 3. Draw Track Main Racing Asphalt Surface
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#232C3D' : '#64748B';
    ctx.lineWidth = 12;
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

    // 4. Draw Sector Lines (S1 Cyan #00D2BE, S2 Gold #FFB800, S3 Purple #BF5AF2)
    if (showSectors) {
      const sectorColors = circuit?.sectors || [
        { color: '#00D2BE', startPct: 0.0, endPct: 0.30, name: 'Sector 1' },
        { color: '#FFB800', startPct: 0.30, endPct: 0.68, name: 'Sector 2' },
        { color: '#BF5AF2', startPct: 0.68, endPct: 1.00, name: 'Sector 3' },
      ];

      sectorColors.forEach((sec) => {
        ctx.beginPath();
        ctx.strokeStyle = sec.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowColor = sec.color;
        ctx.shadowBlur = 6;

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
        ctx.shadowBlur = 0;
      });

      // Draw Sector Split Transponder Gates
      sectorColors.forEach((sec, idx) => {
        if (idx === 0) return;
        const splitPt = getSplinePoint(circuitPath, sec.startPct);
        const sx = toCanvasX(splitPt.x);
        const sy = toCanvasY(splitPt.y);

        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fillStyle = sec.color;
        ctx.shadowColor = sec.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = sec.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(sx - 24, sy - 18, 48, 14, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = sec.color;
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`S${idx} SPLIT`, sx, sy - 11);
        ctx.restore();
      });
    }

    // 5. Draw DRS Zones (Neon Green Glow with DRS Badges)
    if (showDrs && circuit?.drsZonesList && circuit.drsZonesList.length > 0) {
      circuit.drsZonesList.forEach((drs) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#00FF66';
        ctx.lineWidth = 5.5;
        ctx.shadowColor = '#00FF66';
        ctx.shadowBlur = 12;
        ctx.lineCap = 'round';

        const sIdx = Math.floor(drs.startPct * dense.length);
        const eIdx = Math.floor(drs.endPct * dense.length);

        if (sIdx <= eIdx) {
          for (let i = sIdx; i <= eIdx && i < dense.length; i++) {
            const pt = dense[i];
            const cx = toCanvasX(pt.x);
            const cy = toCanvasY(pt.y);
            if (i === sIdx) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }
        } else {
          for (let i = sIdx; i < dense.length; i++) {
            const pt = dense[i];
            const cx = toCanvasX(pt.x);
            const cy = toCanvasY(pt.y);
            if (i === sIdx) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }
          for (let i = 0; i <= eIdx; i++) {
            const pt = dense[i];
            const cx = toCanvasX(pt.x);
            const cy = toCanvasY(pt.y);
            ctx.lineTo(cx, cy);
          }
        }
        ctx.stroke();

        const midPct = sIdx <= eIdx ? (drs.startPct + drs.endPct) / 2 : ((drs.startPct + drs.endPct + 1) / 2) % 1;
        const midPt = getSplinePoint(circuitPath, midPct);
        const mx = toCanvasX(midPt.x);
        const my = toCanvasY(midPt.y);

        ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = '#00FF66';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(mx - 15, my - 16, 30, 13, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#00FF66';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DRS', mx, my - 9.5);
        ctx.restore();
      });
    }

    // 6. Draw Start / Finish Line & Grid Box
    if (dense.length > 0) {
      const startPt = dense[0];
      const sX = toCanvasX(startPt.x);
      const sY = toCanvasY(startPt.y);

      ctx.save();
      ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
      ctx.strokeStyle = '#E10600';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sX, sY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#E10600';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(sX - 32, sY - 22, 64, 15, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#E10600';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏁 FINISH', sX, sY - 14.5);
      ctx.restore();
    }

    // 7. Draw Turn / Corner Names
    if (showCorners && circuit?.cornerLabels && circuit.cornerLabels.length > 0) {
      circuit.cornerLabels.forEach(corner => {
        const pt = getSplinePoint(circuitPath, corner.pct);
        const cx = toCanvasX(pt.x);
        const cy = toCanvasY(pt.y);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#94A3B8' : '#475569';
        ctx.fill();

        ctx.font = 'bold 8px sans-serif';
        const textWidth = ctx.measureText(corner.name).width;
        const badgeWidth = textWidth + 10;
        const badgeHeight = 14;

        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(203, 213, 225, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx + 6, cy - 14, badgeWidth, badgeHeight, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#F1F5F9' : '#0F172A';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(corner.name, cx + 11, cy - 7);
        ctx.restore();
      });
    }

    // 8. Draw Safety Car if active
    const driverList = Object.values(drivers);
    if (safetyCarActive && driverList.length > 0) {
      const leader = driverList.find(d => d.position === 1) || driverList[0];
      const scProgress = ((leader.trackProgress || 0) + 0.035) % 1;
      const scPos = getSplinePoint(circuitPath, scProgress);
      const scX = toCanvasX(scPos.x);
      const scY = toCanvasY(scPos.y);

      ctx.save();
      // Flashing Amber Beacon Halo
      const strobeTime = Date.now() / 150;
      const isAmberStrobe = Math.floor(strobeTime) % 2 === 0;

      ctx.beginPath();
      ctx.arc(scX, scY, 18, 0, Math.PI * 2);
      ctx.fillStyle = isAmberStrobe ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.1)';
      ctx.fill();

      // Aston Martin Racing Green Safety Car Body
      ctx.beginPath();
      ctx.arc(scX, scY, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#00594C';
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.strokeStyle = isAmberStrobe ? '#F59E0B' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // SC Label
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SC', scX, scY);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.beginPath();
      ctx.roundRect(scX - 30, scY - 22, 60, 12, 3);
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('SAFETY CAR', scX, scY - 16);
      ctx.restore();
    }

    // 9. Draw Particle Speed Trails & Driver Dots
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

      const teamColor = driver.team_colour ? `#${driver.team_colour}` : getTeamColor(driver.team);
      const isSelected = String(selectedDriverId) === driverId;
      const radius = isSelected ? 12 : 9;

      // Maintain 60 FPS Particle Trail Buffer
      if (!driverTrailsRef.current[driverId]) {
        driverTrailsRef.current[driverId] = [];
      }
      const trail = driverTrailsRef.current[driverId];
      trail.push({ x: cx, y: cy });
      if (trail.length > 7) trail.shift();

      // Render Speed Particle Streak
      if (showTrails && trail.length > 1) {
        ctx.save();
        ctx.beginPath();
        trail.forEach((tPt, tIdx) => {
          if (tIdx === 0) ctx.moveTo(tPt.x, tPt.y);
          else ctx.lineTo(tPt.x, tPt.y);
        });
        ctx.strokeStyle = teamColor;
        ctx.lineWidth = isSelected ? 4 : 2.5;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.45;
        ctx.shadowColor = teamColor;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // Check if driver is inside a DRS zone
      let inDrsZone = false;
      if (circuit?.drsZonesList) {
        const p = driver.trackProgress || 0;
        inDrsZone = circuit.drsZonesList.some(z => {
          if (z.startPct <= z.endPct) return p >= z.startPct && p <= z.endPct;
          return p >= z.startPct || p <= z.endPct;
        });
      }

      // DRS Active Wing Pulsing Halo
      if (inDrsZone) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#00FF66';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00FF66';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

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
  }, [circuitPath, circuit, drivers, selectedDriverId, showCorners, showDrs, showSectors, showKerbs, showTrails, safetyCarActive]);

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
        if (dist < 16) {
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
    <div className="relative bg-white dark:bg-[#111622] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col font-sans transition-colors">
      {/* Safety Car Banner Overlay if Active */}
      {safetyCarActive && (
        <div className="p-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black font-mono font-black text-xs text-center uppercase tracking-widest flex items-center justify-center gap-3 animate-pulse border-b border-amber-400">
          <span>🚨 SAFETY CAR DEPLOYED</span>
          <span>•</span>
          <span>DELTA PACE ACTIVE</span>
          <span>•</span>
          <span>NO OVERTAKING</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-3.5 px-5 bg-gray-50 dark:bg-[#0B0E14] border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🗺️</span>
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-white">
              {circuitName}
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">
              {circuit?.corners || 18} Turns | {circuit?.lengthKm || 5.891} km | {circuit?.drsZones || 2} DRS Zones
            </p>
          </div>
        </div>

        {/* Interactive Layer Toggles */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <button
            onClick={() => setShowTrails(prev => !prev)}
            className={`px-2.5 py-1 rounded-md border font-bold transition-all ${
              showTrails
                ? 'bg-amber-600/15 border-amber-500 text-amber-500 dark:text-amber-400'
                : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 opacity-60'
            }`}
            title="Toggle Speed Particle Trails"
          >
            ✨ Trails
          </button>

          <button
            onClick={() => setShowCorners(prev => !prev)}
            className={`px-2.5 py-1 rounded-md border font-bold transition-all ${
              showCorners
                ? 'bg-blue-600/15 border-blue-500 text-blue-500 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 opacity-60'
            }`}
            title="Toggle Turn / Corner Names"
          >
            🚩 Turns
          </button>

          <button
            onClick={() => setShowDrs(prev => !prev)}
            className={`px-2.5 py-1 rounded-md border font-bold transition-all ${
              showDrs
                ? 'bg-green-600/15 border-green-500 text-green-500 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 opacity-60'
            }`}
            title="Toggle DRS Zones"
          >
            🟢 DRS
          </button>

          <button
            onClick={() => setShowSectors(prev => !prev)}
            className={`px-2.5 py-1 rounded-md border font-bold transition-all ${
              showSectors
                ? 'bg-purple-600/15 border-purple-500 text-purple-500 dark:text-purple-400'
                : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 opacity-60'
            }`}
            title="Toggle S1, S2, S3 Sector Splits"
          >
            ⏱️ Sectors
          </button>

          <button
            onClick={() => setShowKerbs(prev => !prev)}
            className={`px-2.5 py-1 rounded-md border font-bold transition-all ${
              showKerbs
                ? 'bg-red-600/15 border-red-500 text-red-500 dark:text-red-400'
                : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 opacity-60'
            }`}
            title="Toggle Apex Kerbs"
          >
            🏁 Kerbs
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-[#080B10] flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredDriver(null)}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Hovered Driver Tooltip Card */}
        {hoveredDriver && (
          <div
            className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full -mt-3 animate-fadeIn"
            style={{ left: mousePos.x, top: mousePos.y }}
          >
            <div className="p-3 bg-gray-900/95 text-white rounded-xl shadow-2xl border border-gray-700 backdrop-blur-md font-mono text-xs w-48 space-y-1.5">
              <div className="flex items-center justify-between border-b border-gray-800 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: hoveredDriver.team_colour ? `#${hoveredDriver.team_colour}` : getTeamColor(hoveredDriver.team) }}
                  />
                  <span className="font-black text-sm">#{hoveredDriver.number}</span>
                </div>
                <span className="font-bold text-amber-400">P{hoveredDriver.position || '—'}</span>
              </div>
              <p className="font-bold text-gray-200 truncate">{hoveredDriver.driverName || hoveredDriver.full_name}</p>
              <p className="text-[10px] text-gray-400">{hoveredDriver.team}</p>
              <div className="flex justify-between items-center text-[10px] pt-1 border-t border-gray-800">
                <span className="text-gray-400">Tyre:</span>
                {(() => {
                  const style = getTyreStyle(hoveredDriver.tyres);
                  return style ? (
                    <span className="px-1.5 py-0.5 rounded font-black text-[9px]" style={{ backgroundColor: style.bg, color: style.text }}>
                      {style.label} {hoveredDriver.tyres}
                    </span>
                  ) : <span>{hoveredDriver.tyres || '—'}</span>;
                })()}
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-400">Best Lap:</span>
                <span className="font-bold text-[#BF5AF2]">{formatTime(hoveredDriver.bestLapTime)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sector Legend Footer */}
      <div className="p-2.5 px-5 bg-gray-50 dark:bg-[#0B0E14] border-t border-gray-200 dark:border-gray-800 flex flex-wrap justify-between items-center text-[11px] font-mono text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D2BE] shadow-[0_0_6px_#00D2BE]" />
            <span>Sector 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] shadow-[0_0_6px_#FFB800]" />
            <span>Sector 2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#BF5AF2] shadow-[0_0_6px_#BF5AF2]" />
            <span>Sector 3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
            <span>DRS Zone</span>
          </div>
        </div>
        <span className="text-gray-400 text-[10px]">Click any driver dot to inspect telemetry</span>
      </div>
    </div>
  );
}
