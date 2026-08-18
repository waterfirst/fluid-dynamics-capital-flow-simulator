import {
  MarketEdgeDefinition,
  MarketNodeDefinition,
  ModelParams,
  Scenario,
  SimulationSpeed,
} from './types';

export const SIMULATION_SPEEDS: Record<SimulationSpeed, number> = {
  slow: 480,
  middle: 180,
  fast: 60,
};

export const DEFAULT_SIMULATION_SPEED: SimulationSpeed = 'middle';

export const DEFAULT_PARAMS: ModelParams = {
  dt: 0.16,
  pressureSensitivity: 0.72,
  crowdingElasticity: 0.9,
  baseViscosity: 0.24,
  viscosityEndogeneity: 0.55,
  transactionFriction: 0.16,
  nonlinearAdvection: 0.28,
  networkDiffusion: 0.2,
  externalForceSensitivity: 0.8,
  shockDecay: 0.075,
  shockScale: 1,
  hawkesBaseline: 0.025,
  hawkesExcitation: 0.22,
  hawkesDecay: 0.48,
  leverageAmplification: 0.42,
  policyBackstop: 0.32,
  capitalControls: 0.08,
  stochasticVolatility: 0.018,
  flowScale: 38,
};

export const MARKET_NODES: MarketNodeDefinition[] = [
  {
    id: 'equity', name: '한국 주식', shortName: 'K-Equity', color: '#49d6ff', capital: 1_500,
    liquidityDepth: 0.86, position: [-2.5, 1.3, 0.3], policyWeight: 0.8, domestic: true,
    description: 'KOSPI·KOSDAQ 및 외국인 주식 포지션',
  },
  {
    id: 'bonds', name: '국채·회사채', shortName: 'Bonds', color: '#7d8cff', capital: 1_650,
    liquidityDepth: 0.94, position: [-0.7, 2.3, -0.8], policyWeight: 0.9, domestic: true,
    description: '원화 채권과 금리 듀레이션 익스포저',
  },
  {
    id: 'krw', name: '원화·FX 스왑', shortName: 'KRW / FX', color: '#d879ff', capital: 900,
    liquidityDepth: 0.72, position: [1.5, 1.7, 0.6], policyWeight: 0.85, domestic: true,
    description: '원화 현물·선물환·FX 스왑 펀딩',
  },
  {
    id: 'banks', name: '은행 신용', shortName: 'Banks', color: '#49e6b3', capital: 1_450,
    liquidityDepth: 0.8, position: [-2.0, -0.7, -0.8], policyWeight: 1, domestic: true,
    description: '은행 대차대조표와 신용 중개',
  },
  {
    id: 'nbfi', name: '비은행 금융', shortName: 'NBFI', color: '#ffb54a', capital: 1_050,
    liquidityDepth: 0.58, position: [0.1, -1.3, 1.2], policyWeight: 0.55, domestic: true,
    description: '펀드·보험·연기금·레버리지 중개',
  },
  {
    id: 'realAssets', name: '부동산·실물', shortName: 'Real assets', color: '#ff6f91', capital: 1_250,
    liquidityDepth: 0.4, position: [2.4, -0.4, -0.7], policyWeight: 0.35, domestic: true,
    description: '부동산·원자재·비유동성 위험자산',
  },
  {
    id: 'globalDollar', name: '글로벌 달러', shortName: 'Global USD', color: '#ffd166', capital: 1_700,
    liquidityDepth: 1.12, position: [2.2, 0.5, 2.7], policyWeight: 0.05, domestic: false,
    description: '글로벌 달러 유동성과 안전자산 수요',
  },
  {
    id: 'reserves', name: '현금·외환보유액', shortName: 'Reserves', color: '#a9b9ca', capital: 1_000,
    liquidityDepth: 1.25, position: [-0.9, 0.0, -2.8], policyWeight: 0.2, domestic: false,
    description: '대기 자금·외환보유액·정책 완충재',
  },
];

