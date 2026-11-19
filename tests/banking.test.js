import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios } from '../web/scenarios.js';
import { scenariosFr } from '../web/scenarios-fr.js';
import { scenariosDe } from '../web/scenarios-de.js';
import { reviewCase, summarizeSession } from '../web/engine.js';
import { inspectRepair } from '../web/repair.js';
import { topics, topicFor } from '../web/topics.js';
import { locales, translate } from '../web/locales.js';
import { uiCopy } from '../web/ui-copy.js';
import { resources } from '../web/resources.js';

const pick = id => scenarios.find(c => c.id === id);
const correct = c => ({ flags: c.draft.filter(s => s.issue).map(s => s.id), evidence: c.relevantSources,
  openedSources: c.relevantSources, action: c.action, confidence: null });

test('topic library covers every case exactly once and retains the original stable IDs', () => {
  assert.equal(scenarios.length, 10);
  const ids = topics.flatMap(t => t.cases);
  assert.equal(new Set(ids).size, 10);
  assert.deepEqual([...ids].sort(), scenarios.map(c => c.id).sort());
  for (const c of scenarios) assert.ok(topicFor(c.id));
  for (const id of ['supplier-handoff', 'expired-procedure', 'valid-summary', 'unapproved-refund', 'workshop-transfer']) assert.ok(pick(id));
  for (const topic of topics) for (const language of ['en', 'fr', 'de']) {
    assert.ok(translate(language, topic.title));
    assert.ok(translate(language, topic.description));
  }
});

test('a prompt injection is referred for review without treating the ticket as authorisation', () => {
  const c = pick('injected-ticket');
  assert.equal(reviewCase(c, correct(c)).complete, true);
  assert.equal(reviewCase(c, { ...correct(c), action: 'approve' }).disposition, 'unsafe-approval');
  const missingRule = reviewCase(c, { ...correct(c), evidence: ['ticket-content'] });
  assert.equal(missingRule.evidenceComplete, false);
});

test('a read-only pilot cannot acquire payment-writing authority by logging actions', () => {
  const c = pick('connector-scope');
  assert.equal(c.action, 'escalate');
  assert.deepEqual(reviewCase(c, correct(c)).found, ['write']);
  assert.equal(reviewCase(c, { ...correct(c), flags: ['audit'] }).complete, false);
});

test('the denominator case distinguishes 5 percent from a 75 percent causal improvement', () => {
  const c = pick('misleading-rate');
  assert.equal(1 / 20 * 100, 5);
  assert.deepEqual(reviewCase(c, correct(c)).found, ['rate', 'cause']);
  const arithmeticOnly = reviewCase(c, { ...correct(c), flags: ['rate'] });
  assert.deepEqual(arithmeticOnly.missed, ['cause']);
  assert.equal(arithmeticOnly.complete, false);
});

test('the approved prototype route does not authorise real letters or the free service', () => {
  const c = pick('tool-choice');
  assert.equal(reviewCase(c, correct(c)).complete, true);
  assert.equal(reviewCase(c, { ...correct(c), flags: ['upload'] }).complete, false);
  for (const pack of [scenarios, scenariosFr, scenariosDe]) {
    const text = pack.find(x => x.id === c.id).draft.map(s => s.text).join('\n');
    assert.equal(inspectRepair(c.id, text).status, 'needs-attention');
  }
});

test('a bounded evaluation update is approved while production approval stays separate', () => {
  const c = pick('bounded-evaluation');
  assert.equal(c.draft.filter(s => s.issue).length, 0);
  assert.equal(reviewCase(c, correct(c)).complete, true);
  assert.equal(reviewCase(c, { ...correct(c), action: 'escalate' }).complete, false);
  for (const pack of [scenarios, scenariosFr, scenariosDe]) {
    const text = pack.find(x => x.id === c.id).draft.map(s => s.text).join('\n');
    assert.equal(inspectRepair(c.id, text).status, 'compare-with-sources');
  }
});

test('optional confidence is absent until reported, rather than inventing a 50-percent self-report', () => {
  const c = pick('valid-summary');
  const r = reviewCase(c, correct(c));
  assert.equal(r.confidence, null);
  assert.equal(r.complete, true);
  assert.equal(summarizeSession([r]).observations[0].confidence, null);
  assert.throws(() => reviewCase(c, { ...correct(c), confidence: NaN }), /Confidence/);
});

test('Swiss German uses the same placeholders and complete localised content without sharp s', () => {
  for (const [key, values] of Object.entries(uiCopy)) {
    assert.equal(values.length, 3, key);
    const placeholders = values.map(s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort());
    assert.deepEqual(placeholders[0], placeholders[1], key);
    assert.deepEqual(placeholders[0], placeholders[2], key);
  }
  const german = JSON.stringify({ copy: locales.de, cases: scenariosDe });
  assert.equal(german.includes('ß'), false);
  assert.ok(german.includes('Überarbeiten'));
});

test('field-guide links are primary sources with a localised scope note', () => {
  const allowed = ['www.finma.ch', 'genai.owasp.org', 'www.microsoft.com', 'arxiv.org'];
  assert.equal(resources.length, 5);
  for (const resource of resources) {
    const url = new URL(resource.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(allowed.includes(url.hostname));
    for (const language of ['en', 'fr', 'de']) assert.ok(translate(language, resource.note));
  }
});
