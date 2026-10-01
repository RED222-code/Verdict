const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { spawnSync } = require('node:child_process');

test('database middleware handles missing configuration, concurrency, and recovery', async () => {
  const originalConnect = mongoose.connect;
  const originalUri = process.env.MONGODB_URI;
  const app = require('../app');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  try {
    delete process.env.MONGODB_URI;
    let response = await fetch(url);
    assert.equal(response.status, 500);
    assert.equal((await response.json()).message, 'Database not configured');
    process.env.MONGODB_URI = 'mongodb://test.invalid/test';
    let calls = 0;
    let finish;
    mongoose.connect = (_, options) => {
      calls++;
      assert.equal(options.serverSelectionTimeoutMS, 10000);
      return new Promise(resolve => { finish = resolve; });
    };
    const first = fetch(url);
    const second = fetch(url);
    await new Promise(resolve => setTimeout(resolve, 150));
    assert.equal(calls, 1);
    finish();
    assert.equal((await first).status, 200);
    assert.equal((await second).status, 200);
    mongoose.connect = async () => { calls++; throw new Error('private connection details'); };
    response = await fetch(url);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {status: 'error', message: 'Database connection failed'});
    mongoose.connect = async () => { calls++; };
    assert.equal((await fetch(url)).status, 200);
    assert.equal(calls, 3);
  } finally {
    mongoose.connect = originalConnect;
    if (originalUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = originalUri;
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});

test('client rejects invalid responses and preserves valid data and API errors', async () => {
  const originalFetch = global.fetch;
  const originalStorage = global.localStorage;
  global.localStorage = {getItem: () => null};
  const {request, ApiError} = await import('../frontend/src/api/client.js');
  try {
    for (const [body, contentType] of [['<html>fallback</html>', 'text/html'], ['{', 'application/json'], ['null', 'application/json'], ['{}', 'application/json']]) {
      global.fetch = async () => new Response(body, {headers: {'content-type': contentType}});
      await assert.rejects(request('/products'), error => error instanceof ApiError && /invalid response/.test(error.message));
    }
    global.fetch = async () => Response.json({message: 'Database not configured'}, {status: 500});
    await assert.rejects(request('/products'), error => error.status === 500 && error.message === 'Database not configured');
    global.fetch = async () => Response.json({status: 'success', data: []});
    assert.deepEqual((await request('/products')).data, []);
    global.fetch = async () => new Response(null, {status: 204});
    assert.equal(await request('/products/1', {method: 'DELETE'}), null);
  } finally {
    global.fetch = originalFetch;
    global.localStorage = originalStorage;
  }
});

test('destructive importer refuses production, Vercel, and missing opt-in', () => {
  for (const overrides of [{NODE_ENV: 'production', DEV_DATA_IMPORT: 'true'}, {VERCEL: '1', DEV_DATA_IMPORT: 'true'}, {DEV_DATA_IMPORT: 'false'}]) {
    const env = {...process.env, NODE_ENV: 'test', VERCEL: '', MONGODB_URI: 'mongodb://test.invalid/test', ...overrides};
    const result = spawnSync(process.execPath, ['import-dev-data.js', '--import'], {env, encoding: 'utf8', timeout: 5000});
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Data import\/delete is disabled/);
  }
});
