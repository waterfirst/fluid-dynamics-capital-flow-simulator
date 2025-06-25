
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GameState, Sector, SimulationEvent, LogEntry, SimulationSpeed } from '../types';
import { SIMULATION_SPEEDS, HISTORICAL_EVENTS, getInitialGameState, SIMULATION_PARAMS, START_YEAR } from '../constants';

export const useFluidSimulation = (initialSpeed: SimulationSpeed) => {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [isPaused, setPaused] = useState<boolean>(true);
  const [currentSpeed, setCurrentSpeed] = useState<SimulationSpeed>(initialSpeed);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const simulationFrameId = useRef<number | undefined>(undefined);

  const maxSimulationTime = useMemo(() => {
    const endYear = 2025;
    const endQuarterIndex = 1; // 0 for Q1, 1 for Q2, 2 for Q3, 3 for Q4
    return (endYear - START_YEAR) * 4 + endQuarterIndex;
  }, []); 
  
  const applyEvent = useCallback((state: GameState): GameState => {
    const activeEvents = HISTORICAL_EVENTS.filter(e => state.time >= e.time && state.time < e.time + e.duration);
    
    activeEvents.forEach(activeEvent => {
        const targetSector = state.sectors.find(s => s.id === activeEvent.target);
        if (targetSector) {
            targetSector.external_force += activeEvent.force; 
            
            if (state.time === activeEvent.time) {
                if (!state.log.some(l => l.name === activeEvent.name && l.originalEventTime === activeEvent.time)) {
                    state.log.push({ 
                        time: state.time, 
                        name: activeEvent.name, 
                        originalEventTime: activeEvent.time,
                        importance: activeEvent.importance // << Added importance
                    });
                    state.log.sort((a, b) => {
                        if (a.originalEventTime !== b.originalEventTime) {
                            return a.originalEventTime - b.originalEventTime;
                        }
                        return a.time - b.time; 
                    });
                }
            }
        }
    });
    return state;
  }, []);

  const tick = useCallback(() => {
    setGameState(prev => {
      if (prev.time >= maxSimulationTime) {
        setPaused(true);
        setIsComplete(true);
        let finalState = JSON.parse(JSON.stringify(prev));
        finalState.sectors.forEach((sector: Sector) => {
           if (finalState.capitalHistory[sector.id]) {
             while(finalState.capitalHistory[sector.id].length <= finalState.time) {
                finalState.capitalHistory[sector.id].push(finalState.capitalHistory[sector.id][finalState.capitalHistory[sector.id].length -1] || 0);
             }
             finalState.capitalHistory[sector.id][finalState.time] = sector.capital;
           }
        });
        return finalState;
      }

      let newState: GameState = JSON.parse(JSON.stringify(prev));
      newState.time += 1; 

      newState = applyEvent(newState);
      
      const totalCapitalBeforeFlowsAndForces = newState.sectors.reduce((sum, s) => sum + s.capital, 0);

      newState.sectors.forEach(s => {
        const effectiveCapital = Math.max(s.capital, 1e-9); 
        s.pressure = (s.external_force / effectiveCapital) * SIMULATION_PARAMS.PRESSURE_COEFFICIENT;
      });

      const flows: Array<{ from: number, to: number, amount: number }> = [];
      for (let i = 0; i < newState.sectors.length; i++) {
        for (let j = i + 1; j < newState.sectors.length; j++) {
          const s1 = newState.sectors[i];
          const s2 = newState.sectors[j];
          const pressure_diff = s1.pressure - s2.pressure;
          const flowAmount = s1.capital > 0 ? pressure_diff * s1.capital * (1 - SIMULATION_PARAMS.FRICTION_COEFFICIENT) : 0;
          flows.push({ from: i, to: j, amount: flowAmount });
        }
      }

      flows.forEach(({ from, to, amount }) => {
        const sFrom = newState.sectors[from];
        const sTo = newState.sectors[to];
        let actualFlow = amount;
        if (amount > 0) { 
            actualFlow = Math.min(amount, sFrom.capital); 
        } else { 
            actualFlow = Math.max(amount, -sTo.capital); 
        }
        sFrom.capital -= actualFlow;
        sTo.capital += actualFlow;
      });
      
      newState.sectors.forEach(s => {
        if (s.capital < 0) s.capital = 0; 
      });

      newState.sectors.forEach(s => {
        s.capital += s.external_force;
        s.external_force *= SIMULATION_PARAMS.EXTERNAL_FORCE_DECAY;
        if (Math.abs(s.external_force) < 1e-3) s.external_force = 0; 
        if (s.capital < 0) s.capital = 0; 
      });
      
      const totalCapitalAfterFlowsAndForces = newState.sectors.reduce((sum, s) => sum + s.capital, 0);
      const adjustmentNeeded = totalCapitalBeforeFlowsAndForces - totalCapitalAfterFlowsAndForces;

      if (Math.abs(adjustmentNeeded) > 1e-6 && totalCapitalAfterFlowsAndForces !== 0) {
          newState.sectors.forEach(s => {
            s.capital += adjustmentNeeded * (s.capital / totalCapitalAfterFlowsAndForces); 
             if (s.capital < 0) s.capital = 0;
          });
      } else if (Math.abs(adjustmentNeeded) > 1e-6 && totalCapitalBeforeFlowsAndForces !== 0 && newState.sectors.length > 0 && totalCapitalAfterFlowsAndForces === 0) {
          const perSectorShare = totalCapitalBeforeFlowsAndForces / newState.sectors.length;
          newState.sectors.forEach(s => s.capital = perSectorShare);
      }
      
      newState.sectors.forEach(s => {
        if (s.capital < 0) s.capital = 0; 
      });

      newState.sectors.forEach(sector => {
        if (!newState.capitalHistory[sector.id]) {
            newState.capitalHistory[sector.id] = Array(newState.time + 1).fill(0);
        }
        while (newState.capitalHistory[sector.id].length <= newState.time) {
            const lastValue = newState.capitalHistory[sector.id].length > 0 ? 
                              newState.capitalHistory[sector.id][newState.capitalHistory[sector.id].length - 1] : 
                              sector.capital; 
            newState.capitalHistory[sector.id].push(lastValue);
        }
        newState.capitalHistory[sector.id][newState.time] = sector.capital;
      });

      return newState;
    });
  }, [applyEvent, maxSimulationTime]);

  useEffect(() => {
    if (!isPaused && !isComplete) {
      const intervalMs = SIMULATION_SPEEDS[currentSpeed];
      simulationFrameId.current = window.setInterval(tick, intervalMs);
    }
    return () => {
      clearInterval(simulationFrameId.current);
    };
  }, [isPaused, tick, currentSpeed, isComplete]);

  const togglePause = () => {
    if (isComplete && !isPaused) return; 
    if (isComplete && isPaused) return;  
    setPaused(p => !p);
  };
  
  const reset = () => {
      setPaused(true);
      setIsComplete(false);
      clearInterval(simulationFrameId.current);
      setGameState(getInitialGameState());
  };

  const changeSpeed = (speed: SimulationSpeed) => {
    setCurrentSpeed(speed);
  };

  return { gameState, isPaused, isComplete, togglePause, reset, currentSpeed, changeSpeed, maxSimulationTime };
};