import { Thermometer, Wind, Volume2 } from "lucide-react";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { TrendChart } from "@/components/TrendChart";
import { AlertsPanel } from "@/components/AlertsPanel";
import { SystemOverview } from "@/components/SystemOverview";
import { SystemControlPanel } from "@/components/SystemControlPanel";
import { AIPredictionsPanel } from "@/components/AIPredictionsPanel";
import { WeeklyReportPanel } from "@/components/WeeklyReportPanel";
import { NotificationLog } from "@/components/NotificationLog";
import { useEnvironmentData } from "@/hooks/useEnvironmentData";
import { useAIPredictions } from "@/hooks/useAIPredictions";
import { useWeeklyReport } from "@/hooks/useWeeklyReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const {
    currentData,
    historicalData,
    alerts,
    getTemperatureStatus,
    getAirQualityStatus,
    getNoiseStatus,
    controlSystems,
    alertNotifications,
  } = useEnvironmentData();

  const aiPredictions = useAIPredictions(currentData);
  const weeklyReport = useWeeklyReport();

  const tempStatus = getTemperatureStatus(currentData.temperature);
  const airStatus = getAirQualityStatus(currentData.airQuality);
  const noiseStatus = getNoiseStatus(currentData.noiseLevel);

  // Count active warnings
  const activeWarnings = alerts.filter(a => a.type === "warning" || a.type === "critical").length;

  return (
    <div className="min-h-screen bg-background">
      <Header alertCount={activeWarnings} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Environmental Monitoring Dashboard
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Real-time monitoring of temperature, air quality, and noise levels at the 
            UoN Chiromo Campus - C4DLab & Central Examination Centre
          </p>
        </div>

        {/* System Overview */}
        <div className="mb-6">
          <SystemOverview />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard
            type="temperature"
            title="Temperature"
            value={currentData.temperature.toFixed(1)}
            unit="°C"
            status={tempStatus.status}
            statusLabel={tempStatus.label}
            icon={<Thermometer className="w-6 h-6" />}
            threshold={{ min: 16, max: 28, current: currentData.temperature }}
          />
          
          <MetricCard
            type="air"
            title="Air Quality Index"
            value={Math.round(currentData.airQuality).toString()}
            unit="AQI"
            status={airStatus.status}
            statusLabel={airStatus.label}
            icon={<Wind className="w-6 h-6" />}
            threshold={{ min: 0, max: 150, current: currentData.airQuality }}
          />
          
          <MetricCard
            type="noise"
            title="Noise Level"
            value={Math.round(currentData.noiseLevel).toString()}
            unit="dB"
            status={noiseStatus.status}
            statusLabel={noiseStatus.label}
            icon={<Volume2 className="w-6 h-6" />}
            threshold={{ min: 20, max: 70, current: currentData.noiseLevel }}
          />
        </div>

        {/* Tabbed Interface for Features */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="controls">System Controls</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrendChart data={historicalData} />
              </div>
              <div className="space-y-6">
                <AlertsPanel alerts={alerts} />
                {alertNotifications.notifications.length > 0 && (
                  <NotificationLog 
                    notifications={alertNotifications.notifications} 
                    isSending={alertNotifications.isSending} 
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="controls">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemControlPanel
                systems={controlSystems.systems}
                onToggle={controlSystems.toggleSystem}
                onModeChange={controlSystems.setSystemMode}
              />
              <div className="space-y-6">
                <AlertsPanel alerts={alerts} />
                <div className="metric-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Actions</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {controlSystems.actionLog.slice(0, 10).map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 rounded bg-secondary/30">
                        <span>
                          <span className="font-medium">{action.system.toUpperCase()}</span>
                          <span className={action.action === "on" ? "text-status-good" : "text-muted-foreground"}>
                            {" "}turned {action.action}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {action.automatic ? "Auto" : "Manual"}
                        </span>
                      </div>
                    ))}
                    {controlSystems.actionLog.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No actions recorded yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIPredictionsPanel
                predictions={aiPredictions.predictions}
                isAnalyzing={aiPredictions.isAnalyzing}
                lastUpdated={aiPredictions.lastUpdated}
                onRefresh={aiPredictions.refreshPredictions}
              />
              <div className="space-y-6">
                <TrendChart data={historicalData} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyReportPanel
                reports={weeklyReport.reports}
                isGenerating={weeklyReport.isGenerating}
                onGenerate={weeklyReport.generateWeeklyReport}
                onSend={weeklyReport.sendReport}
              />
              <div className="space-y-6">
                {alertNotifications.notifications.length > 0 && (
                  <NotificationLog 
                    notifications={alertNotifications.notifications} 
                    isSending={alertNotifications.isSending} 
                  />
                )}
                <div className="metric-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Report Recipients</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Weekly reports are sent to the technical team:
                  </p>
                  <div className="space-y-2">
                    {weeklyReport.technicalTeam.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded bg-secondary/30">
                        <div className="w-2 h-2 bg-status-good rounded-full" />
                        {email}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            C4DLab Environmental Monitoring System • University of Nairobi • Chiromo Campus
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Prototype v1.0 • Smart Environmental Management with AI Predictions
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
