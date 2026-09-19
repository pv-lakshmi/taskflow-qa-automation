# QA Agent

This directory contains the Phase C requirement-to-scenario workflow. It is
separate from the application and from developer-owned tests under `src/test`.

## Local workflow

```bash
python3 qa/agents/generate_scenarios.py \
  --input qa/requirements/SCRUM-6.json \
  --output qa/scenarios/SCRUM-6.json

python3 qa/agents/approve_scenarios.py \
  --input qa/scenarios/SCRUM-6.json \
  --output qa/scenarios/approved/SCRUM-6.json \
  --reviewed-by your-name

TASKFLOW_BASE_URL=http://127.0.0.1:8081 npm run test:qa
```

The command validates the requirement input, generates reviewable scenarios,
and validates the scenario output. It uses only the Python standard library and
does not require credentials or an external model.

The model-backed agent instructions are in `qa/agents/qa-agent.md`. A future
LLM adapter must produce the same versioned output contract and must not bypass
human review.

The isolated port in the example avoids accidentally reusing an old local
application process. In CI, Playwright starts a fresh Spring Boot server.

## Artifact flow

```text
qa/requirements/*.json
    -> qa/agents/qa-agent.md or generate_scenarios.py
        -> qa/scenarios/*.json
            -> human review
                -> Phase D automation agent
```

Scenario IDs link each generated test back to its Jira story. Generated files
are proposals until the review status is changed by a human or review agent.

## Jira connection

The Jira adapter uses the REST API and defaults to dry-run mode. For live access,
set `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` in the shell or CI secret
store. Set `JIRA_DRY_RUN=false` only when the intended Jira project and issue have
been verified. Never commit these values.