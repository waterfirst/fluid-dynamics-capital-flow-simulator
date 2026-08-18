import { SimulationSample } from '../types';

const WIDTH = 920;
const HEIGHT = 290;
const MARGIN = { left: 54, right: 46, top: 24, bottom: 38 };

const linePath = (values: number[], min: number, max: number) => values.map((value, index) => {
  const x = MARGIN.left + (index / Math.max(values.length - 1, 1)) * (WIDTH - MARGIN.left - MARGIN.right);
  const y = MARGIN.top + (1 - (value - min) / Math.max(max - min, 1e-9)) * (HEIGHT - MARGIN.top - MARGIN.bottom);
  return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
}).join(' ');

const HistoryChart = ({ history, shockStarts }: { history: SimulationSample[]; shockStarts: number[] }) => {
  const capital = history.map((sample) => sample.equityCapital);
  const stress = history.map((sample) => sample.systemicStress);
  const minCapital = Math.min(...capital) * 0.985;
  const maxCapital = Math.max(...capital) * 1.015;
  const stressScaled = stress.map((value) => minCapital + (value / 3) * (maxCapital - minCapital));
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const last = history.at(-1);

  return (
    <section className="panel chart-panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">TIME DOMAIN</span>
          <h2>주식 자본·시스템 스트레스</h2>
        </div>
        <div className="chart-legend"><span className="capital-line">자본</span><span className="stress-line">스트레스</span></div>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Equity capital and systemic stress history">
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const y = MARGIN.top + tick * (HEIGHT - MARGIN.top - MARGIN.bottom);
          return <line key={tick} x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y} y2={y} className="grid-line" />;
        })}
        {shockStarts.map((step) => {
          const x = MARGIN.left + (step / Math.max(history.length - 1, 1)) * plotWidth;
          return <line key={step} x1={x} x2={x} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} className="shock-line" />;
        })}
        <path d={linePath(capital, minCapital, maxCapital)} className="capital-path" />
        <path d={linePath(stressScaled, minCapital, maxCapital)} className="stress-path" />
        <text x={MARGIN.left} y={HEIGHT - 12} className="axis-label">0</text>
        <text x={WIDTH - MARGIN.right} y={HEIGHT - 12} textAnchor="end" className="axis-label">step {last?.step ?? 0}</text>
        <text x={MARGIN.left - 10} y={MARGIN.top + 4} textAnchor="end" className="axis-label">{Math.round(maxCapital)}</text>
        <text x={MARGIN.left - 10} y={HEIGHT - MARGIN.bottom} textAnchor="end" className="axis-label">{Math.round(minCapital)}</text>
      </svg>
    </section>
  );
};

export default HistoryChart;
