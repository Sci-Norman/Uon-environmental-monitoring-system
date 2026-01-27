import { THRESHOLDS, SensorData, AIInsight } from '@/constants/monitoring';

export const AIPredictionService = {
  generateInsights: (sensor: SensorData, timeOfDay: Date): AIInsight[] => {
    const hour = timeOfDay.getHours();
    const insights: AIInsight[] = [];
    
    // Temperature insights
    if (sensor.temp > THRESHOLDS.temperature.max) {
      insights.push({
        type: 'temperature',
        severity: 'warning',
        message: `Temperature at ${sensor.location} is ${sensor.temp.toFixed(1)}°C, which is ${(sensor.temp - THRESHOLDS.temperature.max).toFixed(1)}°C above optimal range.`,
        recommendation: 'Ventilation system has been activated. Consider checking HVAC settings.',
        prediction: sensor.temp + (hour >= 10 && hour <= 15 ? 1.5 : -0.5)
      });
    } else if (sensor.temp < THRESHOLDS.temperature.min) {
      insights.push({
        type: 'temperature',
        severity: 'info',
        message: `Temperature at ${sensor.location} is ${sensor.temp.toFixed(1)}°C, below comfortable range.`,
        recommendation: 'Heating system activated to warm the space.',
        prediction: sensor.temp + 0.8
      });
    } else {
      insights.push({
        type: 'temperature',
        severity: 'success',
        message: `Temperature at ${sensor.location} is optimal at ${sensor.temp.toFixed(1)}°C.`,
        recommendation: 'Maintain current climate control settings.',
        prediction: sensor.temp + (hour >= 10 && hour <= 15 ? 1.2 : -0.3)
      });
    }
    
    // Noise insights
    if (sensor.noise > THRESHOLDS.noise.critical) {
      insights.push({
        type: 'noise',
        severity: 'critical',
        message: `CRITICAL: Noise at ${sensor.location} is ${sensor.noise.toFixed(0)} dB, ${(sensor.noise - THRESHOLDS.noise.critical).toFixed(0)} dB above acceptable limit.`,
        recommendation: 'Immediate intervention required. Alert C4DLab team to reduce activity during examination periods.',
        prediction: sensor.noise + (hour >= 9 && hour <= 17 ? 3 : -5)
      });
    } else if (sensor.noise > THRESHOLDS.noise.warning) {
      insights.push({
        type: 'noise',
        severity: 'warning',
        message: `Noise at ${sensor.location} is elevated at ${sensor.noise.toFixed(0)} dB.`,
        recommendation: 'Monitor closely. Consider coordinating with C4DLab for quieter operations.',
        prediction: sensor.noise + (hour >= 9 && hour <= 17 ? 4 : -3)
      });
    } else {
      insights.push({
        type: 'noise',
        severity: 'success',
        message: `Noise levels at ${sensor.location} are acceptable at ${sensor.noise.toFixed(0)} dB.`,
        recommendation: 'Current noise levels are suitable for examination environment.',
        prediction: sensor.noise + (hour >= 9 && hour <= 17 ? 5 : -2)
      });
    }
    
    // Air quality insights
    if (sensor.airQuality > THRESHOLDS.airQuality.critical) {
      insights.push({
        type: 'airQuality',
        severity: 'critical',
        message: `Air quality at ${sensor.location} is poor at ${sensor.airQuality.toFixed(0)} ppm, ${(sensor.airQuality - THRESHOLDS.airQuality.critical).toFixed(0)} ppm above safe levels.`,
        recommendation: 'Air purification systems activated. Increase ventilation and consider reducing occupancy.',
        prediction: sensor.airQuality - 50
      });
    } else if (sensor.airQuality > THRESHOLDS.airQuality.warning) {
      insights.push({
        type: 'airQuality',
        severity: 'warning',
        message: `Air quality at ${sensor.location} is moderate at ${sensor.airQuality.toFixed(0)} ppm.`,
        recommendation: 'Air purifiers activated preventively. Monitor for improvement.',
        prediction: sensor.airQuality + 30
      });
    } else {
      insights.push({
        type: 'airQuality',
        severity: 'success',
        message: `Air quality at ${sensor.location} is good at ${sensor.airQuality.toFixed(0)} ppm.`,
        recommendation: 'Air quality is within healthy range. Systems on standby.',
        prediction: sensor.airQuality + 20
      });
    }
    
    // Time-based insights
    if (hour >= 9 && hour <= 17) {
      insights.push({
        type: 'schedule',
        severity: 'info',
        message: 'Peak activity hours detected (9 AM - 5 PM).',
        recommendation: 'C4DLab innovation activities are at their highest. Coordinate with team for noise management during exams.',
        prediction: null
      });
    }
    
    return insights;
  }
};
