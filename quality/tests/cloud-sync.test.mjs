import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../v8/editor/studio-cloud-sync.js', import.meta.url), 'utf8');
const { createCloudSync } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

function harness({ bumpDuringUpload = false } = {}) {
  let revision = 1, bumped = false;
  const status = { textContent: '' };
  const calls = [];
  const cloud = createCloudSync({
    getState: () => ({ eventName: 'STARDUST ONLY' }),
    getTemplate: () => ({ id: '01-ip-only' }),
    getProjectId: () => 'local-1',
    readCloudSession: () => ({ token: 't' }),
    ensureCloudProjectFor: async () => 'cloud-1',
    saveCloudConfig: async () => { if (bumpDuringUpload && !bumped) { bumped = true; revision++; } },
    syncAdminProject: () => calls.push('admin'),
    saveStateEl: status,
    getRevision: () => revision
  });
  return { cloud, status, calls };
}

test('a clean upload marks the project synced', async () => {
  const { cloud, status } = harness();
  await cloud.sync();
  assert.match(status.textContent, /云端已同步/);
});

test('an edit during upload does not claim the project is synced', async () => {
  const { cloud, status } = harness({ bumpDuringUpload: true });
  await cloud.sync();
  assert.match(status.textContent, /有新修改等待同步/);
  assert.doesNotMatch(status.textContent, /云端已同步/);
});
