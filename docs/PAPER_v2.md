# Capital Flow as a State-Dependent Viscous Network

## A Falsifiable Navier–Stokes Reduced-Form Framework for Sudden Stops, Liquidity Freezes, and Policy Counterfactuals in Korea

**Nakcho Choi**  
Korea University Sejong Campus  
Correspondence: nakcho.choi@gmail.com  
Working paper v2.0 · 18 August 2026

---

## Abstract

This paper develops a falsifiable reduced-form model of capital flow dynamics inspired by, but not identified with, the Navier–Stokes equations. Financial markets are represented as a directed network whose nodes hold capital stocks and whose edges carry flows. A graph momentum equation combines relative valuation pressure, nonlinear advection, state-dependent viscosity, transaction friction, global external forces, and self-exciting flow contagion; a companion continuity equation conserves capital across the closed augmented network. The principal theoretical extension is to treat market viscosity as a testable lagged state process rather than a fixed coefficient or a contemporaneous synonym for volatility. At the microstructure scale, aggressive-order clustering enters through a stationary Hawkes process. Deterministic chaos, including a Rössler attractor, is excluded from the core model because its out-of-sample contribution is difficult to distinguish from stochastic dynamics.

The Korean market is a useful laboratory because global dollar conditions, large nonresident portfolio positions, concentrated technology exposure, deep domestic institutions, and active FX hedging coexist. The 2026 update also incorporates the increasing importance of nonbank financial intermediaries, sovereign-market liquidity, global FX internalisation, and Korea's rapid expansion in outward portfolio investment. Seven transparent synthetic experiments show how endogenous viscosity and Hawkes amplification can turn a common shock into a liquidity freeze, while a targeted backstop reduces peak cross-border outflow from 37.5 to 24.1 normalized units and equity-capital drawdown from 35.7% to 22.3%, at a positive policy cost and without full recovery within the simulated horizon. These are structural counterfactuals, not historical estimates.

Earlier results reporting 99.4% direction accuracy, correlation of 1.000, a 38% RMSE improvement, and a Sharpe ratio of 1.47 are not repeated as confirmed findings. A code audit shows that contemporaneous target information and same-day allocation may have entered those calculations. The revised empirical protocol therefore requires point-in-time data, lagged features, expanding-window forecasts, naïve/AR/VAR/volatility/regime baselines, block-bootstrap uncertainty, Diebold–Mariano comparisons, and independent market validation before predictive claims are restored.

**JEL:** C32, C53, F32, G01, G15, G23  
**Keywords:** capital flows; Navier–Stokes; liquidity; sudden stops; Hawkes process; nonbank financial intermediation; Korea; econophysics; model validation

---

## 1. Introduction

Capital flows often display three properties that are awkward for linear, constant-parameter descriptions: they accelerate nonlinearly, propagate through connected markets, and change the liquidity conditions through which they move. During calm periods, a shock can be dispersed through market-making, derivatives, banks, and institutional balance sheets. During stress, the same nominal shock can trigger widening spreads, declining depth, margin calls, fund redemptions, and correlated selling. The transmission medium is therefore not fixed.

Fluid dynamics offers a disciplined vocabulary for momentum, pressure, friction, diffusion, forcing, and conservation. It does not imply that investors are molecules, that capital is literally incompressible, or that a financial Reynolds number proves physical turbulence. The useful research question is narrower:

> Can a conservation-constrained nonlinear network model improve explanation, forecasting, and policy counterfactual analysis after its additional flexibility is penalized and tested out of sample?

This paper revises the original SSRN working paper, *Capital as a Viscous Fluid*, in five ways.

1. It replaces a one-dimensional time-difference analogy with a graph model whose spatial dimension is an observable market network.
2. It distinguishes viscosity, volatility, external force, and pressure rather than using the same variable in multiple roles.
3. It makes viscosity state-dependent and empirically testable using lagged depth, spread, and price-impact information.
4. It isolates a Hawkes process as the microstructure contagion mechanism and removes deterministic chaos from the core specification.
5. It separates structural simulation from empirical forecasting and discloses why earlier performance figures require re-estimation.

