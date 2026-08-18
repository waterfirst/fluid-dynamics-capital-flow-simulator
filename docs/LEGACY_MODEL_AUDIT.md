# `ns-capital-flow` 재현성 감사

검토 기준: `waterfirst/ns-capital-flow` commit `e20fdcef3a5c345d047a71d45944be92cbfe6ce2`  
검토일: 2026-08-18

## 결론

기존 저장소는 아이디어 탐색과 시장 대시보드로는 유용하지만, 현재 출력된 `99.4% 방향 정확도`, `r=1.000`, `Sharpe 1.47`, `RMSE 38% 개선`을 논문의 확정 실증 결과로 사용하기에는 부족합니다. 핵심 이유는 예측 시점 정렬, 변수 정의, 기준선, 거래 가능성, 원자료 provenance가 분리되어 있지 않기 때문입니다.

이번 v2는 기존 결과를 삭제하거나 숨기지 않고, **legacy exploratory result**로 격리합니다. 재현 가능한 데이터 스냅샷과 워크포워드 검증을 통과한 뒤에만 새 결과표로 승격합니다.

## 코드 수준 감사

| 위치 | 관찰 | 통계적 영향 | v2 처리 |
|---|---|---|---|
| `ns_backtest.py::simulate()` | 각 날짜의 `row['u']`를 `solve_step()`의 시작값으로 넣은 뒤 같은 `row['u']`를 `u_actual`로 저장 | 예측치가 실제값을 포함하므로 상관이 1에 접근하는 것은 구조적 결과 | `u_t`와 t시점까지의 특징으로 `u_{t+1}` 또는 `u_{t+5}`만 예측 |
| `Backtester.run()` | `vix.iloc[i]`, `pe.iloc[i]`로 가중치를 정하고 같은 `i`의 일간 수익률을 적용 | 종가가 확정되기 전에 당일 정보를 안다는 가정; look-ahead 가능 | t일 종가 신호는 t+1일 체결·수익률부터 적용, 거래비용 포함 |
| `README.md` vs `ns_backtest.py` | README는 `VIX → 점도`; solver는 실현변동성을 점도, VIX를 외력으로 사용 | 계수의 경제적 의미와 반증 조건이 바뀜 | VIX는 글로벌 외력, 지연 spread/depth/impact는 점도로 고정 |
| `README.md` regime | 높은 Re를 층류, 낮은 Re를 난류로 표시 | 표준 Reynolds 해석과 역방향이며 임계값에 근거 없음 | `Re*=|u|L/ν`를 연속 진단값으로만 사용; 레짐 임계값은 데이터로 추정 |
| `compute_pressure()` | `price / MA200 × 12`를 P/E proxy로 명명 | 이 값에는 이익 전망 정보가 없으므로 forward P/E가 아님 | `valuation deviation proxy`로 재명명하거나 KRX/FactSet 실제 forward P/E 사용 |
| `compute_density()` | 삼성전자·SK하이닉스 가격 상대성과 고정 가중치로 반도체 시총 비중을 근사 | 주식수·자사주·지수 free-float 변화가 누락 | KRX index constituent 시총/유동시총 스냅샷 사용 |
| 채권 benchmark | 미 10년물 금리 변화에 임의 `−0.1`을 곱해 채권수익률로 사용 | duration·coupon·환헤지·원화 채권 특성이 반영되지 않음 | 한국 국채 total-return index 또는 실제 ETF adjusted price 사용 |
| 데이터 | `datetime.now()`로 yfinance 재다운로드 | 수정주가·결측·현재 종료일 때문에 결과가 재현 시점마다 달라짐 | 원자료 스냅샷, 해시, 추출일, timezone, release vintage 고정 |
| 전략 | 수수료·spread·slippage·세금 없음 | turnover가 높은 경우 Sharpe와 drawdown 과대평가 | 다음 날 VWAP, 비용 시나리오, turnover와 capacity 보고 |
| 기준선 | 논문 결과표 외에 동일 split의 코드·seed·forecast origin이 불명확 | RMSE 38% 개선의 독립 재현이 어려움 | naïve/AR/VAR/GARCH/Markov/XGBoost를 동일 origin에서 평가 |

## 보존할 자산

- KOSPI 유속, 반도체 집중도, 밸류에이션, 실현변동성, VIX를 한 화면에 묶은 분석 언어
- `capital_flow.py`의 변수 분해와 3D/대시보드 시각화 아이디어
- VIX·valuation 기반 레짐을 정책·연금 운용 문제와 연결한 응용 논점
- `ns_backtest.py`의 힘 분해 도식과 historical episode annotation

## 새 실증 파이프라인

1. 원자료 추출 시점과 해시 고정
2. 모든 특징에 `available_at` timestamp 부여
3. 예측 origin마다 과거 데이터로만 재추정
4. t+1/t+5 flow target을 사전 정의
5. 기준선과 N-S를 같은 표본·origin에서 비교
6. RMSE/MAE뿐 아니라 sudden-stop PR-AUC, Brier score, calibration 보고
7. Diebold–Mariano 검정과 block bootstrap confidence interval 산출
8. crisis leave-one-episode-out와 국가 외부검증 수행
9. 거래전략은 예측 검증과 분리하고 비용·capacity·turnover를 포함

## 결과 승격 규칙

다음 조건을 모두 만족할 때만 논문 초록에 수치를 넣습니다.

- 데이터와 코드가 commit hash로 고정됨
- 모든 특징이 target보다 시간적으로 앞섬
- 최소 3개 기준선 대비 동일 OOS window에서 개선됨
- 점 추정치와 함께 불확실성 구간·표본 수가 제시됨
- 파라미터 선택이 test 구간을 보지 않음
- 별도 시장 또는 별도 위기에서 방향이 재현됨

그 전까지 `99.4%`, `1.000`, `+132.2%`, `38%`는 **탐색 단계의 legacy 수치**로만 기록합니다.
