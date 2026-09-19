const { defineConfig } = require('@playwright/test');

const baseURL = process.env.TASKFLOW_BASE_URL || 'http://127.0.0.1:8080';
const port = new URL(baseURL).port || '8080';

module.exports = defineConfig({
  testDir: './qa/automation/api',
  timeout: 15000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['json', { outputFile: 'qa/reports/playwright-results.json' }],
    ['html', { outputFolder: 'qa/reports/playwright-html', open: 'never' }]
  ],
  use: {
    baseURL,
    extraHTTPHeaders: { Accept: 'application/json' }
  },
  webServer: {
    command: `./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=${port}`,
    url: `${baseURL}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});