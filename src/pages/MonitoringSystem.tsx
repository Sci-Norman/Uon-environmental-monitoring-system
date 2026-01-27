import React, { useState } from 'react';
import { MonitoringHeader } from '@/components/monitoring/MonitoringHeader';
import { AlertBanner } from '@/components/monitoring/AlertBanner';
import { Navigation } from '@/components/monitoring/Navigation';
import { Dashboard } from '@/components/monitoring/Dashboard';
import { Controls } from '@/components/monitoring/Controls';
import { AIInsights } from '@/components/monitoring/AIInsights';
import { AlertsList } from '@/components/monitoring/AlertsList';
import { Reports } from '@/components/monitoring/Reports';
import { useMonitoringSystem } from '@/hooks/useMonitoringSystem';

const MonitoringSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    currentTime,
    sensors,
    alerts,
    systemLogs,
    activeAlerts,
    toggleSystem,
    exportReport
  } = useMonitoringSystem();

  return (
    <div className="min-h-screen bg-gray-50">
      <MonitoringHeader currentTime={currentTime} />
      <AlertBanner activeAlerts={activeAlerts} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard sensors={sensors} />}
        {activeTab === 'controls' && <Controls sensors={sensors} toggleSystem={toggleSystem} />}
        {activeTab === 'ai-insights' && <AIInsights sensors={sensors} currentTime={currentTime} />}
        {activeTab === 'alerts' && <AlertsList alerts={alerts} />}
        {activeTab === 'reports' && (
          <Reports 
            sensors={sensors} 
            alerts={alerts} 
            systemLogs={systemLogs} 
            exportReport={exportReport} 
          />
        )}
      </main>
    </div>
  );
};

export default MonitoringSystem;
