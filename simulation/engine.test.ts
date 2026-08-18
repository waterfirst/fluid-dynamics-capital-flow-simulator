import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SCENARIOS } from '../constants';
import { runScenario, summarizeScenario } from './engine';

describe('network Navier–Stokes engine', () => {
  it('conserves capital across every bundled experiment', () => {
    SCENARIOS.forEach((scenario) => {
      const state = runScenario(scenario);
      assert.ok(state.metrics.massError < 1e-7);
      state.nodes.forEach((node) => assert.ok(node.capital > 0));
    });
  });

  it('is deterministic for a fixed scenario and seed', () => {
    const scenario = SCENARIOS[3];
    const first = runScenario(scenario);
    const second = runScenario(scenario);
    assert.deepEqual(second.history, first.history);
  });

  it('keeps the Hawkes branching ratio in the stable region by default', () => {
    SCENARIOS.forEach((scenario) => {
      const excitation = scenario.parameterOverrides.hawkesExcitation ?? 0.22;
      const decay = scenario.parameterOverrides.hawkesDecay ?? 0.48;
      assert.ok(excitation / decay < 1);
    });
  });

  it('reports policy cost and lower tail stress for the matched backstop case', () => {
    const freeze = SCENARIOS.find((scenario) => scenario.id === 'liquidity-freeze');
    const backstop = SCENARIOS.find((scenario) => scenario.id === 'targeted-backstop');
    if (!freeze || !backstop) throw new Error('Matched policy scenarios are missing');
    const freezeResult = summarizeScenario(freeze, runScenario(freeze));
    const backstopResult = summarizeScenario(backstop, runScenario(backstop));
    assert.ok(backstopResult.policyCost > freezeResult.policyCost);
    assert.ok(backstopResult.maxEquityDrawdown < freezeResult.maxEquityDrawdown);
  });
});
