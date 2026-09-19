# QA Automation Plan

## Scope

Start with the TaskFlow REST API. UI automation is deferred until a UI exists.

## Test layers

- Existing developer tests: fast Spring integration coverage in `src/test`.
- QA smoke: create, list, get, update, and delete happy paths.
- QA validation: blank or missing titles and malformed requests.
- QA negative: missing resources and unsupported behavior.
- QA regression: approved scenarios covering changed API behavior.

## Scenario metadata

Each generated scenario should carry a stable scenario ID, Jira requirement reference, title, preconditions, test data, steps, expected result, priority, type, automation status, and tags.

## Execution strategy

Selective smoke and API checks should provide fast pull-request feedback. Broader regression should run after merges and on a schedule once suite cost and stability are measured. Deployment checks should verify environment health and critical API paths.

## Failure handling

Failures must be classified before defect creation as application, automation, data, environment, dependency, flaky, or requirement issues. Evidence must include the request, response or assertion, scenario ID, commit, environment, and logs when available. No evidence should be invented.

## Ownership boundaries

The application team owns production behavior and fixes. QA automation owns scenario quality, executable tests, evidence, reporting, and regression decisions. Human review remains required for generated scenarios, generated code, and defect submissions.

## Next design step

Complete repository analysis, identify coverage gaps, and define a versioned JSON scenario schema before implementing the QA Agent.