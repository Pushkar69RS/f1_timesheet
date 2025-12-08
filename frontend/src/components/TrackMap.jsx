import React, { useRef, useEffect, useState } from 'react';
import { getTeamColor } from '../utils/teamColors';

const TrackMap = ({ drivers }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [bounds, setBounds] = useState({ minX: 0, maxX: 1000, minY: 0, maxY: 1000, initialized: false });

  useEffect(() => {
    const driversWithLocation = Object.values(drivers || {}).filter(d =>
      d && typeof d.x === 'number' && typeof d.y === 'number' && !isNaN(d.x) && !isNaN(d.y)
    );

    if (driversWithLocation.length > 0 && !bounds.initialized) {
      const xValues = driversWithLocation.map(d => d.x);
      const yValues = driversWithLocation.map(d => d.y);

      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);

      const padding = Math.max((maxX - minX) * 0.1, (maxY - minY) * 0.1, 100);
      setBounds({
        minX: minX - padding,
        maxX: maxX + padding,
        minY: minY - padding,
        maxY: maxY + padding,
        initialized: true,
      });
    }
  }, [drivers, bounds.initialized]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    const rangeX = bounds.maxX - bounds.minX || 1000;
    const rangeY = bounds.maxY - bounds.minY || 1000;

    const driversWithLocation = Object.values(drivers || {}).filter(d =>
      d && typeof d.x === 'number' && typeof d.y === 'number' && !isNaN(d.x) && !isNaN(d.y)
    );

    const toPixel = (x, y) => {
      return {
        x: ((x - bounds.minX) / rangeX) * (width - 40) + 20,
        y: ((y - bounds.minY) / rangeY) * (height - 40) + 20,
      };
    };

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#E10600';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('LIVE TRACK MAP', 15, 15);

    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(`${driversWithLocation.length} drivers tracked`, 15, 40);

    if (driversWithLocation.length > 0) {
      driversWithLocation.forEach(driver => {
        const pos = toPixel(driver.x, driver.y);
        const teamColor = getTeamColor(driver.team);

        ctx.shadowColor = teamColor;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14, 0, 2 * Math.PI);
        ctx.fillStyle = teamColor;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowBlur = 0;

        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(driver.number || '?', pos.x, pos.y);
      });
    } else {
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Waiting for position data...', width / 2, height / 2);
    }

  }, [drivers, bounds]);

  return (
    <div ref={containerRef} className="bg-secondary dark:bg-secondary-dark p-6 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-app-text dark:text-app-text-dark">Track Map</h3>
        <div className="text-sm text-muted-text dark:text-muted-text-dark">
          Real-time positions
        </div>
      </div>
      <div className="flex justify-center" style={{ minHeight: '400px' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="rounded-lg shadow-inner"
          style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block' }}
        />
      </div>
      <div className="mt-4 text-xs text-muted-text dark:text-muted-text-dark text-center">
        Driver positions update in real-time • Color-coded by team
      </div>
    </div>
  );
};

export default TrackMap;