export const MARKET_EDGES: MarketEdgeDefinition[] = [
  { id: 'equity-nbfi', source: 'equity', target: 'nbfi', capacity: 1.25, length: 1 },
  { id: 'equity-dollar', source: 'equity', target: 'globalDollar', capacity: 1.35, length: 1.15, crossBorder: true },
  { id: 'equity-reserves', source: 'equity', target: 'reserves', capacity: 0.75, length: 1.2 },
  { id: 'bonds-banks', source: 'bonds', target: 'banks', capacity: 1.1, length: 1 },
  { id: 'bonds-nbfi', source: 'bonds', target: 'nbfi', capacity: 1.2, length: 0.9 },
  { id: 'bonds-dollar', source: 'bonds', target: 'globalDollar', capacity: 0.9, length: 1.2, crossBorder: true },
  { id: 'krw-dollar', source: 'krw', target: 'globalDollar', capacity: 1.5, length: 0.75, crossBorder: true },
  { id: 'krw-banks', source: 'krw', target: 'banks', capacity: 1.1, length: 0.9 },
  { id: 'krw-reserves', source: 'krw', target: 'reserves', capacity: 1.15, length: 0.85 },
  { id: 'banks-nbfi', source: 'banks', target: 'nbfi', capacity: 1.35, length: 0.8 },
  { id: 'banks-real', source: 'banks', target: 'realAssets', capacity: 1.0, length: 1.05 },
  { id: 'banks-reserves', source: 'banks', target: 'reserves', capacity: 0.95, length: 1 },
  { id: 'nbfi-real', source: 'nbfi', target: 'realAssets', capacity: 1.15, length: 0.9 },
  { id: 'nbfi-dollar', source: 'nbfi', target: 'globalDollar', capacity: 1.0, length: 1.1, crossBorder: true },
  { id: 'real-reserves', source: 'realAssets', target: 'reserves', capacity: 0.55, length: 1.3 },
  { id: 'dollar-reserves', source: 'globalDollar', target: 'reserves', capacity: 1.25, length: 0.9, crossBorder: true },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'orderly-cycle', name: '질서 있는 글로벌 금융순환', period: '기준 경로', category: 'baseline',
    summary: '약한 달러·완만한 위험선호 충격이 깊은 시장에서 소산되는 기준 사례입니다.',
    researchQuestion: '낮은 외력과 안정적 점도에서 네트워크가 균형으로 복귀하는가?',
    horizon: 120, seed: 101,
    shocks: [{ start: 24, duration: 14, amplitude: 0.28, label: '완만한 위험선호', targets: { equity: 0.65, bonds: 0.2, globalDollar: -0.35 } }],
    parameterOverrides: { viscosityEndogeneity: 0.25, hawkesExcitation: 0.08, policyBackstop: 0.12 },
  },
  {
    id: 'covid-sudden-stop', name: '2020 팬데믹 Sudden Stop', period: '2020형', category: 'historical',
    summary: '위험자산 매도와 달러 선호가 동시에 나타나고 정책 백스톱이 뒤따르는 충격입니다.',
    researchQuestion: 'Hawkes 전염과 정책 대응이 최대 유출·회복시간을 얼마나 바꾸는가?',
    horizon: 140, seed: 2020,
    shocks: [
      { start: 22, duration: 8, amplitude: 1.05, label: '팬데믹 위험회피', targets: { equity: -1, banks: -0.55, nbfi: -0.72, globalDollar: 0.82, reserves: 0.5 } },
      { start: 35, duration: 18, amplitude: 0.5, label: '통화·재정 백스톱', targets: { equity: 0.45, bonds: 0.7, banks: 0.6, reserves: -0.45 } },
    ],
    parameterOverrides: { hawkesExcitation: 0.34, viscosityEndogeneity: 0.72, policyBackstop: 0.72 },
  },
  {
    id: 'rate-dollar-shock', name: '2022 금리·달러 동시 충격', period: '2022형', category: 'historical',
    summary: '글로벌 긴축이 채권·FX·부동산을 거쳐 은행과 비은행으로 전달되는 사례입니다.',
    researchQuestion: '듀레이션 손실과 달러 외력이 교차할 때 어느 연결망이 병목이 되는가?',
    horizon: 140, seed: 2022,
    shocks: [
      { start: 25, duration: 28, amplitude: 0.72, label: '글로벌 긴축', targets: { bonds: -0.72, krw: -0.7, realAssets: -0.52, globalDollar: 0.82 } },
      { start: 42, duration: 12, amplitude: 0.44, label: '레버리지 디레버리징', targets: { nbfi: -0.8, banks: -0.35, reserves: 0.5 } },
    ],
    parameterOverrides: { leverageAmplification: 0.62, policyBackstop: 0.28, capitalControls: 0.04 },
  },
  {
    id: 'fx-hedging-2025', name: '2025 관세·FX 헤징 재조정', period: '2025형', category: 'historical',
    summary: '달러 익스포저 축소와 파생상품 헤징이 현물 매도를 일부 흡수하는 사례입니다.',
    researchQuestion: '딜러 내부화와 깊은 FX 유동성이 충격 흡수장치로 작동하는가?',
    horizon: 120, seed: 2025,
    shocks: [{ start: 30, duration: 9, amplitude: 0.78, label: '관세 뉴스·달러 헤징', targets: { krw: -0.72, equity: -0.42, globalDollar: 0.62, reserves: 0.3 } }],
    parameterOverrides: { networkDiffusion: 0.38, baseViscosity: 0.18, hawkesExcitation: 0.18, policyBackstop: 0.2 },
    sourceLabel: 'BIS Quarterly Review, December 2025',
    sourceUrl: 'https://www.bis.org/publ/qtrpdf/r_qt2512b.htm',
  },
  {
    id: 'nbfi-sovereign-2026', name: '2026 NBFI·국채 증폭 위험', period: '2026 논점', category: 'stress',
    summary: '국채 재가격화가 레버리지 비은행과 펀딩시장을 통해 증폭되는 최신 스트레스입니다.',
    researchQuestion: '높은 공공부채·NBFI 레버리지가 유동성의 상태의존성을 얼마나 키우는가?',
    horizon: 150, seed: 2026,
    shocks: [
      { start: 28, duration: 18, amplitude: 0.84, label: '국채 위험 프리미엄', targets: { bonds: -0.88, nbfi: -0.68, banks: -0.3, globalDollar: 0.6 } },
      { start: 43, duration: 10, amplitude: 0.56, label: '마진콜·펀드 환매', targets: { nbfi: -1, equity: -0.48, reserves: 0.62 } },
    ],
    parameterOverrides: { leverageAmplification: 0.86, viscosityEndogeneity: 0.9, hawkesExcitation: 0.38, policyBackstop: 0.35 },
    sourceLabel: 'BIS Annual Economic Report 2026',
    sourceUrl: 'https://www.bis.org/publ/arpdf/ar2026e2.htm',
  },
  {
    id: 'liquidity-freeze', name: '내생적 점도·유동성 동결', period: '반증 실험', category: 'stress',
    summary: '스프레드·깊이를 결과가 아닌 지연 상태변수로 취급했을 때의 비선형 동결 사례입니다.',
    researchQuestion: '고정 점도 모형보다 상태의존 점도가 위기 꼬리위험을 설명하는가?',
    horizon: 150, seed: 77,
    shocks: [{ start: 26, duration: 15, amplitude: 0.92, label: '복합 유동성 쇼크', targets: { equity: -0.82, nbfi: -0.9, banks: -0.45, krw: -0.65, globalDollar: 0.75, reserves: 0.55 } }],
    parameterOverrides: { viscosityEndogeneity: 1.35, hawkesExcitation: 0.42, leverageAmplification: 0.78, policyBackstop: 0.08 },
  },
  {
    id: 'targeted-backstop', name: '표적형 정책 백스톱', period: '정책 반사실', category: 'policy',
    summary: '동일한 복합 충격에서 광범위한 부양 대신 유동성 병목만 표적으로 지원합니다.',
    researchQuestion: '정책비용을 제한하면서 최대 유출과 회복시간을 함께 낮출 수 있는가?',
    horizon: 150, seed: 77,
    shocks: [{ start: 26, duration: 15, amplitude: 0.92, label: '복합 유동성 쇼크', targets: { equity: -0.82, nbfi: -0.9, banks: -0.45, krw: -0.65, globalDollar: 0.75, reserves: 0.55 } }],
    parameterOverrides: { viscosityEndogeneity: 1.05, hawkesExcitation: 0.3, leverageAmplification: 0.62, policyBackstop: 0.82, capitalControls: 0.16 },
  },
];

