# Jira Integration

TaskFlow uses Jira Cloud as the requirement and defect system of record, while
the repository remains the versioned source of truth for JSON scenarios,
automation, and execution evidence.

## Authentication

Use a Jira Cloud API token, not an account password. Configure these values in a
local shell or GitHub Actions secrets:

```bash
export JIRA_BASE_URL="https://your-domain.atlassian.net"
export JIRA_EMAIL="your-jira-email@example.com"
export JIRA_API_TOKEN="set-this-in-your-shell-or-secret-store"
export JIRA_ISSUE_KEY="SCRUM-6"
export JIRA_PROJECT_KEY="SCRUM"
```

Never commit these values or place them in JSON fixtures. The adapter uses HTTP
Basic authentication with the Jira email and API token.

## Commands

All commands are dry-run or read-only unless explicitly enabled:

```bash
npm run qa:jira:read
npm run qa:jira:publish
npm run qa:jira:bug
```

`qa:jira:publish` writes `qa/reports/jira-publish.json` by default. To publish a
comment and add a review label to the configured story:

```bash
JIRA_DRY_RUN=false npm run qa:jira:publish
```

The label is `qa-scenarios-needs-review` until the scenario set is approved; an
approved set uses `qa-scenarios-approved`. The adapter does not transition Jira
issues to Done and does not silently approve scenarios.

## End-to-end Jira traceability

```text
SCRUM-6
  -> qa/scenarios/SCRUM-6.json
    -> SCRUM-6-S01
      -> Playwright test title
        -> Playwright result and failure analysis
          -> Jira-ready bug payload
```

The first implementation uses the Jira REST API instead of MCP because REST is
available to local scripts and GitHub Actions. An MCP adapter could be added as
an editor convenience later, but it should call the same repository contracts
and must not become the only integration path.