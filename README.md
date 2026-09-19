# TaskFlow

TaskFlow is a small Spring Boot task-management API used as the system under test for the AI-assisted QA automation project.

## Run locally

Requirements: Java 21.

```bash
./mvnw spring-boot:run
```

The API is available at `http://localhost:8080`. The H2 database is in-memory and is recreated when the application starts.

## Verify

```bash
./mvnw test
```

The developer-owned integration tests exercise the Task CRUD API, validation, persistence-backed reads, and not-found behavior.

## Task API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/tasks` | Create a task; `title` is required |
| `GET` | `/tasks` | List all tasks |
| `GET` | `/tasks/{id}` | Get one task |
| `PUT` | `/tasks/{id}` | Replace a task's title and description |
| `DELETE` | `/tasks/{id}` | Delete a task |

The project direction and QA handoff are tracked in [PROGRESS.md](PROGRESS.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), and [QA_AUTOMATION_PLAN.md](QA_AUTOMATION_PLAN.md).

The QA Agent workflow is documented in [qa/README.md](qa/README.md). Its first requirement input is [qa/requirements/SCRUM-6.json](qa/requirements/SCRUM-6.json), and the generated proposal is [qa/scenarios/SCRUM-6.json](qa/scenarios/SCRUM-6.json).