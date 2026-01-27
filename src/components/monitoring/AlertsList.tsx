import React from 'react';
import { AlertData } from '@/constants/monitoring';

interface AlertsListProps {
  alerts: AlertData[];
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'critical': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert History</h2>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No alerts recorded</p>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-3 rounded-lg border border-gray-100 border-l-4 bg-white ${getSeverityStyles(alert.severity)}`}
            >
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap">{alert.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
