# QA Automation Plan

## Scope

Start with the TaskFlow REST API. UI automation is deferred until a UI exists.

## Test layers

- Existing developer tests: fast Spring integration coverage in `src/test`.
- QA smoke: create, list, get, update, and delete happy paths (`smoke`).
- QA validation: blank, missing, null, and malformed request values (`validation`).
- QA negative: missing resources and unsupported behavior (`negative`).
- QA API contract: status, headers, JSON fields, and persistence assertions (`api`).
- QA regression: approved scenarios covering changed API behavior (`regression`).

## Scenario metadata

Each generated scenario should carry a stable scenario ID, Jira requirement reference, title, preconditions, test data, steps, expected result, priority, type, automation status, and tags.

Phase C stores requirement inputs under `qa/requirements/` and scenario sets under `qa/scenarios/`. The contracts are versioned in `qa/schemas/requirement.schema.json` and `qa/schemas/scenario-set.schema.json`. The initial `SCRUM-6` proposal contains eight scenarios and remains explicitly `needs-review`.

## Execution strategy

Selective smoke, validation, and negative checks should provide fast pull-request feedback. Broader API regression should run after merges and on a schedule once suite cost and stability are measured. Deployment checks should verify environment health and critical API paths. Destructive tests require an isolated or resettable environment.

The repository analysis and identified gaps are recorded in `TEST_STRATEGY.md`.

## Failure handling

Failures must be classified before defect creation as application, automation, data, environment, dependency, flaky, or requirement issues. Evidence must include the request, response or assertion, scenario ID, commit, environment, and logs when available. No evidence should be invented.

## Ownership boundaries

The application team owns production behavior and fixes. QA automation owns scenario quality, executable tests, evidence, reporting, and regression decisions. Human review remains required for generated scenarios, generated code, and defect submissions.

## Next design step

Select the API automation approach, map approved scenario metadata to executable tests, and add reusable test helpers without duplicating developer coverage.