# Capital Flow Lab

> 자본 이동을 **상태의존 네트워크 Navier–Stokes 축약모형**으로 실험하는 React + Three.js 연구 도구

[![Deploy simulator to GitHub Pages](https://github.com/waterfirst/fluid-dynamics-capital-flow-simulator/actions/workflows/deploy.yml/badge.svg)](https://github.com/waterfirst/fluid-dynamics-capital-flow-simulator/actions/workflows/deploy.yml)
[![SSRN](https://img.shields.io/badge/SSRN-6510038-152c46)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6510038)

## 이번 개정의 핵심

기존 앱은 역사적 사건이 섹터 자본에 더해지는 교육용 데모였고, 실제 Navier–Stokes 이산화·파라미터 추정·검증이 없었습니다. v2는 다음을 구현합니다.

- 그래프 incidence matrix에 대응하는 **운동량 방정식 + 자본 보존식**
- 고정 점도와 **지연 유동성 상태에 따른 내생적 점도** 비교
- 공격적 흐름의 군집을 나타내는 **정상 Hawkes 외력**과 분기비 진단
- 압력, 비선형 이류, 네트워크 확산, 거래마찰, 레버리지, 정책 백스톱의 독립 제어
- 자본 스톡·유속·압력·유효 점도·Reynolds 진단을 연결한 **Three.js 3D 흐름장**
- 7개 위기·정책 사례의 동일 엔진 비교와 JSON/CSV 재현 산출물
- 기존 `waterfirst/ns-capital-flow`의 정보누출과 정의 충돌을 기록한 [재현성 감사](docs/LEGACY_MODEL_AUDIT.md)
- 과도한 성과 주장을 보류하고 반증 절차를 앞세운 [논문 v2](docs/PAPER_v2.md)

## 모델

방향을 가진 시장 네트워크의 edge 유속을 `u`, node 자본을 `C`, 압력을 `p`라 하면,

$$
\dot{u}_t=-\nabla_G p_t+\nu_t\Delta_G u_t-\alpha u_t|u_t|-\chi u_t+\kappa_f f_t+\varepsilon_t
$$

$$
C_{t+1}=C_t-\Delta t\,Bq_t,\qquad q_t=A u_t
$$

$$
\nu_{i,t}=\frac{\nu_0\left(1+\gamma_\nu S_{i,t-1}\right)}{Depth_{i,t-1}}
$$

`B`는 node-edge incidence matrix, `A`는 경로별 용량, `S`는 지연 스트레스입니다. 앱의 Reynolds 수는 **모형 내부 진단량**이며 물리적 난류의 증거로 해석하지 않습니다.

## 기본 실험

| 케이스 | 최대 국경간 순유출 | 주식자본 최대 DD | Peak stress | Peak Re* |
|---|---:|---:|---:|---:|
| 질서 있는 글로벌 금융순환 | 1.8 | 0.0% | 0.19 | 1.27 |
| 2020 팬데믹 Sudden Stop | 26.0 | 17.5% | 0.55 | 4.27 |
| 2022 금리·달러 충격 | 21.7 | 9.7% | 0.49 | 4.66 |
| 2025 관세·FX 헤징 | 15.5 | 13.5% | 0.41 | 3.67 |
| 2026 NBFI·국채 증폭 | 25.4 | 10.6% | 0.44 | 4.33 |
| 내생적 점도·유동성 동결 | 37.5 | 35.7% | 0.81 | 5.40 |
| 표적형 정책 백스톱 | 24.1 | 22.3% | 0.53 | 3.82 |

이 값들은 역사적 추정치가 아니라 구조 비교를 위한 결정론적 합성 실험입니다. 결과 파일은 [JSON](artifacts/scenario-results.json)과 [CSV](artifacts/scenario-results.csv)로 저장됩니다.

## 실행

요구 환경: Node.js 20 이상

```bash
npm install
npm run dev
```

검증과 프로덕션 빌드:

```bash
npm test
npm run experiments
npm run build
```

GitHub Pages의 프로젝트 경로를 위해 Vite base는 `/fluid-dynamics-capital-flow-simulator/`로 설정했습니다. `main`에 반영되면 Actions가 테스트·빌드 후 Pages에 배포합니다.

## 저장소 구조

```text
components/                 React·Three.js UI와 진단 차트
hooks/useFluidSimulation.ts 재생·정지·step 실행 상태
simulation/engine.ts        순수 함수형 수치 엔진
simulation/engine.test.ts   질량보존·재현성·정상성·정책 반사실 테스트
scripts/runExperiments.ts   케이스 일괄 실행 및 JSON/CSV 생성
artifacts/                  버전 고정 합성 실험 결과
docs/PAPER_v2.md            개정 논문
docs/LEGACY_MODEL_AUDIT.md  ns-capital-flow 재현성 감사
```

## `ns-capital-flow`와의 관계

비공개 분석 저장소의 `capital_flow.py`, `ns_backtest.py`, `ns_dashboard.qmd`에서 금융 변수 후보와 레짐 대시보드 아이디어를 참고했습니다. 하지만 다음은 v2의 실증 결과로 승계하지 않습니다.

- 같은 시점의 `u`를 예측 시작값과 정답에 함께 사용해 얻은 상관계수·방향 정확도
- 당일 VIX/P-E 신호를 당일 수익률에 적용한 백테스트
- `VIX=점도`와 `VIX=외력`의 혼용
- 높은 Reynolds 수를 층류로 정의한 역방향 레짐 라벨
- 실제 forward P/E가 아닌 가격/200일 이동평균의 `P/E proxy` 표기

실증판은 특징을 최소 1일 지연하고, point-in-time 원자료와 expanding walk-forward 평가를 사용해야 합니다.

## 연구 상태

현재 버전은 다음 두 층을 명확히 분리합니다.

1. **구조·정책 실험층:** 앱에 구현 완료. 방정식의 정성적 메커니즘과 반사실을 탐색합니다.
2. **실증 예측층:** 논문 v2의 사전등록 프로토콜. KRX·BOK·BIS·IMF 원자료를 고정한 뒤 별도로 추정해야 합니다.

따라서 이 저장소의 합성 결과는 투자 성과, 실제 KOSPI 예측력, 정책 효과의 인과 추정치가 아닙니다.

## 인용

```bibtex
@article{choi2026stateDependentCapitalFlow,
  title  = {Capital Flow as a State-Dependent Viscous Network},
  author = {Choi, Nakcho},
  year   = {2026},
  note   = {Working paper and open computational artifact}
}
```

MIT License · 교육 및 연구 목적 · 투자 자문 아님
