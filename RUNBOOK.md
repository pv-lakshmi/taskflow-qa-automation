# QA Runbook

## Local prerequisites

- Java 21
- Node 16 or newer for the pinned local Playwright version
- Python 3

CI uses Node 20 and installs the browser dependencies for its locked Playwright
version.

## Generate and review scenarios

```bash
npm run qa:generate
python3 qa/agents/approve_scenarios.py \
  --input qa/scenarios/SCRUM-6.json \
  --output qa/scenarios/approved/SCRUM-6.json \
  --reviewed-by your-name
```

Approval is an explicit action. Do not approve an artifact without reviewing
its requirement coverage and ambiguity notes.

## Run QA automation

Use an isolated port when another TaskFlow process may already be running:

```bash
TASKFLOW_BASE_URL=http://127.0.0.1:8081 npm run test:qa
npm run qa:analyze
```

Selective suites are available through Playwright tags:

```bash
TASKFLOW_BASE_URL=http://127.0.0.1:8081 npm run test:qa:smoke
TASKFLOW_BASE_URL=http://127.0.0.1:8081 npm run test:qa:validation
```

## Failure workflow

1. Preserve `qa/reports/playwright-results.json` and the HTML report.
2. Run `npm run qa:analyze`.
3. Inspect the classification and evidence; do not treat every failure as a product defect.
4. Run `npm run qa:jira:bug` to create a dry-run Jira payload.
5. Set `JIRA_DRY_RUN=false` only after reviewing the payload and confirming the target project.

## CI

`.github/workflows/qa.yml` runs developer tests first, then Playwright API tests,
result analysis, and artifact upload on pull requests, pushes to `main`, manual
runs, and scheduled regression.