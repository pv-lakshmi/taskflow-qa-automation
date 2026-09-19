const { test, expect } = require('@playwright/test');

const scenarioSet = require('../../scenarios/approved/SCRUM-6.json');

function scenario(id) {
  const item = scenarioSet.scenarios.find((candidate) => candidate.scenarioId === id);
  if (!item) throw new Error(`Missing approved scenario: ${id}`);
  return item;
}

function testTitle(item) {
  return `${item.scenarioId} ${item.title} ${item.tags.map((tag) => `@${tag}`).join(' ')}`;
}

test.describe('TaskFlow API | SCRUM-6', () => {
  test.beforeEach(async ({ request }) => {
    const response = await request.get('/tasks');
    expect(response.ok()).toBeTruthy();
    const tasks = await response.json();
    for (const task of tasks) {
      await request.delete(`/tasks/${task.id}`);
    }
  });

  test(testTitle(scenario('SCRUM-6-S01')), async ({ request }) => {
    const response = await request.post('/tasks', {
      data: { title: 'Prepare release notes', description: 'Summarize the release' }
    });
    expect(response.status()).toBe(201);
    expect(response.headers().location).toMatch(/^\/tasks\/\d+$/);
    const task = await response.json();
    expect(task).toMatchObject({ title: 'Prepare release notes', description: 'Summarize the release' });
    expect(task.id).toEqual(expect.any(Number));
  });

  test(testTitle(scenario('SCRUM-6-S02')), async ({ request }) => {
    const response = await request.post('/tasks', { data: { title: 'Review test results' } });
    expect(response.status()).toBe(201);
    expect((await response.json()).title).toBe('Review test results');
  });

  test(testTitle(scenario('SCRUM-6-S03')), async ({ request }) => {
    const response = await request.post('/tasks', { data: { title: '   ', description: 'Invalid task' } });
    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({ fieldErrors: { title: 'title must not be blank' } });
    const tasks = await (await request.get('/tasks')).json();
    expect(tasks).toHaveLength(0);
  });

  test(testTitle(scenario('SCRUM-6-S04')), async ({ request }) => {
    const response = await request.post('/tasks', { data: { description: 'Missing title' } });
    expect(response.status()).toBe(400);
    expect((await response.json()).fieldErrors.title).toBe('title must not be blank');
  });

  test(testTitle(scenario('SCRUM-6-S05')), async ({ request }) => {
    const created = await request.post('/tasks', { data: { title: 'Retrieve me', description: 'Persistence check' } });
    const createdTask = await created.json();
    const response = await request.get(`/tasks/${createdTask.id}`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ title: 'Retrieve me', description: 'Persistence check' });
  });

  test(testTitle(scenario('SCRUM-6-S06')), async ({ request }) => {
    const response = await request.post('/tasks', {
      data: '{"title":',
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test(testTitle(scenario('SCRUM-6-S07')), async ({ request }) => {
    const first = await request.post('/tasks', { data: { title: 'First task' } });
    const second = await request.post('/tasks', { data: { title: 'Second task' } });
    expect(first.status()).toBe(201);
    expect(second.status()).toBe(201);
    const firstTask = await first.json();
    const secondTask = await second.json();
    expect(firstTask.id).not.toBe(secondTask.id);
  });

  test(testTitle(scenario('SCRUM-6-S08')), async () => {
    expect(scenarioSet.sourceRequirement).toBe('SCRUM-6');
    expect(scenarioSet.review.status).toBe('approved');
  });
});