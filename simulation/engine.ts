import { DEFAULT_PARAMS, MARKET_EDGES, MARKET_NODES } from '../constants';
import {
  EdgeFlow,
  MarketNode,
  ModelParams,
  NodeId,
  Scenario,
  ScenarioResult,
  SimulationMetrics,
  SimulationSample,
  SimulationState,
} from '../types';

const EPSILON = 1e-9;

export const mergeScenarioParams = (
  scenario: Scenario,
  overrides: Partial<ModelParams> = {},
): ModelParams => ({ ...DEFAULT_PARAMS, ...scenario.parameterOverrides, ...overrides });

const nodeMap = (nodes: MarketNode[]): Map<NodeId, MarketNode> =>
  new Map(nodes.map((node) => [node.id, node]));

const deterministicNoise = (step: number, edgeIndex: number, seed: number): number => {
  const raw = Math.sin((step + 1) * 12.9898 + (edgeIndex + 1) * 78.233 + seed * 0.031) * 43_758.5453;
  return (raw - Math.floor(raw) - 0.5) * 2;
};

const activeShockForces = (
  scenario: Scenario,
  step: number,
  params: ModelParams,
): { forces: Record<NodeId, number>; eventImpulse: number; stress: number } => {
  const forces = Object.fromEntries(MARKET_NODES.map((node) => [node.id, 0])) as Record<NodeId, number>;
  let eventImpulse = 0;
  let stress = 0;

  scenario.shocks.forEach((shock) => {
    if (step < shock.start) return;
    const age = step - shock.start;
    const envelope = age < shock.duration
      ? 1
      : Math.exp(-params.shockDecay * (age - shock.duration + 1));
    if (envelope < 1e-4) return;

    const scaledAmplitude = shock.amplitude * params.shockScale * envelope;
    Object.entries(shock.targets).forEach(([id, weight]) => {
      forces[id as NodeId] += scaledAmplitude * (weight ?? 0);
    });
    stress += Math.abs(scaledAmplitude);
    if (age === 0) eventImpulse += Math.abs(shock.amplitude * params.shockScale);
  });

  return { forces, eventImpulse, stress };
};

const adjacentVelocity = (edge: EdgeFlow, edges: EdgeFlow[]): number => {
  const adjacent = edges.filter((candidate) =>
    candidate.id !== edge.id
    && (candidate.source === edge.source
      || candidate.target === edge.source
      || candidate.source === edge.target
      || candidate.target === edge.target));
  if (!adjacent.length) return 0;

  const oriented = adjacent.map((candidate) => {
    if (candidate.source === edge.source || candidate.target === edge.target) return candidate.velocity;
    return -candidate.velocity;
  });
  return oriented.reduce((sum, value) => sum + value, 0) / oriented.length;
};

const calculateMetrics = (
  nodes: MarketNode[],
  edges: EdgeFlow[],
  initialTotalCapital: number,
  cumulativePolicyCost: number,
): SimulationMetrics => {
  const totalCapital = nodes.reduce((sum, node) => sum + node.capital, 0);
  const equity = nodes.find((node) => node.id === 'equity');
  const crossBorderOutflow = edges
    .filter((edge) => edge.crossBorder)
    .reduce((sum, edge) => {
      const sourceDomestic = nodes.find((node) => node.id === edge.source)?.domestic ?? false;
      const targetDomestic = nodes.find((node) => node.id === edge.target)?.domestic ?? false;
      if (sourceDomestic && !targetDomestic) return sum + edge.flow;
      if (!sourceDomestic && targetDomestic) return sum - edge.flow;
      return sum;
    }, 0);
  const shares = nodes.map((node) => node.capital / Math.max(totalCapital, EPSILON));
  const concentrationHhi = shares.reduce((sum, share) => sum + share ** 2, 0);
  const meanViscosity = nodes.reduce((sum, node) => sum + node.effectiveViscosity, 0) / nodes.length;
  const velocities = edges.map((edge) => Math.abs(edge.velocity));
  const meanVelocity = velocities.reduce((sum, velocity) => sum + velocity, 0) / velocities.length;
  const velocityVariance = velocities.reduce((sum, velocity) => sum + (velocity - meanVelocity) ** 2, 0) / velocities.length;
  const turbulenceIndex = Math.sqrt(velocityVariance) / Math.max(meanVelocity, 0.04);
  const maxReynolds = Math.max(0, ...edges.map((edge) => edge.reynolds));
  const equityDrawdown = equity
    ? Math.max(0, 1 - equity.capital / Math.max(equity.baselineCapital, EPSILON))
    : 0;
  const systemicStress = Math.min(3,
    0.34 * Math.min(1.5, equityDrawdown * 4)
    + 0.22 * Math.min(1.5, Math.abs(crossBorderOutflow) / 25)
    + 0.2 * Math.min(1.5, turbulenceIndex / 2)
    + 0.24 * Math.min(1.5, maxReynolds / 8));

  return {
    totalCapital,
    massError: Math.abs(totalCapital - initialTotalCapital),
    crossBorderOutflow,
    equityDrawdown,
    concentrationHhi,
    meanViscosity,
    maxReynolds,
    turbulenceIndex,
    systemicStress,
    policyCost: cumulativePolicyCost,
  };
};

