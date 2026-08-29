import { useState } from 'react';
import { getTeamColor } from '../utils/teamColors';

const DriverAvatar = ({ driver, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  const driverCode = driver?.code || String(driver?.number || driver?.driverId || 'XX');
  const driverName = driver?.driverName || driver?.full_name || 'Unknown';
  const teamColor = driver?.team_colour ? `#${driver.team_colour}` : getTeamColor(driver?.team);
  const headshotUrl = driver?.headshot_url;

  if (headshotUrl && !imageError) {
    return (
      <img
        src={headshotUrl}
        alt={driverName}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 transition-all duration-300 hover:scale-105 shadow-md bg-gray-800`}
        style={{ borderColor: teamColor }}
        onError={() => setImageError(true)}
        title={driverName}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 hover:scale-105 shadow-md border-2 border-white/20`}
      style={{ backgroundColor: teamColor }}
      title={driverName}
    >
      {driverCode.substring(0, 3).toUpperCase()}
    </div>
  );
};

export default DriverAvatar;