This repositioning also narrows the novelty claim. A Navier–Stokes-like equation of motion for capital markets was proposed by Moffat in 1999, and more recent work has applied fluid analogies to liquidity and systemic risk. The contribution here is not the first use of a fluid metaphor. It is the combination of a Korean capital-flow application, state-dependent viscosity, scale-separated Hawkes forcing, a conservation-constrained network solver, and an explicit falsification protocol delivered as an open interactive artifact.

## 2. Current macrofinancial motivation

The international monetary system changed materially after the global financial crisis. BIS analysis published in 2026 documents a shift from cross-border bank loans toward bonds and equities, a greater role for local-currency financing, larger gross international positions, and expanded intraregional portfolio investment. These changes can increase resilience but also alter the topology and speed of shock transmission.

Three current facts are especially relevant to the model.

### 2.1 Nonbanks change the transmission medium

The IMF's April 2026 *Global Financial Stability Report* emphasizes that cross-border portfolio flows to emerging markets are largely intermediated by nonbank financial institutions and remain sensitive to global risk sentiment. The BIS 2026 Annual Economic Report adds that leveraged and funding-dependent nonbanks can transmit sovereign-bond repricing through repo, funding, and bank–nonbank links. Market liquidity may appear ample for long intervals and then deteriorate abruptly. This is precisely the environment in which a constant viscosity parameter is least credible.

### 2.2 FX markets can absorb as well as amplify shocks

The BIS reported average global FX turnover of USD 9.5 trillion per day in April 2025, 27% above April 2022. Around the April tariff announcements, derivatives hedging and dealer internalisation absorbed part of the client flow without equivalent sales of underlying assets. A capital-flow network must therefore include FX swaps, dealers, and internal balance-sheet channels; a direct shock-to-equity equation misses this buffering topology.

### 2.3 Korea is both receiver and exporter of portfolio capital

The Bank of Korea reported that Korean outward portfolio investment reached USD 140.3 billion in 2025, more than twice the USD 67.0 billion recorded in 2024. Korea should not be modeled as a passive recipient of global flows. Resident outflows, foreign inflows, hedging demand, institutional rebalancing, and reserve operations can respond differently to the same dollar shock. The simulator therefore distinguishes domestic equity, bonds, KRW/FX funding, banks, nonbanks, real assets, global dollars, and reserves.

## 3. Research questions and hypotheses

**RQ1 — Incremental predictive content.** Does the network momentum model improve genuine out-of-sample forecasts of foreign net flows or flow reversals relative to naïve, AR, VAR, volatility, and regime-switching baselines?

**H1.** Any improvement should be concentrated in nonlinear stress episodes; average-period gains may be small after parameter penalties.

**RQ2 — Viscosity as state or outcome.** Do lagged order-book depth, spreads, Amihud impact, dealer capacity, and funding conditions predict future flow resistance after controlling for current order flow and volatility?

**H2.** A state-dependent viscosity equation should improve likelihood and tail calibration relative to fixed viscosity only when lagged liquidity contains incremental information. If contemporaneous flow fully explains it, viscosity is an outcome variable and the analogy should be weakened.

**RQ3 — External forcing across scales.** Does a Hawkes process improve the description of aggressive-order contagion at intraday horizons without being assumed to transfer to daily macro flows?

**H3.** Hawkes forcing should help at event time, while daily macro forcing should remain dominated by VIX, dollar, rate, geopolitical, and policy variables.

**RQ4 — Policy counterfactual.** Can targeted liquidity support reduce peak outflow and drawdown with less policy cost than a broad injection?

**H4.** Backstops directed to network bottlenecks should dominate uniform support when the network and liquidity state are correctly identified; misspecified targeting can merely shift risk.

**RQ5 — Analogy falsification.** Does the model retain value after replacing fluid labels with mathematically equivalent nonlinear network terms?

**H5.** If performance depends on labels rather than restrictions—conservation, graph diffusion, nonlinear drag, and state-dependent friction—the physical analogy is presentational rather than explanatory.

## 4. Model

### 4.1 Market network

Let $G=(V,E)$ be a directed graph. Node $i\in V$ holds capital $C_{i,t}$; edge $e\in E$ has normalized capacity $a_e$, length $\ell_e$, and velocity $u_{e,t}$. The oriented incidence matrix $B$ is $+1$ at the source and $-1$ at the destination. Edge flow is

$$
q_t=A u_t, \qquad A=\operatorname{diag}(a_e).
$$

