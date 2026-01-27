import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export interface WeeklyReportData {
  id: string;
  generatedAt: Date;
  weekStarting: Date;
  weekEnding: Date;
  summary: {
    avgTemperature: number;
    avgAirQuality: number;
    avgNoiseLevel: number;
    alertsTriggered: number;
    systemActivations: number;
    uptime: number;
  };
  insights: string[];
  recommendations: string[];
  status: "generated" | "sent" | "pending";
  sentTo: string[];
}

const TECHNICAL_TEAM = [
  "tech.team@uonbi.ac.ke",
  "c4dlab.admin@uonbi.ac.ke",
  "facility.management@uonbi.ac.ke",
];

export function useWeeklyReport() {
  const [reports, setReports] = useState<WeeklyReportData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWeeklyReport = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    const report: WeeklyReportData = {
      id: `report-${Date.now()}`,
      generatedAt: now,
      weekStarting: weekStart,
      weekEnding: now,
      summary: {
        avgTemperature: 22.5 + Math.random() * 2,
        avgAirQuality: 42 + Math.random() * 10,
        avgNoiseLevel: 38 + Math.random() * 8,
        alertsTriggered: Math.floor(Math.random() * 15) + 5,
        systemActivations: Math.floor(Math.random() * 50) + 20,
        uptime: 99.5 + Math.random() * 0.5,
      },
      insights: [
        "Temperature fluctuations were minimal during examination periods",
        "Air quality improved by 12% compared to previous week due to proactive purifier activation",
        "Noise levels peaked during lunch hours on Tuesday and Thursday",
        "HVAC system efficiency increased with predictive activation",
      ],
      recommendations: [
        "Consider increasing ventilation during afternoon sessions (14:00-16:00)",
        "Schedule preventive maintenance for air purifiers in Gandhi Wing",
        "Review noise insulation between C4DLab and examination halls",
        "Optimize heater schedules for early morning sessions",
      ],
      status: "generated",
      sentTo: [],
    };
    
    setReports(prev => [report, ...prev]);
    setIsGenerating(false);
    
    return report;
  }, []);

  const sendReport = useCallback(async (reportId: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        return { ...report, status: "sent" as const, sentTo: TECHNICAL_TEAM };
      }
      return report;
    }));

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Weekly Report Sent",
      description: `Report sent to ${TECHNICAL_TEAM.length} recipients`,
    });
  }, []);

  return {
    reports,
    isGenerating,
    generateWeeklyReport,
    sendReport,
    technicalTeam: TECHNICAL_TEAM,
  };
}
