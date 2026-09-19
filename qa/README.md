# QA Agent

This directory contains the Phase C requirement-to-scenario workflow. It is
separate from the application and from developer-owned tests under `src/test`.

## Local workflow

```bash
python3 qa/agents/generate_scenarios.py \
  --input qa/requirements/SCRUM-6.json \
  --output qa/scenarios/SCRUM-6.json
```

The command validates the requirement input, generates reviewable scenarios,
and validates the scenario output. It uses only the Python standard library and
does not require credentials or an external model.

The model-backed agent instructions are in `qa/agents/qa-agent.md`. A future
LLM adapter must produce the same versioned output contract and must not bypass
human review.

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