The empirical graph can be defined by actual claims, fund holdings, bank–NBFI exposures, FX-swap positions, or statistically estimated spillover links. The interactive artifact uses a transparent eight-node topology.

### 4.2 Continuity equation

For a closed augmented network,

$$
C_{t+1}=C_t-\Delta t\,Bq_t. \tag{1}
$$

The Korean subgraph is open: capital can move to the global-dollar and reserve nodes. The augmented graph is closed, so total simulated capital is conserved. For empirical work, net credit creation, issuance, default, writedown, and valuation effects enter as a source term $s_t$:

$$
C_{t+1}=C_t-\Delta t\,Bq_t+s_t. \tag{2}
$$

Equation (1) is a numerical invariant in the simulator; Equation (2) is required for longer-horizon macro data. This distinction prevents the false claim that financial capital is literally incompressible.

### 4.3 Pressure

Let $x_{i,t}=C_{i,t}/C_i^*-1$ be the capital gap relative to a reference stock. The structural simulator uses

$$
p_{i,t}=\kappa_p\left[\kappa_c x_{i,t}+\eta\,\operatorname{sign}(x_{i,t})x_{i,t}^2+v_{i,t}\right], \tag{3}
$$

where $v_{i,t}$ is a relative valuation or funding-pressure component. The quadratic term allows crowding pressure to rise faster than the capital gap. In empirical estimation, $v$ should use actual forward earnings yield, term premium, cross-currency basis, hedge cost, or credit spread—not a price/200-day-average ratio mislabeled as forward P/E.

### 4.4 Network momentum

The edge-velocity update is

$$
\begin{aligned}
u_{t+1}=u_t+\Delta t\,[
&\kappa_p B^\top p_t
+D L_E u_t
-\alpha u_t\odot |u_t|\\
&-\{\chi_t+\chi_c I_{XB}\}\odot u_t
-\nu_{e,t}\odot u_t/\ell_e^2
+\kappa_f F_{e,t}+\varepsilon_{e,t}],
\end{aligned} \tag{4}
$$

where $L_E$ is an edge-neighborhood diffusion operator, $\alpha$ controls nonlinear drag, $\chi_t$ is transaction friction, $\chi_c$ applies to cross-border edges, and $F$ is external acceleration. The sign convention makes positive velocity move from an edge's source to its destination. Velocity and per-step outflow are bounded in the numerical artifact to prevent an explicit step from exhausting a node.

Equation (4) is a reduced-form nonlinear graph equation. Its terms correspond to recognizable mechanisms, but the coefficients are normalized and must be estimated or calibrated before quantitative interpretation.

### 4.5 State-dependent viscosity

The key extension is

$$
\nu_{i,t}=\frac{\nu_0\{1+\gamma_\nu S_{i,t-1}+\gamma_L L_{i,t-1}\}}{Depth_{i,t-1}}, \tag{5}
$$

where $S$ is lagged market stress and $L$ is lagged leverage or funding pressure. Edge viscosity is the average of its incident nodes. The lag is essential: if same-period depth and spread are used, viscosity can be mechanically caused by the flow being explained.

Three nested models should be estimated:

- $M_0$: fixed $\nu$;
- $M_1$: lagged observable state $\nu_t$;
- $M_2$: latent state-space $\nu_t$ jointly filtered with flows.

The state interpretation survives only if $M_1$ or $M_2$ improves future-flow prediction and likelihood after controlling for order flow, volatility, time-of-day, and event dummies.

### 4.6 Hawkes external force

At event or intraday frequency, aggressive orders arrive in clusters. A discrete exponential Hawkes approximation is

$$
\lambda_t=\mu+(\lambda_{t-1}-\mu)e^{-\beta_H\Delta t}
+\alpha_H(J_t+M_{t-1})\Delta t, \tag{6}
$$

where $J_t$ is an exogenous event impulse and $M_{t-1}$ is a normalized recent flow burst. Stationarity requires the branching ratio

$$
n_H=\alpha_H/\beta_H<1. \tag{7}
$$

The simulator exposes $n_H$ and warns when the user crosses the stable region. This mapping is conceptually cleaner than treating VIX itself as viscosity: VIX and dollar/rate shocks belong in macro external force; order clustering belongs in Hawkes intensity; spread/depth/impact belong in viscosity.

### 4.7 Policy term

