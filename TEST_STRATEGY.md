# QA Onboarding Test Strategy

## System under test

TaskFlow is a Spring Boot 4.1.1 REST API running on Java 21. The primary testable interface is the HTTP API at `/tasks`; the application uses Spring Data JPA and an in-memory H2 database for local and test execution.

## Repository inventory

| Area | Current implementation | QA implication |
| --- | --- | --- |
| HTTP boundary | `TaskController` exposes create, list, get, update, and delete | API tests can assert status, headers, JSON, and state transitions |
| Validation | Request DTOs require a nonblank `title` | Exercise blank, missing, null, and valid title values |
| Error mapping | `GlobalExceptionHandler` maps validation and missing-task errors | Assert stable error status and useful response fields |
| Domain behavior | `TaskService` delegates persistence and handles lookups | Unit tests may be useful for branching, but API tests currently provide the main baseline |
| Persistence | `TaskRepository` backed by H2 | Verify create/update/delete state and empty-database behavior |
| UI | None present | Do not add Playwright or browser coverage yet |
| External integrations | None in the application | Jira and CI integration should begin with file-based contracts |

## Existing developer coverage

`TaskflowApplicationTests` currently provides five Spring integration tests:

- application context loading,
- one complete create/read/update/delete lifecycle,
- empty list behavior,
- blank-title validation,
- missing-task read behavior.

These tests are developer-owned and remain separate from generated QA automation.

## Identified gaps

| Gap | Risk | Proposed QA coverage | Priority |
| --- | --- | --- | --- |
| Missing `title` or `null` title | Invalid tasks could reach the API with inconsistent errors | Validation scenarios for omitted, null, empty, and whitespace values | High |
| Invalid update requests | PUT may accept invalid titles differently from POST | Update validation scenarios, including missing task plus invalid body | High |
| Delete missing task | Client may receive an incorrect success response | Assert 404 and error payload for `DELETE /tasks/{id}` | High |
| Malformed JSON and unsupported content | Request parsing behavior is unknown to callers | Negative API scenarios for malformed JSON and content type | Medium |
| Response contract | Field names, null description behavior, and `Location` are not fully cataloged | Contract assertions for every endpoint and status/header combination | Medium |
| Persistence isolation | H2 lifecycle and data leakage could affect repeatability | Per-scenario cleanup and sequential/repeated execution checks | Medium |
| Ordering and duplicate data | List ordering and duplicate titles are unspecified | Flag as requirement questions; do not invent expected ordering | Low |
| Concurrency, authorization, and rate limits | Not part of the current product scope | Record as out of scope until requirements or infrastructure exist | Low |

## Initial suite model

| Tag | Purpose | Candidate trigger |
| --- | --- | --- |
| `smoke` | Critical create/read/update/delete path | Pull request and deployment |
| `validation` | Required-field and malformed-request behavior | Pull request |
| `negative` | Missing resources and non-success behavior | Pull request and main |
| `api` | All HTTP contract scenarios | Main branch |
| `regression` | Approved scenarios covering known behavior | Main branch and scheduled run |
| `destructive` | Scenarios that remove or mutate shared external data | Isolated test environment only |

## Test data and environment

Use generated titles with scenario-specific identifiers and explicit descriptions. The default local environment is disposable H2. Any future shared environment must provide a reset or isolated test-data strategy before destructive tests are enabled there.

## Requirement questions

The following are intentionally unresolved and should be clarified before scenario generation treats them as contractual behavior:

- Is a duplicate title allowed?
- Is list ordering guaranteed?
- Should omitted and explicit `null` descriptions be equivalent?
- Should malformed JSON and unsupported media types use the same error schema?
- Are authentication, authorization, and multi-user ownership planned?

## QA ownership

QA owns scenario quality, coverage decisions, tags, generated automation, evidence, and regression selection. Application developers own endpoint behavior and defect fixes. Human review is required before generated scenarios or generated automation become approved assets.