const EquationPanel = () => (
  <section className="research-grid">
    <article className="panel equation-card">
      <span className="eyebrow">GOVERNING EQUATIONS</span>
      <h2>물리 비유에서 검증 가능한 축약모형으로</h2>
      <div className="equation">∂u<sub>e</sub>/∂t = −∇<sub>G</sub>p + ν<sub>e,t</sub>Δ<sub>G</sub>u − αu|u| − χu + κ<sub>f</sub>f<sub>e,t</sub> + ε<sub>e,t</sub></div>
      <div className="equation">C<sub>i,t+1</sub> = C<sub>i,t</sub> − Δt Σ<sub>e</sub>B<sub>ie</sub>q<sub>e,t</sub>, &nbsp; q<sub>e,t</sub> = a<sub>e</sub>u<sub>e,t</sub></div>
      <div className="equation">ν<sub>i,t</sub> = ν<sub>0</sub>(1 + γ<sub>ν</sub>S<sub>i,t−1</sub>)/Depth<sub>i,t−1</sub></div>
      <p>첫 식은 네트워크상의 운동량, 둘째는 자본 보존, 셋째는 Raphael이 지적한 점도의 내생성 문제를 직접 검정하는 상태방정식입니다. 점도는 동시점 스프레드가 아니라 지연된 깊이·스프레드·시장충격으로 추정합니다.</p>
    </article>

    <article className="panel critique-card">
      <span className="eyebrow">RESEARCH RESPONSE</span>
      <h2>경제학자 피드백을 반영한 세 가지 경계</h2>
      <ol>
        <li><strong>점도:</strong> 고정 ν와 상태의존 ν를 분리하고, 예측방정식에서 지연 유동성이 추가 설명력을 갖는지 검정합니다.</li>
        <li><strong>외력:</strong> 공격적 주문 전염은 Hawkes 강도로 모델링하되 분기비가 1 미만인지 공개합니다.</li>
        <li><strong>혼돈:</strong> Rössler attractor는 핵심 모형에서 제외했습니다. 사용 시에도 비선형 AR·확률변동성 기준선보다 OOS가 개선될 때만 탐색적 특징으로 인정합니다.</li>
      </ol>
      <p className="callout">매크로 일별 모형의 결과를 틱 데이터로 이전하지 않습니다. 주파수별로 독립 재추정·독립 검증합니다.</p>
    </article>

    <article className="panel mapping-card">
      <span className="eyebrow">OPERATIONAL MAPPING</span>
      <h2>관측 가능한 금융 대응변수</h2>
      <dl>
        <div><dt>ρ / C</dt><dd>시장별 자본 스톡·외국인 보유액</dd></div>
        <div><dt>u</dt><dd>순매수·펀드플로를 깊이로 표준화한 유속</dd></div>
        <div><dt>∇p</dt><dd>밸류에이션·금리차·헤지비용의 상대 구배</dd></div>
        <div><dt>ν</dt><dd>지연 스프레드·깊이·가격충격으로 추정한 마찰</dd></div>
        <div><dt>f</dt><dd>VIX·달러·금리·지정학 충격과 Hawkes 전염</dd></div>
        <div><dt>Re*</dt><dd>모형 진단용 무차원 비율—물리적 난류의 증명 아님</dd></div>
      </dl>
    </article>
  </section>
);

export default EquationPanel;
