import { useState, useEffect, useCallback } from "react";
import { useControlSystems, SystemType } from "./useControlSystems";
import { useAlertNotifications } from "./useAlertNotifications";
import { toast } from "@/hooks/use-toast";

interface EnvironmentData {
  temperature: number;
  airQuality: number;
  noiseLevel: number;
}

interface HistoricalData {
  time: string;
  temperature: number;
  airQuality: number;
  noise: number;
}

interface Alert {
  id: string;
  type: "warning" | "critical" | "resolved";
  message: string;
  location: string;
  time: string;
}

// Chiromo Campus / C4DLab actual locations
export const LOCATIONS = {
  ldtHall: "LDT (Lecture, Discussion & Tutorial) Hall",
  gandhiWing: "Gandhi Wing - Examination Room",
  jkmlBuilding: "JKML Building",
  scienceComplex: "Science Complex Annex",
  c4dlabSpace: "C4DLab Innovation Space",
  corridorA: "Corridor A - Main Passage",
  corridorB: "Corridor B - East Wing",
  serverRoom: "C4DLab Server Room",
};

// Thresholds for automatic actions
const THRESHOLDS = {
  temperature: { low: 18, optimal: { min: 20, max: 24 }, high: 26 },
  airQuality: { good: 50, moderate: 100, poor: 150 },
  noise: { quiet: 40, moderate: 55, loud: 65 },
};

// Simulate real-time data updates
function generateData(): EnvironmentData {
  return {
    temperature: 22 + Math.random() * 6 - 3, // 19-25°C range
    airQuality: 35 + Math.random() * 30, // 35-65 AQI range
    noiseLevel: 30 + Math.random() * 25, // 30-55 dB range
  };
}

function generateHistoricalData(): HistoricalData[] {
  const data: HistoricalData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours().toString().padStart(2, '0') + ':00',
      temperature: 20 + Math.random() * 8,
      airQuality: 30 + Math.random() * 40,
      noise: 25 + Math.random() * 35,
    });
  }
  
  return data;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    message: "Noise level approaching threshold in Gandhi Wing",
    location: LOCATIONS.gandhiWing,
    time: "5 min ago",
  },
  {
    id: "2",
    type: "resolved",
    message: "Temperature stabilized after HVAC adjustment",
    location: LOCATIONS.ldtHall,
    time: "23 min ago",
  },
  {
    id: "3",
    type: "warning",
    message: "Air quality sensor calibration recommended",
    location: LOCATIONS.corridorA,
    time: "1 hr ago",
  },
  {
    id: "4",
    type: "resolved",
    message: "Sensor connectivity restored",
    location: LOCATIONS.serverRoom,
    time: "2 hrs ago",
  },
];

