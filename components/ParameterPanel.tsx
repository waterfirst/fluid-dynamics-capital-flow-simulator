import { PARAMETER_GROUPS } from '../constants';
import { ModelParams } from '../types';

interface ParameterPanelProps {
  params: ModelParams;
  branchingRatio: number;
  onChange: (key: keyof ModelParams, value: number) => void;
  onReset: () => void;
}

const ParameterPanel = ({ params, branchingRatio, onChange, onReset }: ParameterPanelProps) => (
  <section className="panel parameter-panel">
    <div className="panel-title-row">
      <div>
        <span className="eyebrow">MODEL CONTROL</span>
        <h2>파라미터 실험실</h2>
      </div>
      <button className="text-button" type="button" onClick={onReset}>시나리오값 복원</button>
    </div>

    <div className={`stability-chip ${branchingRatio >= 1 ? 'unstable' : ''}`}>
      Hawkes 분기비 α<sub>H</sub>/β<sub>H</sub> = <strong>{branchingRatio.toFixed(2)}</strong>
      <span>{branchingRatio < 1 ? '정상성 영역' : '폭발 영역 — 해석 주의'}</span>
    </div>

    {PARAMETER_GROUPS.map((group) => (
      <details key={group.title} open>
        <summary>{group.title}</summary>
        <div className="control-stack">
          {group.controls.map((control) => {
            const key = control.key as keyof ModelParams;
            return (
              <label className="range-control" key={control.key}>
                <span>{control.label}<output>{params[key].toFixed(control.step < 0.01 ? 3 : 2)}</output></span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={params[key]}
                  onChange={(event) => onChange(key, Number(event.target.value))}
                />
              </label>
            );
          })}
        </div>
      </details>
    ))}
  </section>
);

export default ParameterPanel;
