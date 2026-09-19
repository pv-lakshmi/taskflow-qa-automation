# Architecture

## Application

```text
HTTP client
    -> TaskController
        -> TaskService
            -> TaskRepository
                -> H2
```

- `TaskController` maps CRUD HTTP requests and returns status codes.
- `CreateTaskRequest` and `UpdateTaskRequest` enforce the required title.
- `TaskService` owns lookup, update, and delete behavior.
- `GlobalExceptionHandler` maps validation failures to 400 and missing tasks to 404.
- `Task` is the JPA entity persisted by `TaskRepository`.

## QA onboarding findings

- The REST API is the only user-facing test interface; no UI or external service integration exists yet.
- Existing developer coverage is concentrated in one Spring integration test class and covers the main lifecycle plus a small set of negative cases.
- The highest-risk uncovered behaviors are invalid update requests, deleting a missing task, malformed requests, and the complete response contract.
- H2 is disposable, so QA data should be scenario-owned and reset between scenarios rather than shared across runs.
- Requirement questions such as duplicate-title policy and list ordering must be resolved before they become generated-test assumptions.

## QA system target

The application is the system under test. The planned QA flow is:

```text
Jira story or supplied requirement
    -> QA Agent
        -> structured scenarios
            -> Test Review Agent
                -> approved scenarios
                    -> Automation Agent
                        -> executable API tests
                            -> runner and report
                                -> failure analysis
                                    -> Jira-ready defect or test/environment issue
```

QA artifacts will live outside application code and developer tests, with scenario IDs linking requirements to automation and execution results.

## Phase C QA Agent boundary

```text
qa/requirements/*.json
    -> QA Agent instructions or offline generator
        -> qa/scenarios/*.json
            -> human/Test Review Agent
                -> Phase D automation assets
```

- Requirement inputs follow `qa/schemas/requirement.schema.json`.
- Scenario proposals follow `qa/schemas/scenario-set.schema.json`.
- `qa/agents/generate_scenarios.py` provides a credential-free deterministic fallback for local validation and demonstrations.
- `qa/agents/qa-agent.md` is the model-backed instruction boundary; generated scenarios remain `needs-review` until approved.

## Automation and operations

Playwright uses its API request layer against the REST API because the current
application has no UI. Approved scenario IDs are included in test titles and
reports. Result analysis writes a machine-readable classification artifact, and
the Jira adapter consumes that evidence in dry-run or explicitly enabled live
mode.

GitHub Actions runs developer tests, then QA smoke/API coverage, and uploads
reports. Pull requests receive fast feedback; pushes and scheduled runs provide
broader regression evidence.

## Planned integration points

- Jira story input and defect-ready output.
- Maven or a dedicated QA runner for selective API suites.
- GitHub Actions for pull-request, main-branch, deployment, and scheduled execution.
- Machine-readable results plus human-readable summaries.