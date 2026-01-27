import React from 'react';
import { SensorData, AlertData, SystemLog } from '@/constants/monitoring';

interface ReportsProps {
  sensors: SensorData[];
  alerts: AlertData[];
  systemLogs: SystemLog[];
  exportReport: () => void;
}

export const Reports: React.FC<ReportsProps> = ({ sensors, alerts, systemLogs, exportReport }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Reports & Analytics</h2>
        <button 
          onClick={exportReport}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          Export Weekly Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Statistics */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{sensors.length}</p>
              <p className="text-xs text-gray-500">Active Sensors</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {sensors.filter(s => s.status === 'normal').length}
              </p>
              <p className="text-xs text-gray-500">Normal</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {sensors.filter(s => s.status === 'warning').length}
              </p>
              <p className="text-xs text-gray-500">Warnings</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {sensors.filter(s => s.status === 'critical').length}
              </p>
              <p className="text-xs text-gray-500">Critical</p>
            </div>
          </div>
        </div>

        {/* System Activity Log */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">System Activity Log (Last 10)</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {systemLogs.slice(0, 10).map(log => (
              <div key={log.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{log.action}</span>
                <span className="text-gray-500">{log.time}</span>
              </div>
            ))}
            {systemLogs.length === 0 && (
              <p className="text-gray-500 text-center py-4">No activity recorded</p>
            )}
          </div>
        </div>

        {/* Environmental Averages */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Environmental Averages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Average Temperature:</span>
              <span className="font-bold text-gray-900">
                {(sensors.reduce((a, s) => a + s.temp, 0) / sensors.length).toFixed(1)}°C
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Average Air Quality:</span>
              <span className="font-bold text-gray-900">
                {Math.round(sensors.reduce((a, s) => a + s.airQuality, 0) / sensors.length)} ppm
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Average Noise Level:</span>
              <span className="font-bold text-gray-900">
                {Math.round(sensors.reduce((a, s) => a + s.noise, 0) / sensors.length)} dB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
