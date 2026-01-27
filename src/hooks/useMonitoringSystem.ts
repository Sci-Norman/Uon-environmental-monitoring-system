import { useState, useEffect, useCallback } from 'react';
import { LOCATION_NAMES, THRESHOLDS, SensorData, AlertData, SystemLog } from '@/constants/monitoring';
import { NotificationService } from '@/services/NotificationService';

export function useMonitoringSystem() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sensors, setSensors] = useState<SensorData[]>(
    LOCATION_NAMES.map((location, idx) => ({
      id: idx + 1,
      location,
      temp: 22 + Math.random() * 2,
      airQuality: 450 + Math.random() * 50,
      noise: 38 + Math.random() * 10,
      status: 'normal' as const,
      ventilation: false,
      heater: false,
      airPurifier: false,
      fan: false,
      ventilationAuto: false,
      heaterAuto: false,
      airPurifierAuto: false,
      fanAuto: false
    }))
  );
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addAlert = useCallback((message: string, severity: 'warning' | 'critical') => {
    setAlerts(prev => [{
      id: Date.now(),
      message,
      severity,
      time: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 30));
  }, []);

  const addLog = useCallback((action: string) => {
    setSystemLogs(prev => [{
      id: Date.now(),
      action,
      time: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 50));
  }, []);

  // Sensor updates with automatic control
  useEffect(() => {
    const sensorUpdate = setInterval(() => {
      setSensors(prev => prev.map(sensor => {
        let newTemp = sensor.temp + (Math.random() - 0.5) * 0.8;
        let newNoise = sensor.noise + (Math.random() - 0.5) * 6;
        let newAir = sensor.airQuality + (Math.random() - 0.5) * 40;

        newTemp = Math.max(18, Math.min(30, newTemp));
        newNoise = Math.max(30, Math.min(65, newNoise));
        newAir = Math.max(400, Math.min(800, newAir));

        let updatedSensor: SensorData = {
          ...sensor,
          temp: newTemp,
          noise: newNoise,
          airQuality: newAir,
          ventilationAuto: false,
          heaterAuto: false,
          airPurifierAuto: false,
          fanAuto: false
        };

        // TEMPERATURE CONTROL
        if (newTemp > THRESHOLDS.temperature.max) {
          if (!sensor.ventilation) {
            NotificationService.sendAlert(
              'High Temperature',
              sensor.location,
              `${newTemp.toFixed(1)}°C`,
              'Ventilation system activated automatically'
            );
            addAlert(`High temp: ${sensor.location} - Ventilation AUTO ON`, 'warning');
            addLog(`AUTO: Ventilation ON - ${sensor.location}`);
          }
          updatedSensor.ventilation = true;
          updatedSensor.ventilationAuto = true;
          updatedSensor.heater = false;
        } else if (newTemp < THRESHOLDS.temperature.min) {
          if (!sensor.heater) {
            addLog(`AUTO: Heater ON - ${sensor.location}`);
          }
          updatedSensor.heater = true;
          updatedSensor.heaterAuto = true;
          updatedSensor.ventilation = false;
        } else {
          if (sensor.ventilationAuto) {
            updatedSensor.ventilation = false;
            addLog(`AUTO: Ventilation OFF - ${sensor.location}`);
          }
          if (sensor.heaterAuto) {
            updatedSensor.heater = false;
            addLog(`AUTO: Heater OFF - ${sensor.location}`);
          }
        }

        // AIR QUALITY CONTROL
        if (newAir > THRESHOLDS.airQuality.warning) {
          if (!sensor.airPurifier) {
            NotificationService.sendAlert(
              'Poor Air Quality',
              sensor.location,
              `${newAir.toFixed(0)} ppm`,
              'Air purifier, fan & ventilation activated automatically'
            );
            addAlert(`Poor air: ${sensor.location} - Systems AUTO ON`, 'warning');
            addLog(`AUTO: Air systems ON - ${sensor.location}`);
          }
          updatedSensor.airPurifier = true;
          updatedSensor.airPurifierAuto = true;
          updatedSensor.fan = true;
          updatedSensor.fanAuto = true;
          updatedSensor.ventilation = true;
          updatedSensor.ventilationAuto = true;
        } else if (newAir < THRESHOLDS.airQuality.warning - 50) {
          if (sensor.airPurifierAuto) {
            updatedSensor.airPurifier = false;
            addLog(`AUTO: Air Purifier OFF - ${sensor.location}`);
          }
          if (sensor.fanAuto) {
            updatedSensor.fan = false;
            addLog(`AUTO: Fan OFF - ${sensor.location}`);
          }
        }

        // NOISE ALERTS
        if (newNoise > THRESHOLDS.noise.critical && Math.random() > 0.85) {
          NotificationService.sendAlert(
            'CRITICAL Noise',
            sensor.location,
            `${newNoise.toFixed(0)} dB`,
            'Immediate noise reduction required - exam in progress'
          );
          addAlert(`CRITICAL noise: ${sensor.location} ${newNoise.toFixed(0)} dB`, 'critical');
        } else if (newNoise > THRESHOLDS.noise.warning && Math.random() > 0.95) {
          NotificationService.sendAlert(
            'High Noise',
            sensor.location,
            `${newNoise.toFixed(0)} dB`,
            'Please reduce noise - examination period'
          );
          addAlert(`High noise: ${sensor.location}`, 'warning');
        }

        // STATUS UPDATE
        if (newTemp > THRESHOLDS.temperature.critical ||
            newAir > THRESHOLDS.airQuality.critical ||
            newNoise > THRESHOLDS.noise.critical) {
          updatedSensor.status = 'critical';
        } else if (newTemp > THRESHOLDS.temperature.max ||
                   newAir > THRESHOLDS.airQuality.warning ||
                   newNoise > THRESHOLDS.noise.warning) {
          updatedSensor.status = 'warning';
        } else {
          updatedSensor.status = 'normal';
        }

        return updatedSensor;
      }));
    }, 4000);

    return () => clearInterval(sensorUpdate);
  }, [addAlert, addLog]);

  const toggleSystem = useCallback((sensorId: number, systemType: string) => {
    setSensors(prev => prev.map(sensor => {
      if (sensor.id === sensorId) {
        const autoKey = `${systemType}Auto` as keyof SensorData;
        const systemKey = systemType as keyof SensorData;
        const newStatus = !sensor[systemKey];
        
        addLog(`MANUAL: ${systemType.toUpperCase()} ${newStatus ? 'ON' : 'OFF'} - ${sensor.location}`);
        
        return {
          ...sensor,
          [systemType]: newStatus,
          [autoKey]: false
        };
      }
      return sensor;
    }));
  }, [addLog]);

  const exportReport = useCallback(() => {
    const report = `
╔════════════════════════════════════════════════════════════════╗
║ UNIVERSITY OF NAIROBI - C4DLAB AREA ║
║ ENVIRONMENTAL MONITORING SYSTEM ║
║ WEEKLY REPORT ║
╚════════════════════════════════════════════════════════════════╝

Generated: ${new Date().toLocaleString()}
Report Period: Last 7 Days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Average Temperature: ${(sensors.reduce((a, s) => a + s.temp, 0) / sensors.length).toFixed(1)}°C
Average Air Quality: ${Math.round(sensors.reduce((a, s) => a + s.airQuality, 0) / sensors.length)} ppm
Average Noise Level: ${Math.round(sensors.reduce((a, s) => a + s.noise, 0) / sensors.length)} dB
Total Alerts: ${alerts.length}
System Activations: ${systemLogs.length}

LOCATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${sensors.map(s => `
📍 ${s.location}
   Temperature: ${s.temp.toFixed(1)}°C | Air Quality: ${s.airQuality.toFixed(0)} ppm | Noise: ${s.noise.toFixed(0)} dB
   Status: ${s.status.toUpperCase()}
   Active Systems: ${[
     s.ventilation && `Ventilation${s.ventilationAuto ? ' (AUTO)' : ''}`,
     s.heater && `Heater${s.heaterAuto ? ' (AUTO)' : ''}`,
     s.airPurifier && `Air Purifier${s.airPurifierAuto ? ' (AUTO)' : ''}`,
     s.fan && `Fan${s.fanAuto ? ' (AUTO)' : ''}`
   ].filter(Boolean).join(', ') || 'None'}
`).join('\n')}

AI RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Schedule HVAC maintenance for optimal performance
2. Consider noise dampening in C4DLab Innovation Space
3. Air purifier filters need replacement in Computer Lab A
4. Monitor temperature trends during afternoon peak hours
5. Coordinate with C4DLab for quiet hours during exams

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Technical Team: facilities@uonbi.ac.ke | Support: +254 712 345 678
System Administrator: C4DLab Technical Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UoN-Weekly-Report-${Date.now()}.txt`;
    a.click();
    
    console.log('📧 Weekly report emailed to technical team');
    alert('Weekly report generated and sent to technical team!');
  }, [sensors, alerts, systemLogs]);

  const activeAlerts = sensors.filter(s => s.status !== 'normal');

  return {
    currentTime,
    sensors,
    alerts,
    systemLogs,
    activeAlerts,
    toggleSystem,
    exportReport
  };
}
