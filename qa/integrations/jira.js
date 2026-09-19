#!/usr/bin/env node
/* Jira Cloud REST adapter. Dry-run is the default; live mode requires explicit env configuration. */

const fs = require('fs');
const https = require('https');

const command = process.argv[2] || 'read';
const baseUrl = (process.env.JIRA_BASE_URL || '').replace(/\/$/, '');
const issueKey = process.env.JIRA_ISSUE_KEY || 'SCRUM-6';
const dryRun = process.env.JIRA_DRY_RUN !== 'false';

function request(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${baseUrl}${endpoint}`);
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (process.env.JIRA_EMAIL && process.env.JIRA_API_TOKEN) {
      headers.Authorization = `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`;
    }
    const req = https.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed;
        try { parsed = data ? JSON.parse(data) : {}; } catch { parsed = { raw: data }; }
        if (res.statusCode >= 400) reject(new Error(`Jira ${res.statusCode}: ${JSON.stringify(parsed)}`));
        else resolve(parsed);
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function requireLiveConfig() {
  if (!baseUrl || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
    throw new Error('Set JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN for live Jira mode.');
  }
}

function commentBody(text) {
  return { body: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] } };
}

async function main() {
  const scenarioPath = 'qa/scenarios/SCRUM-6.json';
  const scenarios = JSON.parse(fs.readFileSync(scenarioPath, 'utf8'));
  if (command === 'read') {
    requireLiveConfig();
    const issue = await request('GET', `/rest/api/3/issue/${issueKey}?fields=summary,description,status,labels`);
    fs.mkdirSync('qa/reports', { recursive: true });
    fs.writeFileSync(`qa/reports/${issueKey}-jira.json`, `${JSON.stringify(issue, null, 2)}\n`);
    console.log(`Saved Jira story ${issueKey} to qa/reports/${issueKey}-jira.json`);
    return;
  }

  if (command === 'publish') {
    const payload = {
      issueKey,
      status: scenarios.review.status,
      scenarioIds: scenarios.scenarios.map((item) => item.scenarioId),
      artifact: scenarioPath,
      label: scenarios.review.status === 'approved' ? 'qa-scenarios-approved' : 'qa-scenarios-needs-review'
    };
    if (dryRun) {
      fs.mkdirSync('qa/reports', { recursive: true });
      fs.writeFileSync('qa/reports/jira-publish.json', `${JSON.stringify(payload, null, 2)}\n`);
      console.log('Jira publish dry-run written to qa/reports/jira-publish.json');
      return;
    }
    requireLiveConfig();
    await request('POST', `/rest/api/3/issue/${issueKey}/comment`, commentBody(`QA scenarios generated: ${scenarioPath}. Review status: ${scenarios.review.status}.`));
    await request('PUT', `/rest/api/3/issue/${issueKey}`, { update: { labels: [{ add: payload.label }] } });
    console.log(`Published scenario review link/comment to ${issueKey}`);
    return;
  }

  if (command === 'bug') {
    const analysisPath = 'qa/reports/failure-analysis.json';
    const analysis = fs.existsSync(analysisPath) ? JSON.parse(fs.readFileSync(analysisPath, 'utf8')) : { results: [] };
    const failures = analysis.results.filter((item) => item.status === 'unexpected' || item.status === 'failed');
    if (!failures.length) {
      console.log('No failed automated tests; no Jira bug payload created.');
      return;
    }
    const bug = {
      project: process.env.JIRA_PROJECT_KEY || issueKey.split('-')[0],
      issueType: 'Bug',
      summary: `TaskFlow automated test failures for ${issueKey}`,
      description: `Source requirement: ${issueKey}\nEvidence: qa/reports/failure-analysis.json\nFailures:\n${failures.map((item) => `- ${item.scenarioId}: ${item.classification}: ${item.error}`).join('\n')}`,
      scenarioIds: failures.map((item) => item.scenarioId)
    };
    fs.mkdirSync('qa/reports', { recursive: true });
    fs.writeFileSync('qa/reports/jira-bug.json', `${JSON.stringify(bug, null, 2)}\n`);
    if (dryRun) {
      console.log('Jira bug dry-run written to qa/reports/jira-bug.json');
      return;
    }
    requireLiveConfig();
    const created = await request('POST', '/rest/api/3/issue', { fields: { project: { key: bug.project }, summary: bug.summary, description: commentBody(bug.description).body, issuetype: { name: bug.issueType } } });
    console.log(`Created Jira bug ${created.key}`);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => { console.error(error.message); process.exit(1); });