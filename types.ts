
export interface Sector {
  id: string;
  name: string;
  capital: number;
  pressure: number;
  external_force: number;
}

export interface SimulationEvent {
  time: number; // Represents quarter, e.g., year * 4
  name: string;
  target: string; // Corresponds to Sector id
  force: number;
  duration: number; // In quarters
  importance: 1 | 2 | 3; // 1: Major, 2: Secondary, 3: Tertiary/Contextual
}

export interface LogEntry {
  time: number; // Simulation time when the log entry was created
  name: string;
  originalEventTime: number; // The 'time' property from the SimulationEvent object, marks the start quarter of the event
  importance: 1 | 2 | 3; // Importance level from SimulationEvent
}

export interface GameState {
  time: number;
  sectors: Sector[];
  log: LogEntry[];
  capitalHistory: Record<string, number[]>; // Key: sector.id, Value: array of capital values over time (quarters)
}

// Defines the keys for different simulation speeds
export type SimulationSpeed = 'slow' | 'middle' | 'fast';