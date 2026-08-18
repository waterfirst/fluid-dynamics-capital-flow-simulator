import { SimulationState } from '../types';

const pct = (value: number) => `${(value * 100).toFixed(1)}%`;

const MetricsStrip = ({ state }: { state: SimulationState }) => {
  const metrics = state.metrics;
  const items = [
    { label: '국경간 순유출', value: `${metrics.crossBorderOutflow.toFixed(1)} / step`, tone: metrics.crossBorderOutflow > 8 ? 'risk' : 'calm' },
    { label: '주식자본 DD', value: pct(metrics.equityDrawdown), tone: metrics.equityDrawdown > 0.08 ? 'risk' : 'calm' },
    { label: '시스템 스트레스', value: metrics.systemicStress.toFixed(2), tone: metrics.systemicStress > 0.7 ? 'risk' : 'warm' },
    { label: 'Reynolds 진단', value: metrics.maxReynolds.toFixed(2), tone: metrics.maxReynolds > 6 ? 'risk' : 'warm' },
    { label: '유효 점도', value: metrics.meanViscosity.toFixed(3), tone: 'cool' },
    { label: '질량 오차', value: metrics.massError.toExponential(1), tone: metrics.massError > 1e-6 ? 'risk' : 'calm' },
  ];

  return (
    <section className="metrics-strip" aria-label="Simulation diagnostics">
      {items.map((item) => (
        <article key={item.label} className={`metric-card ${item.tone}`}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
};

export default MetricsStrip;
