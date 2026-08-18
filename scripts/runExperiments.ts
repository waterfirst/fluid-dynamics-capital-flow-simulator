import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SCENARIOS } from '../constants';
import { runScenario, summarizeScenario } from '../simulation/engine';

const results = SCENARIOS.map((scenario) => summarizeScenario(scenario, runScenario(scenario)));
const outputDirectory = resolve('artifacts');
mkdirSync(outputDirectory, { recursive: true });

writeFileSync(
  resolve(outputDirectory, 'scenario-results.json'),
  `${JSON.stringify({ generatedBy: 'npm run experiments', modelVersion: '2.0.0', results }, null, 2)}\n`,
);

const columns: (keyof (typeof results)[number])[] = [
  'scenarioId', 'scenarioName', 'peakOutflow', 'maxEquityDrawdown', 'peakStress',
  'peakReynolds', 'meanViscosity', 'recoveryStep', 'hhiChange', 'policyCost', 'massError',
];
const csv = [
  columns.join(','),
  ...results.map((row) => columns.map((column) => {
    const value = row[column];
    return typeof value === 'string' ? `"${value.split('"').join('""')}"` : (value ?? '');
  }).join(',')),
].join('\n');
writeFileSync(resolve(outputDirectory, 'scenario-results.csv'), `${csv}\n`);

results.forEach((result) => {
  process.stdout.write(
    `${result.scenarioName.padEnd(24)} DD=${(result.maxEquityDrawdown * 100).toFixed(1)}% `
    + `stress=${result.peakStress.toFixed(2)} Re=${result.peakReynolds.toFixed(2)}\n`,
  );
});
