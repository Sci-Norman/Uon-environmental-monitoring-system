import React from 'react';
import { SensorData } from '@/constants/monitoring';

interface ControlsProps {
  sensors: SensorData[];
  toggleSystem: (sensorId: number, systemType: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({ sensors, toggleSystem }) => {
  return (
    <div className="space-y-4">
      {sensors.map(sensor => (
        <div key={sensor.id} className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">{sensor.location}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => toggleSystem(sensor.id, 'ventilation')}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                sensor.ventilation 
                  ? 'bg-gray-900 border-gray-900 text-white' 
                  : 'border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <p className="font-medium text-sm">Ventilation</p>
              <p className={`text-xs font-bold mt-1 ${sensor.ventilation ? 'text-white' : 'text-gray-400'}`}>
                {sensor.ventilation ? 'ON' : 'OFF'}
              </p>
              {sensor.ventilationAuto && (
                <p className="text-xs text-green-400 mt-1">AUTO</p>
              )}
            </button>
            
            <button
              onClick={() => toggleSystem(sensor.id, 'heater')}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                sensor.heater 
                  ? 'bg-gray-900 border-gray-900 text-white' 
                  : 'border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <p className="font-medium text-sm">Heater</p>
              <p className={`text-xs font-bold mt-1 ${sensor.heater ? 'text-white' : 'text-gray-400'}`}>
                {sensor.heater ? 'ON' : 'OFF'}
              </p>
              {sensor.heaterAuto && (
                <p className="text-xs text-green-400 mt-1">AUTO</p>
              )}
            </button>
            
            <button
              onClick={() => toggleSystem(sensor.id, 'airPurifier')}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                sensor.airPurifier 
                  ? 'bg-gray-900 border-gray-900 text-white' 
                  : 'border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <p className="font-medium text-sm">Air Purifier</p>
              <p className={`text-xs font-bold mt-1 ${sensor.airPurifier ? 'text-white' : 'text-gray-400'}`}>
                {sensor.airPurifier ? 'ON' : 'OFF'}
              </p>
              {sensor.airPurifierAuto && (
                <p className="text-xs text-green-400 mt-1">AUTO</p>
              )}
            </button>
            
            <button
              onClick={() => toggleSystem(sensor.id, 'fan')}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                sensor.fan 
                  ? 'bg-gray-900 border-gray-900 text-white' 
                  : 'border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <p className="font-medium text-sm">Fan</p>
              <p className={`text-xs font-bold mt-1 ${sensor.fan ? 'text-white' : 'text-gray-400'}`}>
                {sensor.fan ? 'ON' : 'OFF'}
              </p>
              {sensor.fanAuto && (
                <p className="text-xs text-green-400 mt-1">AUTO</p>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
