import { useState, useCallback } from "react";

export type SystemType = "hvac" | "heater" | "purifier" | "fan" | "ventilation";
export type SystemMode = "auto" | "manual";

export interface SystemState {
  id: SystemType;
  name: string;
  isOn: boolean;
  mode: SystemMode;
  location: string;
}

export interface ControlAction {
  timestamp: Date;
  system: SystemType;
  action: "on" | "off";
  reason: string;
  automatic: boolean;
}

const initialSystems: SystemState[] = [
  { id: "hvac", name: "HVAC System", isOn: false, mode: "auto", location: "LDT Hall" },
  { id: "heater", name: "Heater", isOn: false, mode: "auto", location: "Gandhi Wing" },
  { id: "purifier", name: "Air Purifier", isOn: false, mode: "auto", location: "JKML Building" },
  { id: "fan", name: "Cooling Fans", isOn: false, mode: "auto", location: "Science Complex" },
  { id: "ventilation", name: "Ventilation", isOn: false, mode: "auto", location: "C4DLab Space" },
];

export function useControlSystems() {
  const [systems, setSystems] = useState<SystemState[]>(initialSystems);
  const [actionLog, setActionLog] = useState<ControlAction[]>([]);

  const toggleSystem = useCallback((systemId: SystemType, reason: string = "Manual toggle", automatic: boolean = false) => {
    setSystems(prev => prev.map(system => {
      if (system.id === systemId) {
        const newState = !system.isOn;
        
        // Log the action
        setActionLog(logs => [{
          timestamp: new Date(),
          system: systemId,
          action: newState ? "on" : "off",
          reason,
          automatic,
        }, ...logs.slice(0, 49)]); // Keep last 50 actions
        
        return { ...system, isOn: newState };
      }
      return system;
    }));
  }, []);

  const setSystemState = useCallback((systemId: SystemType, isOn: boolean, reason: string, automatic: boolean = true) => {
    setSystems(prev => prev.map(system => {
      if (system.id === systemId && system.isOn !== isOn && system.mode === "auto") {
        // Log the action
        setActionLog(logs => [{
          timestamp: new Date(),
          system: systemId,
          action: isOn ? "on" : "off",
          reason,
          automatic,
        }, ...logs.slice(0, 49)]);
        
        return { ...system, isOn };
      }
      return system;
    }));
  }, []);

  const setSystemMode = useCallback((systemId: SystemType, mode: SystemMode) => {
    setSystems(prev => prev.map(system => 
      system.id === systemId ? { ...system, mode } : system
    ));
  }, []);

  return {
    systems,
    actionLog,
    toggleSystem,
    setSystemState,
    setSystemMode,
  };
}
