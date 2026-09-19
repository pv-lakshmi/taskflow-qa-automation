# Progress

## Current phase

Portfolio demo and lifecycle hardening.

## Completed

- Phase A: Existing application baseline.
- Added Task CRUD REST endpoints backed by Spring Data JPA and H2.
- Added request validation and consistent 400/404 JSON errors.
- Added developer-owned MockMvc integration coverage.
- Added basic run and API documentation.
- Phase B: QA onboarding and repository analysis.
- Documented application/test inventory, testable interfaces, coverage gaps, requirement questions, test categories, and ownership boundaries.
- Phase C: QA Agent design and implementation.
- Added versioned JSON requirement and scenario contracts.
- Added the `SCRUM-6` Jira-style requirement fixture and generated scenario set.
- Added model-backed QA Agent instructions plus a credential-free local generator and validator.
- Phase D: Added Playwright API automation using approved JSON scenarios.
- Phase E: Added JSON/HTML reporting and failure analysis.
- Phase F: Added failure classification and Jira-ready bug payload generation.
- Phase G: Added changed-file regression selection.
- Phase H: Added GitHub Actions for PR, main, manual, and scheduled execution.
- Phase I: Added Jira REST read, publish, and bug commands with dry-run default.

## Application baseline: COMPLETE

From this point onward, treat TaskFlow as an inherited application. The primary role is QA Automation Engineer, and application changes require a defect, testability need, explicit requirement, or automation infrastructure need.

## Validation

- `./mvnw test` passes: 5 tests, 0 failures, 0 errors.

## Important files

- `src/main/java/com/taskflow/controller/TaskController.java`: HTTP API.
- `src/main/java/com/taskflow/service/TaskService.java`: task behavior and persistence boundary.
- `src/test/java/com/taskflow/TaskflowApplicationTests.java`: existing developer-owned API tests.
- `README.md`: local run and API reference.
- `TEST_STRATEGY.md`: Phase B repository analysis and coverage strategy.
- `qa/agents/qa-agent.md`: QA Agent generation and review instructions.
- `qa/agents/generate_scenarios.py`: offline scenario generator and validator.
- `qa/scenarios/SCRUM-6.json`: generated, traceable scenario proposal.
- `qa/automation/api/tasks.spec.js`: Playwright API automation.
- `qa/agents/analyze-results.js`: result classification.
- `qa/integrations/jira.js`: Jira REST adapter.
- `.github/workflows/qa.yml`: CI orchestration.

## Blockers

No implementation blockers. Live Jira operations require user-provided environment variables and remain disabled by default.

## Next major action

Use the generated workflow as the portfolio demo, add more Jira requirements,
and extend the approved scenario-to-Playwright mapping as the system grows.