import React from 'react';
import { SensorData } from '@/constants/monitoring';

interface DashboardProps {
  sensors: SensorData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ sensors }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return 'border-l-green-500 bg-white';
      case 'warning': return 'border-l-yellow-500 bg-white';
      case 'critical': return 'border-l-red-500 bg-white';
      default: return 'border-l-gray-400 bg-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Avg Temperature</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {(sensors.reduce((a, s) => a + s.temp, 0) / sensors.length).toFixed(1)}°C
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Avg Air Quality</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {Math.round(sensors.reduce((a, s) => a + s.airQuality, 0) / sensors.length)}
            <span className="text-lg ml-1 font-normal text-gray-500">ppm</span>
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Avg Noise</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {Math.round(sensors.reduce((a, s) => a + s.noise, 0) / sensors.length)}
            <span className="text-lg ml-1 font-normal text-gray-500">dB</span>
          </p>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map(sensor => (
          <div 
            key={sensor.id} 
            className={`rounded-lg p-4 border border-gray-200 border-l-4 ${getStatusColor(sensor.status)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">{sensor.location}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(sensor.status)}`}>
                {sensor.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <p className="font-bold text-gray-900">{sensor.temp.toFixed(1)}°C</p>
                <p className="text-xs text-gray-500">Temp</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{sensor.airQuality.toFixed(0)}</p>
                <p className="text-xs text-gray-500">Air (ppm)</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{sensor.noise.toFixed(0)}</p>
                <p className="text-xs text-gray-500">Noise (dB)</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 text-xs">
              {sensor.ventilation && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Vent</span>
              )}
              {sensor.heater && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Heat</span>
              )}
              {sensor.airPurifier && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Purify</span>
              )}
              {sensor.fan && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Fan</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
