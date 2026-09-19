const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || 'qa/reports/playwright-results.json';
const outputPath = process.argv[3] || 'qa/reports/failure-analysis.json';

if (!fs.existsSync(inputPath)) {
  console.error(`Result file not found: ${inputPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const flattened = [];

function visit(suite) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const result = test.results?.[test.results.length - 1] || {};
      const title = spec.title || '';
      const match = title.match(/(SCRUM-\d+-S\d+)/);
      flattened.push({
        scenarioId: match ? match[1] : null,
        title,
        status: test.status || result.status || 'unknown',
        error: result.error?.message || null,
        durationMs: result.duration || 0,
        classification: classify(result.error?.message || '')
      });
    }
  }
  for (const child of suite.suites || []) visit(child);
}

for (const suite of report.suites || []) visit(suite);

const output = {
  schemaVersion: '1.0',
  generatedAt: new Date().toISOString(),
  source: inputPath,
  summary: {
    total: flattened.length,
    passed: flattened.filter((item) => item.status === 'expected' || item.status === 'passed').length,
    failed: flattened.filter((item) => item.status === 'unexpected' || item.status === 'failed').length
  },
  results: flattened
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Analyzed ${flattened.length} test results: ${output.summary.failed} failures`);

function classify(message) {
  if (!message) return 'passed';
  if (/expect\(|assert|received|expected/i.test(message)) return 'application-defect-or-contract';
  if (/timeout|ECONNREFUSED|ENOTFOUND|Target page|server/i.test(message)) return 'environment-issue';
  if (/locator|selector|test\.js|spec\.js/i.test(message)) return 'automation-defect';
  return 'needs-review';
}