A policy backstop adds targeted attractiveness to nodes under negative stress:

$$
f^{policy}_{i,t}=\phi\,w_i[-f^{shock}_{i,t}]_+\,[S_t-s_0]_+. \tag{8}
$$

$w_i$ is a targeting weight and $\phi$ the intensity. Policy cost accumulates with intensity and stress. Equation (8) is not an estimated welfare function; it allows transparent comparison of stabilization and resource use.

### 4.8 Diagnostic Reynolds number

The internal diagnostic is

$$
Re^*_{e,t}=\frac{|u_{e,t}|\ell_e}{\nu_{e,t}}. \tag{9}
$$

Higher $Re^*$ means inertial flow is large relative to modeled damping. It is not assigned universal thresholds such as 20, 30, or 50, and it does not prove physical turbulence. Regime thresholds must be estimated within each market and frequency. Earlier documentation that labeled high $Re$ as laminar and low $Re$ as turbulent is reversed relative to the standard ratio and is not retained.

## 5. Parameterization and interactive implementation

| Block | Parameter | Interpretation | Default range in app |
|---|---|---|---:|
| Fluid | $\nu_0$ | baseline friction/viscosity | 0.05–0.80 |
| Fluid | $\gamma_\nu$ | stress-to-viscosity endogeneity | 0–1.80 |
| Pressure | $\kappa_p$ | pressure acceleration | 0.10–1.50 |
| Pressure | $\kappa_c$ | crowding elasticity | 0.10–1.80 |
| Momentum | $\alpha$ | nonlinear advection/drag | 0–0.90 |
| Network | $D$ | edge-neighborhood diffusion | 0–0.80 |
| Shock | scale, $\beta_f$ | shock magnitude and decay | 0–2; 0.01–0.20 |
| Hawkes | $\alpha_H,\beta_H$ | excitation and decay | 0–0.47; 0.20–0.90 |
| Balance sheet | $\lambda_L$ | leverage amplification | 0–1.50 |
| Policy | $\phi$ | targeted backstop | 0–1.20 |
| Friction | $\chi_c,\chi_t$ | cross-border and transaction friction | 0–0.60 |
| Noise | $\sigma$ | deterministic-seed stochastic perturbation | 0–0.08 |

The React application executes the same pure TypeScript engine for animation and batch comparison. Three.js renders node size as capital, node emission as force, particle direction as signed flow, line intensity as velocity, and the accompanying panels report outflow, drawdown, stress, viscosity, $Re^*$, and conservation error. The scene is diagnostic: visual complexity is tied to model state rather than decorative motion.

## 6. Synthetic case experiments

All cases use the same network, solver, and fixed random seed per scenario. They are designed to compare mechanisms, not fit historical observations.

| Experiment | Peak outflow | Equity-capital DD | Peak stress | Peak $Re^*$ | 95% recovery after shock | Policy cost |
|---|---:|---:|---:|---:|---:|---:|
| Orderly global cycle | 1.8 | 0.0% | 0.19 | 1.27 | 1 step | 0.2 |
| 2020-type pandemic stop | 26.0 | 17.5% | 0.55 | 4.27 | 111 steps | 29.1 |
| 2022-type rate/dollar shock | 21.7 | 9.7% | 0.49 | 4.66 | 67 steps | 12.3 |
| 2025-type tariff/FX hedge | 15.5 | 13.5% | 0.41 | 3.67 | 86 steps | 2.9 |
| 2026 NBFI/sovereign stress | 25.4 | 10.6% | 0.44 | 4.33 | 94 steps | 14.9 |
| Endogenous-viscosity freeze | 37.5 | 35.7% | 0.81 | 5.40 | not recovered | 2.0 |
| Matched targeted backstop | 24.1 | 22.3% | 0.53 | 3.82 | not recovered | 21.0 |

### 6.1 Mechanism findings

The liquidity-freeze experiment generates the largest outflow, drawdown, and stress because lagged negative pressure, rising endogenous viscosity, leverage, and Hawkes amplification reinforce one another. Increased viscosity slows reallocation through some paths but also concentrates pressure and makes the remaining high-capacity exit routes more dominant. Thus “more viscosity means less flow” is not generally true in a network.

