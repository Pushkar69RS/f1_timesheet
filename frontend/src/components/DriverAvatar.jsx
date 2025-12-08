import React, { useState } from 'react';
import { getTeamColor } from '../utils/teamColors';

const DriverAvatar = ({ driver, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const driverCode = driver?.code || driver?.number || driver?.driverId || 'XX';
  const driverName = driver?.driverName || 'Unknown';
  const teamColor = getTeamColor(driver?.team);

  const imagePath = `/assets/drivers/${driverCode}.jpg`;

  if (!imageError) {
    return (
      <img
        src={imagePath}
        alt={driverName}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 transition-all duration-300 hover:scale-110`}
        style={{ borderColor: teamColor }}
        onError={() => setImageError(true)}
        title={driverName}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 hover:scale-110`}
      style={{ backgroundColor: teamColor }}
      title={driverName}
    >
      {driverCode.substring(0, 2).toUpperCase()}
    </div>
  );
};

export default DriverAvatar;
