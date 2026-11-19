import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession, restoreSession } from '../web/session.js';
import { scenarios } from '../web/scenarios.js';
import { reviewCase, summarizeSession } from '../web/engine.js';
import { exampleRepair, inspectRepair, MAX_REPAIR_LENGTH } from '../web/repair.js';

const c = scenarios[0];
const correct = { flags: c.draft.filter(s => s.issue).map(s => s.id), evidence: c.relevantSources,
  openedSources: c.relevantSources, action: c.action, confidence: 75, assisted: false };
const restore = value => restoreSession(JSON.stringify(value), scenarios);

test('broken JSON and unsupported session versions fall back to usable defaults', () => {
  for (const text of ['', '{broken', 'null', '[]', '42', '{"version":99}']) {
    assert.deepEqual(restoreSession(text, scenarios), createSession(scenarios));
  }
});

test('malformed saved containers and incomplete records cannot break session summaries', () => {
  for (const value of [null, [], 'invalid', 42, { [c.id]: null }]) {
    const session = restore({ version: 1, reviews: value, repairs: value,
      firstAttempts: [null, {}, { caseId: c.id }, 'invalid'] });
    assert.equal(summarizeSession(session.firstAttempts).completed, 0);
    assert.deepEqual(session.reviews, {});
  }
});

test('restoring retries keeps the first decision and ignores fabricated stored scores', () => {
  const first = reviewCase(c, { ...correct, flags: [], action: 'approve', confidence: 100 });
  const session = createSession(scenarios, 'fr');
  session.reviews[c.id] = { submission: correct, result: { complete: 'invented' } };
  session.firstAttempts = [{ ...first, complete: true, found: ['invented'] }, reviewCase(c, correct)];
  const saved = restore(session);
  assert.equal(saved.language, 'fr');
  assert.equal(saved.reviews[c.id].result.complete, true);
  assert.equal(saved.firstAttempts.length, 1);
  assert.deepEqual(saved.firstAttempts[0], first);
  assert.equal(summarizeSession(saved.firstAttempts).supportedDecisions, 0);
});

test('bad case IDs, source choices and confidence are discarded independently of valid reviews', () => {
  const valid = scenarios.find(s => s.id === 'valid-summary');
  const submission = { flags: [], evidence: valid.relevantSources, openedSources: valid.relevantSources,
    action: 'approve', confidence: null };
  for (const bad of [{ ...correct, flags: ['unknown'] }, { ...correct, openedSources: [] },
    { ...correct, confidence: -1 }, { ...correct, flags: 'identity' }]) {
    const session = restore({ version: 1, current: 'deleted-case', language: 'nl',
      reviews: { [c.id]: { submission: bad }, [valid.id]: { submission }, unknown: { submission: correct } } });
    assert.equal(session.current, c.id);
    assert.equal(session.language, 'en');
    assert.deepEqual(Object.keys(session.reviews), [valid.id]);
  }
});

test('working rewrites, assistance and distinct first/latest checks survive restoration', () => {
  const first = { caseId: c.id, language: 'fr', text: 'First working draft',
    checkedAt: '2026-11-19T10:00:00.000Z', exampleUsed: false, result: {} };
  const latest = { ...first, text: exampleRepair(c.id, 'fr'), exampleUsed: true,
    checkedAt: '2026-11-19T10:01:00.000Z' };
  const session = restore({ version: 1, repairs: { [c.id]: { fr: { draft: 'Still editing',
    open: true, exampleUsed: true, firstAttempt: first, latestAttempt: latest } } } });
  const record = session.repairs[c.id].fr;
  assert.equal(record.draft, 'Still editing');
  assert.equal(record.open, true);
  assert.equal(record.exampleUsed, true);
  assert.equal(record.firstAttempt.text, first.text);
  assert.equal(record.latestAttempt.text, latest.text);
  assert.deepEqual(record.latestAttempt.result, inspectRepair(c.id, latest.text));
});

test('invalid rewrite checks and oversized drafts do not replace valid language records', () => {
  const session = restore({ version: 1, repairs: { unknown: { en: {} }, [c.id]: {
    en: { draft: 'a'.repeat(MAX_REPAIR_LENGTH + 1), latestAttempt: { text: 'bad' } },
    fr: { draft: 'Valid working text', firstAttempt: null }, de: null, nl: { draft: 'Unsupported' },
  } } });
  assert.deepEqual(Object.keys(session.repairs), [c.id]);
  assert.equal(session.repairs[c.id].en.draft, undefined);
  assert.equal(session.repairs[c.id].en.latestAttempt, undefined);
  assert.equal(session.repairs[c.id].fr.draft, 'Valid working text');
  assert.equal(session.repairs[c.id].de, undefined);
  assert.equal(session.repairs[c.id].nl, undefined);
});

test('legacy submissions without optional confidence restore as unreported', () => {
  const legacy = { ...correct };
  delete legacy.confidence;
  const session = restore({ version: 1, reviews: { [c.id]: { submission: legacy } } });
  assert.equal(session.reviews[c.id].submission.confidence, null);
  assert.equal(session.reviews[c.id].result.complete, true);
});