The matched policy case reduces peak outflow by 13.5 units (36%) and drawdown by 13.5 percentage points, but policy cost rises from 2.0 to 21.0 and the system still fails to recover 95% of initial equity capital inside 150 steps. The appropriate conclusion is a trade-off, not policy dominance. A longer horizon, alternative targeting weights, and welfare loss function are needed.

The 2025 FX-hedging case combines lower baseline viscosity with stronger network diffusion, representing dealer internalisation and derivatives substitution. Its peak outflow is lower than the 2020 and 2026 stress cases, consistent with an absorber topology, but this qualitative match is not an empirical validation.

### 6.2 Required robustness experiments

1. Fixed versus state-dependent viscosity with all other coefficients held equal.
2. Hawkes excitation set to zero, then varied below and above $n_H=1$.
3. Leverage and network links removed one block at a time.
4. Policy applied early, late, uniformly, and only at the highest-betweenness nodes.
5. Alternative graph topologies from claims, holdings, and Granger spillovers.
6. Time-step halving and capacity scaling to demonstrate numerical stability.
7. Open-system source term for issuance, default, and valuation changes.

## 7. Empirical design

### 7.1 Outcomes

Primary daily outcomes should be measured directly rather than inferred from returns:

- foreign net purchases by market and security class;
- resident foreign-asset purchases;
- bond and equity fund flows;
- KRW spot/forward/FX-swap flow when obtainable;
- dealer or investor-type positions;
- Forbes–Warnock surge, stop, flight, and retrenchment labels.

Returns are outcomes or pressure responses, not a default synonym for capital flow velocity.

### 7.2 Candidate data sources

| Variable | Preferred source | Frequency | Availability rule |
|---|---|---|---|
| KOSPI/KOSDAQ investor net trading | KRX Data System | daily/intraday | exchange timestamp |
| Foreign holdings and index free float | KRX | daily/monthly | published snapshot |
| Balance of payments and IIP | Bank of Korea ECOS | monthly/quarterly | release vintage |
| KRW, rates, reserves, cross-border positions | BOK/BIS | daily–quarterly | release vintage |
| VIX | Cboe/FRED | daily | prior close for next-day forecast |
| Global dollar, US yields, oil | FRED/BIS/official exchanges | daily | prior close |
| Forward P/E and earnings yield | KRX or licensed point-in-time vendor | daily/monthly | no revised future earnings |
| Spread, depth, order events | KRX licensed microstructure data | event time | exchange sequence |
| Bank–NBFI and fund leverage | BOK/FSS/FSB/BIS | monthly/quarterly | publication lag |

Every observation receives `event_time`, `available_at`, `source`, `vintage`, `timezone`, and a raw-file hash.

### 7.3 Forecast protocol

For forecast origin $t$, features may use only information with `available_at ≤ t`. The primary targets are $q_{t+1}$ and cumulative $q_{t+1:t+5}$. Models are retrained on an expanding window. A possible initial design is training through 2018, validation in 2019–2022, and untouched testing in 2023–2026, supplemented by rolling origins and crisis leave-one-episode-out tests.

Required baselines are:

- zero-flow and last-observation naïve forecasts;
- AR and regularized VAR;
- local projection or distributed lag model;
- GARCH/stochastic-volatility and Markov-switching models;
- gradient-boosted trees using the same lagged information set;
- N-S model without each major term for ablation.

Report RMSE and MAE for continuous flow, directional accuracy with a no-change band, Brier score and calibration for sudden-stop probability, and precision–recall AUC for rare events. Use block-bootstrap confidence intervals and Diebold–Mariano tests with loss differentials adjusted for overlapping horizons. Hyperparameters are selected only in training/validation windows.

### 7.4 Portfolio layer

Forecast validation and investment backtesting are separate exercises. A strategy may use only a signal known before execution. Signals computed at close $t$ are applied no earlier than the next tradable price on $t+1$. Report commissions, spread, slippage, tax, turnover, capacity, stale prices, delistings, currency hedging, and Korean bond total-return data. Compare to feasible KRW benchmarks. The original backtest's same-day VIX/P-E allocation and inverse US-yield bond proxy are insufficient for an investable claim.

### 7.5 Microstructure extension

The microstructure model is not a rescaled daily model. It requires independent event-time estimation:

