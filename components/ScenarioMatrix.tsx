import { useMemo } from 'react';
import { SCENARIOS } from '../constants';
import { runScenario, summarizeScenario } from '../simulation/engine';

const ScenarioMatrix = () => {
  const results = useMemo(() => SCENARIOS.map((scenario) =>
    summarizeScenario(scenario, runScenario(scenario))), []);

  return (
    <section className="panel experiment-panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">BATCH EXPERIMENTS</span>
          <h2>7개 케이스 비교</h2>
        </div>
        <span className="muted-note">동일 엔진·고정 seed · 질량보존</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>케이스</th>
              <th>최대 순유출</th>
              <th>주식 DD</th>
              <th>Peak stress</th>
              <th>Peak Re</th>
              <th>회복 step</th>
              <th>정책비용</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.scenarioId}>
                <th>{result.scenarioName}</th>
                <td>{result.peakOutflow.toFixed(1)}</td>
                <td>{(result.maxEquityDrawdown * 100).toFixed(1)}%</td>
                <td>{result.peakStress.toFixed(2)}</td>
                <td>{result.peakReynolds.toFixed(2)}</td>
                <td>{result.recoveryStep ?? '미회복'}</td>
                <td>{result.policyCost.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="method-note">이 표는 구조적 비교용 합성 실험입니다. 역사적 수치의 재현이나 투자성과를 주장하지 않으며, 실증판에서는 시점 고정 데이터와 워크포워드 검증으로 대체합니다.</p>
    </section>
  );
};

export default ScenarioMatrix;
