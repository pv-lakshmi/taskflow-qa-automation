# Decisions

## 2026-09-18: Keep a conventional Spring service/controller structure

**Decision:** Use DTOs for request validation, a `TaskService` for task behavior, a REST controller for HTTP concerns, and a global exception handler for API errors.

**Reason:** The boundaries are small, readable, and provide stable seams for later QA automation without introducing an unnecessary framework.

**Alternative considered:** Put repository calls directly in the controller. Rejected because it would couple HTTP behavior to persistence and make focused tests and future maintenance harder.

## 2026-09-18: Use H2 for the local baseline

**Decision:** Keep an in-memory H2 database for local development and integration tests.

**Reason:** It is already part of the repository, gives repeatable test setup, and is sufficient for the current application scope.

## 2026-09-18: Keep developer tests separate from future QA automation

**Decision:** Treat `src/test` as existing developer-owned coverage and reserve a separate `qa/` structure for generated scenarios, automation, reports, and agent assets.

**Reason:** The project is intended to model a QA engineer onboarding to an existing application. Separation preserves ownership and makes generated assets reviewable.