1. Estimate a state-dependent multivariate Hawkes model for market orders, limit orders, and cancellations.
2. Model future price impact or edge-flow resistance using lagged spread/depth state.
3. Test whether liquidity state Granger-causes future impact after order-flow controls.
4. Compare Hawkes, Poisson, autoregressive point-process, and neural point-process baselines.
5. Validate on separate days, assets, and volatility regimes.

The Rössler attractor is excluded. It may enter a supplementary feature-ablation study only if it beats stochastic nonlinear baselines on untouched data and its parameters are stable across assets. If it merely improves an LSTM/XGBoost feature vector, the fluid interpretation no longer constrains the model and must be described as presentation rather than mechanism.

## 8. Audit of earlier computational claims

The companion repository `waterfirst/ns-capital-flow` contains useful exploratory code and motivated this revision. It also reveals why the earlier results should be re-estimated.

1. In `ns_backtest.py`, `solve_step(row)` starts from the current row's observed `u`, and the same row's `u` is stored as `u_actual`. The predicted value is therefore the observed target plus a damped force correction, mechanically producing near-perfect correlation.
2. Portfolio weights are selected using `vix[i]` and `pe[i]` and applied to return `i`. Without a documented pre-open timestamp, this is same-day look-ahead.
3. Documentation maps VIX to viscosity while the solver maps realized volatility to viscosity and VIX to external force.
4. The stated Reynolds regime direction is inconsistent across files and with the standard ratio.
5. `price/MA200 × 12` is not a forward P/E ratio.
6. Dynamic yfinance downloads, an approximate bond return, and missing transaction costs prevent exact replication.

The complete file-level audit and result-promotion rules are in [`LEGACY_MODEL_AUDIT.md`](LEGACY_MODEL_AUDIT.md). This disclosure is a strength: the revised paper turns an attractive analogy into a research program with clear failure conditions.

## 9. Identification, interpretation, and limitations

### 9.1 The parameters are reduced-form

Financial viscosity does not share physical units with molecular viscosity. Pressure, density, and Reynolds diagnostics are normalized constructs. Structural language is justified only to the extent that restrictions—conservation, graph diffusion, nonlinear drag, state dependence—survive falsification.

### 9.2 Capital is not conserved at every horizon

Credit creation, issuance, default, writedown, dividends, and valuation change alter measured capital. The augmented closed network is appropriate for short structural experiments; empirical macro work needs source term $s_t$ and stock-flow reconciliation.

### 9.3 Agents are strategic

Investors anticipate policy and one another. Regulation and market design change behavior. Lucas critique, reflexivity, and strategic order placement have no passive-fluid equivalent. Expectations may be added as state variables, but doing so increases identification burden.

### 9.4 Viscosity is potentially endogenous

Spread and depth are traded outcomes. Lagging them is necessary but may not be sufficient. Plausible instruments include predetermined fee/tick-size changes, market-maker obligations, settlement disruptions, and cross-market liquidity shocks, subject to exclusion restrictions. State-space estimation and local projections can provide complementary evidence.

### 9.5 Rare crises limit power

Sudden stops are infrequent and definitions vary. Direction accuracy can look high in imbalanced samples. Precision–recall, calibration, crisis-level resampling, and cross-country validation are more informative than a single average RMSE.

### 9.6 Simulation is not estimation

The seven app scenarios demonstrate mechanisms and numerical invariants. They are not calibrated reproductions of 2020, 2022, 2025, or 2026. Historical labels indicate economic motifs, not fitted event magnitudes.

## 10. Policy and economic implications

The framework generates several testable policy propositions.

- **Liquidity support should target topology, not only price.** Nodes with high betweenness, low depth, and large cross-border capacity can transmit stress disproportionately.
- **High viscosity can coexist with fast exit through a few channels.** Aggregate turnover may fall while concentrated FX or fund-redemption routes accelerate.
- **Resident and nonresident flows should be separated.** Stronger EME balance sheets and outward investment can make responses more symmetric, but drivers remain different.
- **Derivatives can absorb underlying sales while creating funding dependence.** FX internalisation reduces immediate market impact but may relocate risk to dealer balance sheets and margin channels.
- **Backstop success needs a cost and recovery criterion.** Reducing peak outflow alone can leave the system below its pre-shock capital distribution.
- **Capital controls are edge friction, not a scalar cure.** Controls may slow targeted paths and divert flow to substitutes; leakage is a network response.

