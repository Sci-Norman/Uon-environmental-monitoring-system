import { useState, useEffect, useCallback } from "react";

export interface Prediction {
  id: string;
  type: "temperature" | "airQuality" | "noise";
  currentValue: number;
  predictedValue: number;
  predictedTime: string;
  trend: "rising" | "falling" | "stable";
  confidence: number;
  recommendation: string;
  suggestedAction: string;
  suggestedTime: string;
}

// Simulated AI prediction engine
function generatePredictions(currentData: { temperature: number; airQuality: number; noiseLevel: number }): Prediction[] {
  const now = new Date();
  const hour = now.getHours();
  
  // Simulate time-based patterns
  const isMorning = hour >= 6 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 17;
  const isEvening = hour >= 17 && hour < 22;
  
  const predictions: Prediction[] = [];
  
  // Temperature prediction
  const tempTrend = isMorning ? "rising" : isEvening ? "falling" : "stable";
  const tempChange = isMorning ? 2 : isEvening ? -2 : Math.random() * 2 - 1;
  predictions.push({
    id: "temp-pred",
    type: "temperature",
    currentValue: currentData.temperature,
    predictedValue: Math.round((currentData.temperature + tempChange) * 10) / 10,
    predictedTime: `${(hour + 2) % 24}:00`,
    trend: tempTrend,
    confidence: 85 + Math.random() * 10,
    recommendation: tempTrend === "rising" && currentData.temperature > 22
      ? "Pre-activate HVAC cooling system before temperature exceeds comfort levels"
      : tempTrend === "falling" && currentData.temperature < 20
      ? "Schedule heater activation to maintain optimal temperature"
      : "Current temperature trend is within acceptable parameters",
    suggestedAction: tempTrend === "rising" && currentData.temperature > 22
      ? "Turn on HVAC"
      : tempTrend === "falling" && currentData.temperature < 20
      ? "Turn on Heater"
      : "No action needed",
    suggestedTime: `${(hour + 1) % 24}:00`,
  });
  
  // Air quality prediction
  const aqTrend = isAfternoon ? "rising" : "stable";
  const aqChange = isAfternoon ? 10 : Math.random() * 5;
  predictions.push({
    id: "aq-pred",
    type: "airQuality",
    currentValue: currentData.airQuality,
    predictedValue: Math.round(currentData.airQuality + aqChange),
    predictedTime: `${(hour + 2) % 24}:00`,
    trend: aqTrend,
    confidence: 80 + Math.random() * 15,
    recommendation: aqChange > 5
      ? "Air quality may degrade during peak hours. Consider activating air purifiers proactively"
      : "Air quality expected to remain within safe limits",
    suggestedAction: aqChange > 5 ? "Turn on Air Purifier" : "No action needed",
    suggestedTime: `${(hour + 1) % 24}:30`,
  });
  
  // Noise prediction (based on typical exam schedules)
  const isExamTime = (hour >= 8 && hour <= 11) || (hour >= 14 && hour <= 17);
  const noiseTrend = isExamTime ? "stable" : hour === 12 || hour === 13 ? "rising" : "falling";
  predictions.push({
    id: "noise-pred",
    type: "noise",
    currentValue: currentData.noiseLevel,
    predictedValue: Math.round(currentData.noiseLevel + (noiseTrend === "rising" ? 15 : noiseTrend === "falling" ? -10 : 0)),
    predictedTime: `${(hour + 1) % 24}:00`,
    trend: noiseTrend,
    confidence: 75 + Math.random() * 20,
    recommendation: noiseTrend === "rising"
      ? "Noise levels may increase during lunch break. Consider issuing quiet reminder to C4DLab innovators"
      : isExamTime
      ? "Maintain current noise monitoring during examination period"
      : "Lower activity period expected",
    suggestedAction: noiseTrend === "rising" ? "Send quiet reminder to C4DLab" : "Continue monitoring",
    suggestedTime: `${hour}:45`,
  });
  
  return predictions;
}

export function useAIPredictions(currentData: { temperature: number; airQuality: number; noiseLevel: number }) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshPredictions = useCallback(() => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setPredictions(generatePredictions(currentData));
      setLastUpdated(new Date());
      setIsAnalyzing(false);
    }, 1500);
  }, [currentData]);

  useEffect(() => {
    refreshPredictions();
    
    // Refresh predictions every 5 minutes
    const interval = setInterval(refreshPredictions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshPredictions]);

  return {
    predictions,
    isAnalyzing,
    lastUpdated,
    refreshPredictions,
  };
}
