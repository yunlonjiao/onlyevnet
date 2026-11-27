import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../v8/editor/studio-publish-flow.js', import.meta.url), 'utf8');
const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const { createPublishFlow } = await import(moduleUrl);

function harness({ stageError = null } = {}) {
  const calls = [];
  const state = { eventName: 'STARDUST ONLY', templateId: '01-ip-only' };
  const slugInput = { value: 'stardust-only', focus() {} };
  const statusEl = { textContent: '' };
  const flow = createPublishFlow({
    slugInput,
    statusEl,
    getState: () => state,
    getTemplate: () => ({ id: '01-ip-only' }),
    getProjectId: () => 'local-1',
    getRecord: () => ({}),
    setRecord: (value) => calls.push(['setRecord', value]),
    saveRecord: (value) => calls.push(['saveRecord', value]),
    clearRecord: () => calls.push(['clearRecord']),
    hasLiveSite: () => false,
    syncButton: () => calls.push(['syncButton']),
    cleanSlug: (value) => value,
    isValidSlug: () => true,
    publishStudioSite: async () => ({ siteId: 'site-1', slug: 'stardust-only' }),
    getPending: () => [{ at: '2026-12-01T00:00:00Z', html: '<p>stage</p>' }],
    setPending: (value) => calls.push(['setPending', value]),
    setSiteStages: async () => {
      calls.push(['setSiteStages']);
      if (stageError) throw stageError;
    },
    setBusy: () => {},
    renderDialog: () => {},
    syncAdminProject: () => calls.push(['syncAdminProject']),
    toast: () => {},
    isRenaming: () => false,
    setRenaming: () => {}
  });
  return { flow, calls, statusEl };
}

test('stage failure keeps the published site record', async () => {
  const { flow, calls, statusEl } = harness({ stageError: new Error('stages unavailable') });
  await flow.publish('<html></html>');
  const firstSave = calls.findIndex(([name]) => name === 'saveRecord');
  const stageCall = calls.findIndex(([name]) => name === 'setSiteStages');
  assert.ok(firstSave >= 0 && stageCall > firstSave, 'site record must be saved before stages');
  assert.ok(!calls.some(([name]) => name === 'clearRecord'), 'must not clear the published record');
  const saves = calls.filter(([name]) => name === 'saveRecord');
  assert.equal(saves.at(-1)[1].staged, false);
  assert.match(statusEl.textContent, /分批公开.*未完成/);
});

test('successful stages mark the record as staged', async () => {
  const { flow, calls } = harness();
  await flow.publish('<html></html>');
  const saves = calls.filter(([name]) => name === 'saveRecord');
  assert.equal(saves.at(-1)[1].staged, true);
  assert.ok(calls.some(([name]) => name === 'setSiteStages'));
});
