import React from 'react';

interface MonitoringHeaderProps {
  currentTime: Date;
}

export const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({ currentTime }) => {
  return (
    <header className="bg-gray-200 text-gray-900">
      <div className="px-4 py-6">
        <div className="flex flex-col gap-2">
          {/* Main Row: Logo and Title on Left, Time on Right */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/uon-logo.png" alt="UoN Logo" className="h-14" />
              <h1 className="text-4xl font-bold text-gray-800 tracking-wide" style={{ fontStyle: 'italic', letterSpacing: '0.05em' }}>
                ENVIROSENSE
              </h1>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-gray-900">{currentTime.toLocaleTimeString()}</p>
              <p className="text-xs text-gray-600">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {/* University Info - Small */}
          <div className="text-center opacity-70 text-xs text-gray-600 pt-2 border-t border-gray-300 w-full">
            <p>University of Nairobi •  Environmental Monitoring</p>
          </div>
        </div>
      </div>
    </header>
  );
};
