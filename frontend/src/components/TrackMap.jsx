import React, { useRef, useEffect, useState } from 'react';
import { getTeamColor } from '../utils/teamColors';

const TrackMap = ({ drivers }) => {
  const canvasRef = useRef(null);
  const [bounds, setBounds] = useState({ minX: 0, maxX: 1000, minY: 0, maxY: 1000 });

  useEffect(() => {
    const driversWithLocation = Object.values(drivers).filter(d => d.x !== null && d.y !== null);

    if (driversWithLocation.length > 0) {
      const xValues = driversWithLocation.map(d => d.x);
      const yValues = driversWithLocation.map(d => d.y);

      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);

      const padding = 100;
      setBounds({
        minX: minX - padding,
        maxX: maxX + padding,
        minY: minY - padding,
        maxY: maxY + padding,
      });
    }
  }, [drivers]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    const rangeX = bounds.maxX - bounds.minX;
    const rangeY = bounds.maxY - bounds.minY;

    const driversWithLocation = Object.values(drivers).filter(d => d.x !== null && d.y !== null);

    if (driversWithLocation.length > 0) {
      const allX = driversWithLocation.map(d => d.x);
      const allY = driversWithLocation.map(d => d.y);

      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      for (let i = 0; i < allX.length - 1; i++) {
        const x1 = ((allX[i] - bounds.minX) / rangeX) * width;
        const y1 = ((allY[i] - bounds.minY) / rangeY) * height;
        const x2 = ((allX[i + 1] - bounds.minX) / rangeX) * width;
        const y2 = ((allY[i + 1] - bounds.minY) / rangeY) * height;

        if (i === 0) {
          ctx.moveTo(x1, y1);
        }
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    driversWithLocation.forEach(driver => {
      const x = ((driver.x - bounds.minX) / rangeX) * width;
      const y = ((driver.y - bounds.minY) / rangeY) * height;

      const teamColor = getTeamColor(driver.team);

      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = teamColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 10px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(driver.number, x, y);
    });

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#999';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Live Track Positions', 10, 10);

  }, [drivers, bounds]);

  return (
    <div className="bg-secondary dark:bg-secondary-dark p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-app-text dark:text-app-text-dark mb-4">Track Map</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="bg-gray-900 rounded-lg"
        />
      </div>
      <div className="mt-4 text-xs text-muted-text dark:text-muted-text-dark text-center">
        Driver positions update in real-time during replay
      </div>
    </div>
  );
};

export default TrackMap;
