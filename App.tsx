import { useMemo, useState } from 'react';
import CapitalFlowScene from './components/CapitalFlowScene';
import EquationPanel from './components/EquationPanel';
import HistoryChart from './components/HistoryChart';
import MetricsStrip from './components/MetricsStrip';
import ParameterPanel from './components/ParameterPanel';
import ScenarioMatrix from './components/ScenarioMatrix';
import { DEFAULT_SIMULATION_SPEED, SCENARIOS } from './constants';
import { useFluidSimulation } from './hooks/useFluidSimulation';
import { mergeScenarioParams } from './simulation/engine';
import { ModelParams, SimulationSpeed } from './types';

const speedOptions: { value: SimulationSpeed; label: string }[] = [
  { value: 'slow', label: '느림' },
  { value: 'middle', label: '보통' },
  { value: 'fast', label: '빠름' },
];

const paperUrl = 'https://github.com/waterfirst/fluid-dynamics-capital-flow-simulator/blob/main/docs/PAPER_v2.md';

const App = () => {
  const [scenarioId, setScenarioId] = useState('nbfi-sovereign-2026');
  const [overrides, setOverrides] = useState<Partial<ModelParams>>({});
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];
  const params = useMemo(() => mergeScenarioParams(scenario, overrides), [overrides, scenario]);
  const simulation = useFluidSimulation(scenario, params, DEFAULT_SIMULATION_SPEED);
  const branchingRatio = params.hawkesExcitation / params.hawkesDecay;
  const progress = (simulation.state.step / scenario.horizon) * 100;
  const strongestFlows = [...simulation.state.edges]
    .sort((a, b) => Math.abs(b.flow) - Math.abs(a.flow))
    .slice(0, 7);
  const names = new Map(simulation.state.nodes.map((node) => [node.id, node.shortName]));

  const selectScenario = (id: string) => {
    setScenarioId(id);
    setOverrides({});
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Capital Flow Lab home">
          <span className="brand-mark">CF</span>
          <span><strong>Capital Flow Lab</strong><small>Network Navier–Stokes / Korea</small></span>
        </a>
        <nav>
          <a href="#simulator">시뮬레이터</a>
          <a href="#experiments">케이스 실험</a>
          <a href="#method">수식·한계</a>
          <a href={paperUrl} target="_blank" rel="noreferrer">논문 v2</a>
        </nav>
        <a className="github-link" href="https://github.com/waterfirst/fluid-dynamics-capital-flow-simulator" target="_blank" rel="noreferrer">GitHub ↗</a>
      </header>

      <main id="top">
        <section className="hero">
          <div>
            <span className="eyebrow">RESEARCH-GRADE INTERACTIVE MODEL · 2026 REVISION</span>
            <h1>자본은 흐르지만,<br /><em>물 그 자체는 아니다.</em></h1>
            <p>자본 이동을 네트워크 운동량·보존식으로 표현하고, 내생적 유동성·Hawkes 전염·정책 백스톱을 분리해 반증 가능한 가설로 바꾼 연구용 시뮬레이터입니다.</p>
            <div className="hero-actions">
              <a className="primary-action" href="#simulator">실험 시작</a>
              <a className="secondary-action" href={paperUrl} target="_blank" rel="noreferrer">개정 논문 읽기</a>
            </div>
          </div>
          <div className="hero-thesis">
            <span>핵심 개정</span>
            <strong>Analogy → Testable reduced-form model</strong>
            <ul>
              <li>ν: 고정 상수와 지연 상태변수 비교</li>
              <li>f: 글로벌 충격 + Hawkes 전염 분해</li>
              <li>검증: 워크포워드·절제·기준선 명시</li>
              <li>Rössler: 핵심 모형에서 제외</li>
            </ul>
          </div>
        </section>

        <section className="scenario-rail" aria-label="Scenario selection">
          {SCENARIOS.map((item) => (
            <button
              type="button"
              className={item.id === scenario.id ? 'active' : ''}
              key={item.id}
              onClick={() => selectScenario(item.id)}
            >
              <span>{item.period}</span>
              <strong>{item.name}</strong>
            </button>
          ))}
        </section>

        <section id="simulator" className="scenario-brief panel">
          <div>
            <span className={`category-tag ${scenario.category}`}>{scenario.category}</span>
            <h2>{scenario.name}</h2>
            <p>{scenario.summary}</p>
          </div>
          <div className="research-question"><span>검증 질문</span><strong>{scenario.researchQuestion}</strong></div>
          {scenario.sourceUrl && <a href={scenario.sourceUrl} target="_blank" rel="noreferrer">근거 자료 ↗<small>{scenario.sourceLabel}</small></a>}
        </section>

        <section className="control-deck panel">
          <div className="playback-controls">
            <button type="button" className="play-button" onClick={simulation.togglePause} disabled={simulation.complete}>
              {simulation.complete ? '완료' : simulation.isPaused ? '▶ 재생' : 'Ⅱ 일시정지'}
            </button>
            <button type="button" onClick={simulation.advance} disabled={!simulation.isPaused || simulation.complete}>+1 step</button>
            <button type="button" onClick={simulation.runToEnd}>끝까지 계산</button>
            <button type="button" onClick={simulation.reset}>초기화</button>
          </div>
          <div className="timeline">
            <div><span>t = {simulation.state.step}</span><strong>{simulation.activeShock?.label ?? (simulation.complete ? '실험 종료' : '평상 상태')}</strong><span>{scenario.horizon} steps</span></div>
            <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="speed-switch" aria-label="Simulation speed">
            {speedOptions.map((option) => (
              <button key={option.value} type="button" className={simulation.speed === option.value ? 'active' : ''} onClick={() => simulation.setSpeed(option.value)}>{option.label}</button>
            ))}
          </div>
        </section>

        <MetricsStrip state={simulation.state} />

        <section className="sim-grid">
          <CapitalFlowScene state={simulation.state} />
          <ParameterPanel
            params={params}
            branchingRatio={branchingRatio}
            onChange={(key, value) => setOverrides((current) => ({ ...current, [key]: value }))}
            onReset={() => setOverrides({})}
          />
        </section>

        <section className="analysis-grid">
          <HistoryChart history={simulation.state.history} shockStarts={scenario.shocks.map((shock) => shock.start)} />
          <section className="panel flow-table">
            <div className="panel-title-row">
              <div><span className="eyebrow">EDGE DIAGNOSTICS</span><h2>주요 자본 경로</h2></div>
            </div>
            <div className="flow-list">
              {strongestFlows.map((edge) => {
                const forward = edge.flow >= 0;
                return (
                  <div key={edge.id}>
                    <span>{forward ? names.get(edge.source) : names.get(edge.target)}</span>
                    <i><b style={{ width: `${Math.min(100, Math.abs(edge.flow) * 3.6)}%` }} /></i>
                    <span>{forward ? names.get(edge.target) : names.get(edge.source)}</span>
                    <strong>{Math.abs(edge.flow).toFixed(1)}</strong>
                  </div>
                );
              })}
            </div>
          </section>
        </section>

        <div id="experiments"><ScenarioMatrix /></div>
        <div id="method"><EquationPanel /></div>

        <section className="paper-cta">
          <div><span className="eyebrow">MANUSCRIPT V2 · AUGUST 2026</span><h2>강한 주장보다 강한 검증</h2></div>
          <p>기존의 “99.4% 방향 정확도·상관 1.000”을 확정 결론에서 제외하고, 정보누출 점검·워크포워드 검증·VAR/무작위보행/비선형 기준선·Diebold–Mariano 검정이 통과된 결과만 본문에 남기도록 논문을 재구성했습니다.</p>
          <a href={paperUrl} target="_blank" rel="noreferrer">논문 v2 전문 →</a>
        </section>
      </main>

      <footer>
        <span>© 2026 Nakcho Choi · Open research artifact</span>
        <span>교육·연구 목적 · 투자 자문 아님</span>
      </footer>
    </div>
  );
};

export default App;
