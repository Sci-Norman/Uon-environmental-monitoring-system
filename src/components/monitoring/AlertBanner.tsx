import React from 'react';
import { SensorData } from '@/constants/monitoring';

interface AlertBannerProps {
  activeAlerts: SensorData[];
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ activeAlerts }) => {
  if (activeAlerts.length === 0) return null;
  
  return (
    <div className="bg-gray-600 text-white px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <span className="font-bold">
          {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}
        </span>
        <span className="text-red-100">
          {activeAlerts.map(a => a.location).join(' • ')}
        </span>
      </div>
    </div>
  );
};
