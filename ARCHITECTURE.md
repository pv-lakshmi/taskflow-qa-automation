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

## Planned integration points

- Jira story input and defect-ready output.
- Maven or a dedicated QA runner for selective API suites.
- GitHub Actions for pull-request, main-branch, deployment, and scheduled execution.
- Machine-readable results plus human-readable summaries.