## 11. Conclusion

The value of a fluid framework is not that finance behaves exactly like water. Its value is that momentum, conservation, diffusion, friction, forcing, and network topology can be written as explicit restrictions and then rejected if the data do not support them.

The revised model makes three substantive commitments. First, viscosity is a lagged and falsifiable state process. Second, Hawkes contagion is reserved for the scale at which event clustering is observed. Third, predictive and investment claims are withheld until time alignment, benchmarks, uncertainty, and external validation are complete. The interactive simulator already provides a reproducible laboratory for mechanism and policy experiments; the empirical paper will be strongest when it reports fewer spectacular numbers and more defensible tests.

## Data and code availability

- Interactive artifact and TypeScript solver: <https://github.com/waterfirst/fluid-dynamics-capital-flow-simulator>
- Original exploratory analytics: private repository `waterfirst/ns-capital-flow`, commit audited in `LEGACY_MODEL_AUDIT.md`
- Original working paper: <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6510038>
- Scenario results: `artifacts/scenario-results.json` and `artifacts/scenario-results.csv`

## References

Bank for International Settlements. (2025). *Global FX markets when hedging takes centre stage*. BIS Quarterly Review, December. <https://www.bis.org/publ/qtrpdf/r_qt2512b.htm>

Bank for International Settlements. (2026a). *Capital flows, exchange rates and financial conditions in EMEs in an evolving international monetary system*. BIS Papers No. 171. <https://www.bis.org/publ/bppdf/bispap171_a_rh.pdf>

Bank for International Settlements. (2026b). *High public debt and shifting financial markets: challenges for central banks*. Annual Economic Report 2026, Chapter II. <https://www.bis.org/publ/arpdf/ar2026e2.htm>

Bank of Korea. (2026). *The Effects of Overseas Investment and Investment Income on the Exchange Rate*, BOK Issue Note 2026-15. <https://www.bok.or.kr/eng/main/main.do>

Calvo, G. A. (1998). Capital flows and capital-market crises: The simple economics of sudden stops. *Journal of Applied Economics*, 1(1), 35–54.

Choi, N. (2026). *Capital as a Viscous Fluid: A Navier–Stokes Framework for Modeling Sudden Stops and Flow Reversals in the Korean Financial Market*. SSRN. <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6510038>

Forbes, K. J., & Warnock, F. E. (2012). Capital flow waves: Surges, stops, flight, and retrenchment. *Journal of International Economics*, 88(2), 235–251. <https://www.nber.org/papers/w17351>

Forbes, K. J., & Warnock, F. E. (2021). Capital flow waves—or ripples? Extreme capital flow movements since the crisis. *Journal of International Money and Finance*, 116, 102394. <https://dspace.mit.edu/handle/1721.1/138658>

Gondauri, D. (2025). Modeling the dynamics of liquidity flows and systemic risks in financial markets using the Navier–Stokes equations. *SocioEconomic Challenges*, 9(2). <https://armgpublishing.com/journals/sec/volume-9-issue-2/article-6/>

Hawkes, A. G. (1971). Spectra of some self-exciting and mutually exciting point processes. *Biometrika*, 58(1), 83–90.

International Monetary Fund. (2026). *Global Financial Stability Report: Global Financial Markets Confront the War in the Middle East and Amplification Risks*. <https://www.imf.org/en/publications/gfsr/issues/2026/04/14/global-financial-stability-report-april-2026>

Moffat, J. W. (1999). A dynamical model of the capital markets. *Physica A*, 264(3–4), 532–542. <https://doi.org/10.1016/S0378-4371(98)00453-1>

Morariu-Patrichi, M., & Pakkanen, M. S. (2022). State-dependent Hawkes processes and their application to limit order book modelling. *Quantitative Finance*, 22(3), 563–583. <https://doi.org/10.1080/14697688.2021.1983199>

Rey, H. (2015). *Dilemma not trilemma: The global financial cycle and monetary policy independence*. NBER Working Paper 21162. <https://www.nber.org/papers/w21162>

Xu, H. C., Zhang, W., Xiong, X., & Zhou, W.-X. (2020). Modeling aggressive market order placements with Hawkes factor models. *PLOS ONE*, 15(1), e0226303. <https://pmc.ncbi.nlm.nih.gov/articles/PMC6953867/>
