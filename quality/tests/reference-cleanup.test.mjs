import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../v8/editor/studio-reference-cleanup.js', import.meta.url), 'utf8');
const { cleanupDeletedReferencesIn } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

test('deleting a participation clears schedule, featured slots and explore links', () => {
  const state = {
    schedule: [{participationId: 'p1'}, {participationId: 'p2'}],
    featuredActivities: [{participationId: 'p1'}],
    participation: [{guestIds: ['g1']}]
  };
  const cleared = [];
  cleanupDeletedReferencesIn(state, 'participation', {id: 'p1'}, (type, id) => cleared.push([type, id]));
  assert.deepEqual(state.schedule.map((r) => r.participationId), ['', 'p2']);
  assert.equal(state.featuredActivities[0].participationId, '');
  assert.deepEqual(cleared, [['participation', 'p1']]);
});

test('deleting a guest removes it from activities and schedule', () => {
  const state = {
    participation: [{guestIds: ['g1', 'g2']}],
    schedule: [{guestIds: ['g1']}]
  };
  const cleared = [];
  cleanupDeletedReferencesIn(state, 'guests', {id: 'g1'}, (type, id) => cleared.push([type, id]));
  assert.deepEqual(state.participation[0].guestIds, ['g2']);
  assert.deepEqual(state.schedule[0].guestIds, []);
  assert.deepEqual(cleared, [['guest', 'g1']]);
});
