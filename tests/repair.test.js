import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectRepair, exampleRepair, retainRepairAttempt, summarizeRepairs, MAX_REPAIR_LENGTH } from '../web/repair.js';
import { scenarios } from '../web/scenarios.js';
import { scenariosFr } from '../web/scenarios-fr.js';
import { scenariosDe } from '../web/scenarios-de.js';
import { translate } from '../web/locales.js';

test('privacy details are highlighted at original offsets, including separated prices and repeated IDs', () => {
  const text = 'À vérifier : Juniper Bank, JB-20491, puis JB 20491. CHF 84\u00a0000. CSV E104.';
  const r = inspectRepair('supplier-handoff', text);
  assert.equal(r.status, 'needs-attention');
  assert.equal(r.attentionCount, 2);
  assert.deepEqual(r.ranges.map(s => text.slice(s.start, s.end)), ['Juniper Bank', 'JB-20491', 'JB 20491', '84\u00a0000']);
});

test('all ten authored examples in all three languages retain context without semantic approval', () => {
  for (const c of scenarios) for (const language of ['en', 'fr', 'de']) {
    const r = inspectRepair(c.id, exampleRepair(c.id, language));
    assert.equal(r.status, 'compare-with-sources', `${c.id}/${language}`);
    assert.equal(r.requiresHumanReview, true);
    assert.equal(Object.hasOwn(r, 'approved'), false);
    for (const check of r.checks) assert.ok(translate(language, check.label));
  }
});

test('removing the entire message or all useful context does not solve the task', () => {
  assert.equal(inspectRepair('supplier-handoff', '  ').status, 'empty');
  const r = inspectRepair('supplier-handoff', 'Please investigate.');
  assert.equal(r.status, 'missing-details');
  assert.equal(r.missingCount, 2);
});

test('replacing the hour but leaving a next-day promise still raises a warning', () => {
  const r = inspectRepair('expired-procedure', 'The incident update is due at 13:00 tomorrow.');
  assert.equal(r.status, 'needs-attention');
  assert.equal(r.missingCount, 0);
});

test('refund promises are distinguished from the authored pending-approval handoff', () => {
  for (const pack of [scenarios, scenariosFr, scenariosDe]) {
    const c = pack.find(c => c.id === 'unapproved-refund');
    const r = inspectRepair(c.id, c.draft.map(s => s.text).join('\n'));
    assert.equal(r.attentionCount, 2);
  }
  assert.equal(inspectRepair('unapproved-refund', 'It has not been approved. Approval is pending; please review.').attentionCount, 0);
});

test('a supported original draft can be retained without forcing gratuitous rewriting', () => {
  for (const pack of [scenarios, scenariosFr, scenariosDe]) {
    const c = pack.find(c => c.id === 'valid-summary');
    assert.equal(inspectRepair(c.id, c.draft.map(s => s.text).join('\n')).status, 'compare-with-sources');
  }
});

test('keyword coverage is explicitly insufficient to validate meaning', () => {
  const r = inspectRepair('valid-summary', 'Asha will NOT prepare anything Friday. Monday is cancelled.');
  assert.equal(r.status, 'compare-with-sources');
  assert.equal(r.requiresHumanReview, true);
  assert.equal(Object.hasOwn(r, 'score'), false);
});

test('invalid case, language and oversized inputs fail without echoing user text', () => {
  assert.throws(() => inspectRepair('__proto__', ''), /Unknown practice case/);
  assert.throws(() => exampleRepair('valid-summary', 'nl'), /Unknown practice language/);
  assert.throws(() => inspectRepair('valid-summary', null), /must be text/);
  assert.throws(() => inspectRepair('valid-summary', 'sensitive'.repeat(MAX_REPAIR_LENGTH)), error => {
    assert.equal(error.message.includes('sensitive'), false);
    return /at most 6000/.test(error.message);
  });
});

test('first checked rewrite survives retries, with independent snapshots', () => {
  const attempt = { text: 'first', result: { attentionCount: 2 }, exampleUsed: false };
  const first = retainRepairAttempt(undefined, attempt);
  attempt.text = 'changed outside';
  const second = retainRepairAttempt(first, { text: 'revised', result: { attentionCount: 0 }, exampleUsed: true });
  assert.equal(second.firstAttempt.text, 'first');
  assert.equal(second.firstAttempt.exampleUsed, false);
  assert.equal(second.latestAttempt.text, 'revised');
  second.firstAttempt.result.attentionCount = 99;
  assert.equal(first.firstAttempt.result.attentionCount, 2);
});

test('rewrite summary counts language drafts and viewed examples separately from review decisions', () => {
  assert.deepEqual(summarizeRepairs(), { checkedDrafts: 0, exampleAssistedDrafts: 0 });
  assert.deepEqual(summarizeRepairs({
    'supplier-handoff': { en: { latestAttempt: {}, exampleUsed: false }, fr: { exampleUsed: true } },
    'valid-summary': { en: { latestAttempt: {}, exampleUsed: true } },
  }), { checkedDrafts: 2, exampleAssistedDrafts: 2 });
});
