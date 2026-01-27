// Location names for UoN Chiromo C4DLab area
export const LOCATION_NAMES = [
  'Main Examination Hall',
  'Computer Lab A',
  'Computer Lab B',
  'C4DLab Innovation Space',
  'Seminar Room 1',
  'Corridor - Ground Floor'
];

// Thresholds for environmental conditions
export const THRESHOLDS = {
  temperature: { min: 20, max: 24, critical: 27 },
  noise: { warning: 45, critical: 55 },
  airQuality: { warning: 500, critical: 700 }
};

// Sensor data interface
export interface SensorData {
  id: number;
  location: string;
  temp: number;
  airQuality: number;
  noise: number;
  status: 'normal' | 'warning' | 'critical';
  ventilation: boolean;
  heater: boolean;
  airPurifier: boolean;
  fan: boolean;
  ventilationAuto: boolean;
  heaterAuto: boolean;
  airPurifierAuto: boolean;
  fanAuto: boolean;
}

export interface AlertData {
  id: number;
  message: string;
  severity: 'warning' | 'critical';
  time: string;
}

export interface SystemLog {
  id: number;
  action: string;
  time: string;
}

export interface AIInsight {
  type: 'temperature' | 'noise' | 'airQuality' | 'schedule';
  severity: 'critical' | 'warning' | 'success' | 'info';
  message: string;
  recommendation: string;
  prediction: number | null;
}
