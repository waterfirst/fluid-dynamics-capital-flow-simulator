export type SimulationSpeed = 'slow' | 'middle' | 'fast';

export type NodeId =
  | 'equity'
  | 'bonds'
  | 'krw'
  | 'banks'
  | 'nbfi'
  | 'realAssets'
  | 'globalDollar'
  | 'reserves';

export interface MarketNodeDefinition {
  id: NodeId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  capital: number;
  liquidityDepth: number;
  position: [number, number, number];
  policyWeight: number;
  domestic: boolean;
}

export interface MarketNode extends MarketNodeDefinition {
  baselineCapital: number;
  pressure: number;
  externalForce: number;
  effectiveViscosity: number;
}

export interface MarketEdgeDefinition {
  id: string;
  source: NodeId;
  target: NodeId;
  capacity: number;
  length: number;
  crossBorder?: boolean;
}

export interface EdgeFlow extends MarketEdgeDefinition {
  velocity: number;
  flow: number;
  reynolds: number;
}

export interface ScenarioShock {
  start: number;
  duration: number;
  amplitude: number;
  label: string;
  targets: Partial<Record<NodeId, number>>;
}

export interface ModelParams {
  dt: number;
  pressureSensitivity: number;
  crowdingElasticity: number;
  baseViscosity: number;
  viscosityEndogeneity: number;
  transactionFriction: number;
  nonlinearAdvection: number;
  networkDiffusion: number;
  externalForceSensitivity: number;
  shockDecay: number;
  shockScale: number;
  hawkesBaseline: number;
  hawkesExcitation: number;
  hawkesDecay: number;
  leverageAmplification: number;
  policyBackstop: number;
  capitalControls: number;
  stochasticVolatility: number;
  flowScale: number;
}

export interface Scenario {
  id: string;
  name: string;
  period: string;
  category: 'baseline' | 'historical' | 'stress' | 'policy';
  summary: string;
  researchQuestion: string;
  horizon: number;
  seed: number;
  shocks: ScenarioShock[];
  parameterOverrides: Partial<ModelParams>;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface SimulationMetrics {
  totalCapital: number;
  massError: number;
  crossBorderOutflow: number;
  equityDrawdown: number;
  concentrationHhi: number;
  meanViscosity: number;
  maxReynolds: number;
  turbulenceIndex: number;
  systemicStress: number;
  policyCost: number;
}

export interface SimulationSample extends SimulationMetrics {
  step: number;
  equityCapital: number;
  hawkesIntensity: number;
}

export interface SimulationState {
  scenarioId: string;
  step: number;
  nodes: MarketNode[];
  edges: EdgeFlow[];
  hawkesIntensity: number;
  initialTotalCapital: number;
  cumulativePolicyCost: number;
  metrics: SimulationMetrics;
  history: SimulationSample[];
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioName: string;
  peakOutflow: number;
  maxEquityDrawdown: number;
  peakStress: number;
  peakReynolds: number;
  meanViscosity: number;
  recoveryStep: number | null;
  hhiChange: number;
  policyCost: number;
  massError: number;
}