export const PARAMETER_GROUPS = [
  {
    title: '유체·네트워크',
    controls: [
      { key: 'baseViscosity', label: '기준 점도 ν₀', min: 0.05, max: 0.8, step: 0.01 },
      { key: 'viscosityEndogeneity', label: '점도 내생성 γν', min: 0, max: 1.8, step: 0.02 },
      { key: 'pressureSensitivity', label: '압력 민감도 κp', min: 0.1, max: 1.5, step: 0.02 },
      { key: 'crowdingElasticity', label: '쏠림 탄력성 κc', min: 0.1, max: 1.8, step: 0.02 },
      { key: 'nonlinearAdvection', label: '비선형 이류 α', min: 0, max: 0.9, step: 0.01 },
      { key: 'networkDiffusion', label: '네트워크 확산 D', min: 0, max: 0.8, step: 0.01 },
    ],
  },
  {
    title: '충격·전염',
    controls: [
      { key: 'shockScale', label: '충격 크기', min: 0, max: 2, step: 0.02 },
      { key: 'shockDecay', label: '충격 감쇠 βf', min: 0.01, max: 0.2, step: 0.005 },
      { key: 'hawkesExcitation', label: 'Hawkes 자기흥분 αH', min: 0, max: 0.47, step: 0.01 },
      { key: 'hawkesDecay', label: 'Hawkes 감쇠 βH', min: 0.2, max: 0.9, step: 0.01 },
      { key: 'leverageAmplification', label: '레버리지 증폭 λL', min: 0, max: 1.5, step: 0.02 },
      { key: 'stochasticVolatility', label: '확률 변동 σ', min: 0, max: 0.08, step: 0.002 },
    ],
  },
  {
    title: '정책·마찰',
    controls: [
      { key: 'policyBackstop', label: '정책 백스톱 φ', min: 0, max: 1.2, step: 0.02 },
      { key: 'capitalControls', label: '자본이동 마찰 χc', min: 0, max: 0.6, step: 0.01 },
      { key: 'transactionFriction', label: '거래비용 χt', min: 0, max: 0.6, step: 0.01 },
      { key: 'externalForceSensitivity', label: '외력 민감도 κf', min: 0.1, max: 1.5, step: 0.02 },
    ],
  },
] as const;