export function useEnvironmentData() {
  const [currentData, setCurrentData] = useState<EnvironmentData>(generateData());
  const [historicalData] = useState<HistoricalData[]>(generateHistoricalData());
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  
  const controlSystems = useControlSystems();
  const alertNotifications = useAlertNotifications();

  // Automatic control logic based on environmental conditions
  const processAutomaticControls = useCallback((data: EnvironmentData) => {
    const { temperature, airQuality, noiseLevel } = data;
    const { setSystemState } = controlSystems;

    // Temperature control logic
    if (temperature > THRESHOLDS.temperature.high) {
      // High temperature - turn on HVAC, turn off heater
      setSystemState("hvac", true, `High temperature detected (${temperature.toFixed(1)}°C). Cooling initiated.`);
      setSystemState("heater", false, "Heater deactivated due to high temperature");
      setSystemState("ventilation", true, "Ventilation activated for additional cooling");
      
      // Send notification for critical temperature
      alertNotifications.sendNotification(
        `High temperature detected: ${temperature.toFixed(1)}°C exceeds threshold of ${THRESHOLDS.temperature.high}°C`,
        "Continue monitoring. If temperature persists, consider manual inspection of HVAC system.",
        "HVAC cooling system and ventilation automatically activated",
        LOCATIONS.ldtHall,
        "critical"
      );

      // Add alert
      setAlerts(prev => [{
        id: `temp-${Date.now()}`,
        type: "critical",
        message: `High temperature (${temperature.toFixed(1)}°C) - HVAC activated`,
        location: LOCATIONS.ldtHall,
        time: "Just now",
      }, ...prev.slice(0, 9)]);
    } else if (temperature < THRESHOLDS.temperature.low) {
      // Low temperature - turn on heater, turn off HVAC
      setSystemState("heater", true, `Low temperature detected (${temperature.toFixed(1)}°C). Heating initiated.`);
      setSystemState("hvac", false, "HVAC cooling deactivated due to low temperature");
      
      // Send notification
      alertNotifications.sendNotification(
        `Low temperature detected: ${temperature.toFixed(1)}°C below threshold of ${THRESHOLDS.temperature.low}°C`,
        "Ensure windows and doors are closed. Monitor heating effectiveness.",
        "Heating system automatically activated",
        LOCATIONS.ldtHall,
        "warning"
      );

      setAlerts(prev => [{
        id: `temp-${Date.now()}`,
        type: "warning",
        message: `Low temperature (${temperature.toFixed(1)}°C) - Heater activated`,
        location: LOCATIONS.ldtHall,
        time: "Just now",
      }, ...prev.slice(0, 9)]);
    } else if (temperature >= THRESHOLDS.temperature.optimal.min && temperature <= THRESHOLDS.temperature.optimal.max) {
      // Optimal temperature - systems can be turned off
      setSystemState("hvac", false, "Optimal temperature reached");
      setSystemState("heater", false, "Optimal temperature reached");
    }

    // Air quality control logic
    if (airQuality > THRESHOLDS.airQuality.moderate) {
      // Poor air quality - activate purifiers and ventilation
      setSystemState("purifier", true, `Poor air quality detected (AQI: ${Math.round(airQuality)}). Purification initiated.`);
      setSystemState("fan", true, "Fans activated to improve air circulation");
      setSystemState("ventilation", true, "Ventilation activated for fresh air intake");
      
      alertNotifications.sendNotification(
        `Poor air quality detected: AQI ${Math.round(airQuality)} exceeds safe threshold of ${THRESHOLDS.airQuality.moderate}`,
        "Consider opening windows if outdoor air quality is better. Check HVAC filters.",
        "Air purifiers, fans, and ventilation systems automatically activated",
        LOCATIONS.jkmlBuilding,
        "warning"
      );

      setAlerts(prev => [{
        id: `aq-${Date.now()}`,
        type: "warning",
        message: `Poor air quality (AQI: ${Math.round(airQuality)}) - Purifiers activated`,
        location: LOCATIONS.jkmlBuilding,
        time: "Just now",
      }, ...prev.slice(0, 9)]);
    } else if (airQuality <= THRESHOLDS.airQuality.good) {
      // Good air quality
      setSystemState("purifier", false, "Air quality is good");
      setSystemState("fan", false, "Air circulation adequate");
    }

    // Noise level control - just send alerts (can't automatically reduce noise)
    if (noiseLevel > THRESHOLDS.noise.loud) {
      alertNotifications.sendNotification(
        `Excessive noise detected: ${Math.round(noiseLevel)}dB exceeds threshold of ${THRESHOLDS.noise.loud}dB`,
        "Please investigate source of noise. Consider issuing quiet reminder to C4DLab innovators.",
        "Alert sent to supervisors for manual intervention",
        LOCATIONS.c4dlabSpace,
        "critical"
      );

      setAlerts(prev => [{
        id: `noise-${Date.now()}`,
        type: "critical",
        message: `Excessive noise (${Math.round(noiseLevel)}dB) - Alert sent to supervisors`,
        location: LOCATIONS.c4dlabSpace,
        time: "Just now",
      }, ...prev.slice(0, 9)]);

      toast({
        title: "🔊 Noise Alert",
        description: "Noise levels exceeding threshold. Supervisors notified.",
        variant: "destructive",
      });
    }
  }, [controlSystems, alertNotifications]);

  useEffect(() => {
    // Simulate real-time updates every 3 seconds
    const interval = setInterval(() => {
      const newData = generateData();
      setCurrentData(newData);
      
      // Process automatic controls based on new data
      // Only trigger occasionally to avoid spam (1 in 5 chance)
      if (Math.random() < 0.2) {
        processAutomaticControls(newData);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [processAutomaticControls]);

  const getTemperatureStatus = (temp: number) => {
    if (temp >= THRESHOLDS.temperature.optimal.min && temp <= THRESHOLDS.temperature.optimal.max) {
      return { status: "good" as const, label: "Optimal" };
    }
    if (temp >= THRESHOLDS.temperature.low && temp <= THRESHOLDS.temperature.high) {
      return { status: "warning" as const, label: "Acceptable" };
    }
    return { status: "critical" as const, label: "Out of Range" };
  };

  const getAirQualityStatus = (aqi: number) => {
    if (aqi <= THRESHOLDS.airQuality.good) return { status: "good" as const, label: "Good" };
    if (aqi <= THRESHOLDS.airQuality.moderate) return { status: "warning" as const, label: "Moderate" };
    return { status: "critical" as const, label: "Poor" };
  };

  const getNoiseStatus = (db: number) => {
    if (db <= THRESHOLDS.noise.quiet) return { status: "good" as const, label: "Quiet" };
    if (db <= THRESHOLDS.noise.moderate) return { status: "warning" as const, label: "Moderate" };
    return { status: "critical" as const, label: "Loud" };
  };

  return {
    currentData,
    historicalData,
    alerts,
    getTemperatureStatus,
    getAirQualityStatus,
    getNoiseStatus,
    controlSystems,
    alertNotifications,
    LOCATIONS,
    THRESHOLDS,
  };
}
