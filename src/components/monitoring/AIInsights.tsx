import React from 'react';
import { SensorData } from '@/constants/monitoring';
import { AIPredictionService } from '@/services/AIPredictionService';

interface AIInsightsProps {
  sensors: SensorData[];
  currentTime: Date;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ sensors, currentTime }) => {
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'border-l-red-500 bg-white';
      case 'warning': return 'border-l-yellow-500 bg-white';
      case 'success': return 'border-l-green-500 bg-white';
      case 'info': return 'border-l-gray-400 bg-white';
      default: return 'border-l-gray-400 bg-white';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-black text-white rounded-lg p-6">
        <h2 className="text-xl font-bold">AI-Powered Insights & Predictions</h2>
        <p className="text-gray-400 text-sm mt-1">Real-time analysis with actionable recommendations</p>
      </div>

      {sensors.map(sensor => {
        const insights = AIPredictionService.generateInsights(sensor, currentTime);
        
        return (
          <div key={sensor.id} className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">{sensor.location}</h3>
            
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-lg border border-gray-100 border-l-4 ${getSeverityColor(insight.severity)}`}
                >
                  <p className="text-gray-900 text-sm">{insight.message}</p>
                  <p className="text-gray-600 text-sm mt-2">Recommendation: {insight.recommendation}</p>
                  {insight.prediction !== null && (
                    <p className="text-gray-500 text-sm mt-2">
                      Predicted next hour: {
                        insight.type === 'temperature' ? `${insight.prediction.toFixed(1)}°C` :
                        insight.type === 'noise' ? `${insight.prediction.toFixed(0)} dB` :
                        `${insight.prediction.toFixed(0)} ppm`
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
