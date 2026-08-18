import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SIMULATION_SPEEDS } from '../constants';
import { createInitialState, stepSimulation } from '../simulation/engine';
import { ModelParams, Scenario, SimulationSpeed } from '../types';

export const useFluidSimulation = (
  scenario: Scenario,
  params: ModelParams,
  initialSpeed: SimulationSpeed,
) => {
  const [state, setState] = useState(() => createInitialState(scenario, params));
  const [isPaused, setPaused] = useState(true);
  const [speed, setSpeed] = useState<SimulationSpeed>(initialSpeed);
  const timerRef = useRef<number | undefined>(undefined);
  const complete = state.step >= scenario.horizon;

  const reset = useCallback(() => {
    window.clearInterval(timerRef.current);
    setPaused(true);
    setState(createInitialState(scenario, params));
  }, [params, scenario]);

  useEffect(() => {
    reset();
  }, [reset]);

  const advance = useCallback(() => {
    setState((previous) => stepSimulation(previous, scenario, params));
  }, [params, scenario]);

  const runToEnd = useCallback(() => {
    setPaused(true);
    setState((previous) => {
      let next = previous;
      while (next.step < scenario.horizon) next = stepSimulation(next, scenario, params);
      return next;
    });
  }, [params, scenario]);

  useEffect(() => {
    if (isPaused || complete) return undefined;
    timerRef.current = window.setInterval(advance, SIMULATION_SPEEDS[speed]);
    return () => window.clearInterval(timerRef.current);
  }, [advance, complete, isPaused, speed]);

  const activeShock = useMemo(() => scenario.shocks.find((shock) =>
    state.step >= shock.start && state.step < shock.start + shock.duration), [scenario.shocks, state.step]);

  return {
    state,
    isPaused,
    complete,
    speed,
    activeShock,
    setSpeed,
    togglePause: () => !complete && setPaused((paused) => !paused),
    advance,
    runToEnd,
    reset,
  };
};