const makeSample = (state: Omit<SimulationState, 'history'>): SimulationSample => ({
  step: state.step,
  equityCapital: state.nodes.find((node) => node.id === 'equity')?.capital ?? 0,
  hawkesIntensity: state.hawkesIntensity,
  ...state.metrics,
});

export const createInitialState = (scenario: Scenario, params: ModelParams): SimulationState => {
  const nodes: MarketNode[] = MARKET_NODES.map((definition) => ({
    ...definition,
    baselineCapital: definition.capital,
    pressure: 0,
    externalForce: 0,
    effectiveViscosity: params.baseViscosity / definition.liquidityDepth,
  }));
  const edges: EdgeFlow[] = MARKET_EDGES.map((definition) => ({
    ...definition,
    velocity: 0,
    flow: 0,
    reynolds: 0,
  }));
  const initialTotalCapital = nodes.reduce((sum, node) => sum + node.capital, 0);
  const metrics = calculateMetrics(nodes, edges, initialTotalCapital, 0);
  const stateWithoutHistory: Omit<SimulationState, 'history'> = {
    scenarioId: scenario.id,
    step: 0,
    nodes,
    edges,
    hawkesIntensity: params.hawkesBaseline,
    initialTotalCapital,
    cumulativePolicyCost: 0,
    metrics,
  };
  return { ...stateWithoutHistory, history: [makeSample(stateWithoutHistory)] };
};

export const stepSimulation = (
  previous: SimulationState,
  scenario: Scenario,
  params: ModelParams,
): SimulationState => {
  if (previous.step >= scenario.horizon) return previous;

  const step = previous.step + 1;
  const { forces: rawForces, eventImpulse, stress: exogenousStress } = activeShockForces(scenario, step, params);
  const priorFlowBurst = Math.min(1.5, Math.abs(previous.metrics.crossBorderOutflow) / 35);
  const hawkesIntensity = Math.min(4,
    params.hawkesBaseline
    + (previous.hawkesIntensity - params.hawkesBaseline) * Math.exp(-params.hawkesDecay * params.dt)
    + params.hawkesExcitation * (eventImpulse + priorFlowBurst) * params.dt);
  const branchingRatio = params.hawkesExcitation / Math.max(params.hawkesDecay, EPSILON);
  const hawkesMultiplier = 1 + hawkesIntensity * Math.min(1.5, branchingRatio);

  const nodes = previous.nodes.map((node) => {
    const capitalGap = (node.capital - node.baselineCapital) / Math.max(node.baselineCapital, EPSILON);
    const rawForce = rawForces[node.id] * hawkesMultiplier;
    const downsideStress = Math.max(0, -rawForce) + Math.max(0, -capitalGap) * params.leverageAmplification;
    const effectiveViscosity = params.baseViscosity
      * (1 + params.viscosityEndogeneity * downsideStress)
      / node.liquidityDepth;
    const pressure = params.pressureSensitivity
      * (params.crowdingElasticity * capitalGap + 0.35 * Math.sign(capitalGap) * capitalGap ** 2);
    const policyAttraction = params.policyBackstop
      * node.policyWeight
      * Math.max(0, exogenousStress - 0.2)
      * Math.max(0, -rawForce);
    return {
      ...node,
      pressure,
      externalForce: rawForce + policyAttraction,
      effectiveViscosity,
    };
  });

  const byId = nodeMap(nodes);
  const proposedEdges = previous.edges.map((edge, edgeIndex) => {
    const source = byId.get(edge.source);
    const target = byId.get(edge.target);
    if (!source || !target) return edge;

    const pressureAcceleration = (source.pressure - target.pressure) / edge.length;
    const forceAcceleration = params.externalForceSensitivity
      * (target.externalForce - source.externalForce)
      * (1 + params.leverageAmplification * Math.max(0, hawkesIntensity - params.hawkesBaseline));
    const viscosity = (source.effectiveViscosity + target.effectiveViscosity) / 2;
    const viscousDamping = viscosity * edge.velocity / (edge.length ** 2);
    const friction = (params.transactionFriction + (edge.crossBorder ? params.capitalControls : 0)) * edge.velocity;
    const advection = params.nonlinearAdvection * edge.velocity * Math.abs(edge.velocity) / edge.length;
    const diffusion = params.networkDiffusion * (adjacentVelocity(edge, previous.edges) - edge.velocity);
    const noise = params.stochasticVolatility * deterministicNoise(step, edgeIndex, scenario.seed);
    const acceleration = pressureAcceleration + forceAcceleration + diffusion - viscousDamping - friction - advection + noise;
    const velocity = Math.max(-3.5, Math.min(3.5, edge.velocity + params.dt * acceleration));
    const flow = velocity * edge.capacity * params.dt * params.flowScale;
    const reynolds = Math.abs(velocity) * edge.length / Math.max(viscosity, EPSILON);
    return { ...edge, velocity, flow, reynolds };
  });

  const requestedOutgoing = new Map<NodeId, number>();
  proposedEdges.forEach((edge) => {
    const from = edge.flow >= 0 ? edge.source : edge.target;
    requestedOutgoing.set(from, (requestedOutgoing.get(from) ?? 0) + Math.abs(edge.flow));
  });

  const deltas = new Map<NodeId, number>(nodes.map((node) => [node.id, 0]));
  const edges = proposedEdges.map((edge) => {
    const from = edge.flow >= 0 ? edge.source : edge.target;
    const to = edge.flow >= 0 ? edge.target : edge.source;
    const sourceNode = byId.get(from);
    const requested = requestedOutgoing.get(from) ?? 0;
    const available = (sourceNode?.capital ?? 0) * 0.12;
    const scale = requested > available && requested > 0 ? available / requested : 1;
    const magnitude = Math.abs(edge.flow) * scale;
    deltas.set(from, (deltas.get(from) ?? 0) - magnitude);
    deltas.set(to, (deltas.get(to) ?? 0) + magnitude);
    return { ...edge, flow: edge.flow >= 0 ? magnitude : -magnitude };
  });

  const nextNodes = nodes.map((node) => ({
    ...node,
    capital: Math.max(EPSILON, node.capital + (deltas.get(node.id) ?? 0)),
  }));
  const policyIncrement = params.policyBackstop * Math.max(0, exogenousStress - 0.2) * params.dt * 10;
  const cumulativePolicyCost = previous.cumulativePolicyCost + policyIncrement;
  const metrics = calculateMetrics(nextNodes, edges, previous.initialTotalCapital, cumulativePolicyCost);
  const stateWithoutHistory: Omit<SimulationState, 'history'> = {
    scenarioId: scenario.id,
    step,
    nodes: nextNodes,
    edges,
    hawkesIntensity,
    initialTotalCapital: previous.initialTotalCapital,
    cumulativePolicyCost,
    metrics,
  };
  return {
    ...stateWithoutHistory,
    history: [...previous.history, makeSample(stateWithoutHistory)],
  };
};

export const runScenario = (
  scenario: Scenario,
  overrides: Partial<ModelParams> = {},
): SimulationState => {
  const params = mergeScenarioParams(scenario, overrides);
  let state = createInitialState(scenario, params);
  while (state.step < scenario.horizon) state = stepSimulation(state, scenario, params);
  return state;
};

export const summarizeScenario = (scenario: Scenario, state: SimulationState): ScenarioResult => {
  const initial = state.history[0];
  const shockStart = Math.min(...scenario.shocks.map((shock) => shock.start));
  const trough = state.history.reduce((lowest, sample) =>
    sample.equityCapital < lowest.equityCapital ? sample : lowest, state.history[0]);
  const recovery = state.history.find((sample) =>
    sample.step > Math.max(shockStart, trough.step)
    && sample.equityCapital >= initial.equityCapital * 0.95);
  const postShockSamples = state.history.filter((sample) => sample.step >= shockStart);

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    peakOutflow: Math.max(0, ...postShockSamples.map((sample) => sample.crossBorderOutflow)),
    maxEquityDrawdown: Math.max(0, ...postShockSamples.map((sample) => sample.equityDrawdown)),
    peakStress: Math.max(0, ...postShockSamples.map((sample) => sample.systemicStress)),
    peakReynolds: Math.max(0, ...postShockSamples.map((sample) => sample.maxReynolds)),
    meanViscosity: postShockSamples.reduce((sum, sample) => sum + sample.meanViscosity, 0) / Math.max(postShockSamples.length, 1),
    recoveryStep: recovery ? recovery.step - shockStart : null,
    hhiChange: state.metrics.concentrationHhi - initial.concentrationHhi,
    policyCost: state.metrics.policyCost,
    massError: state.metrics.massError,
  };
};
