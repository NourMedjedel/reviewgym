import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewCase, summarizeSession } from '../web/engine.js';
import { scenarios } from '../web/scenarios.js';
import { scenariosFr } from '../web/scenarios-fr.js';
import { scenariosDe } from '../web/scenarios-de.js';
import { locales, translate } from '../web/locales.js';

function correct(c) {
  return { flags: c.draft.filter(x => x.issue).map(x => x.id), evidence: c.relevantSources,
    openedSources: c.relevantSources, action: c.action, confidence: 75, assisted: false };
}

test('every case has a coherent rubric, distinct IDs and a complete supported path', () => {
  assert.equal(new Set(scenarios.map(c => c.id)).size, scenarios.length);
  assert.ok(scenarios.some(c => !c.draft.some(x => x.issue)));
  assert.ok(scenarios.some(c => c.stage === 'transfer'));
  for (const c of scenarios) {
    assert.equal(new Set(c.draft.map(x => x.id)).size, c.draft.length);
    assert.ok(c.relevantSources.every(id => c.documents.some(d => d.id === id)));
    assert.equal(reviewCase(c, correct(c)).complete, true, c.id);
  }
});

test('approving a privacy leak is recorded as unsafe even at high confidence', () => {
  const c = scenarios[0];
  const r = reviewCase(c, { ...correct(c), flags: [], action: 'approve', confidence: 100 });
  assert.deepEqual(r.missed, ['identity', 'commercial']);
  assert.equal(r.disposition, 'unsafe-approval');
  assert.equal(r.complete, false);
});

test('guessing revise without finding the concerns does not pass the review', () => {
  const c = scenarios[0];
  assert.equal(reviewCase(c, { ...correct(c), flags: [] }).complete, false);
});

test('flagging every sentence incurs false positives and does not pass', () => {
  const c = scenarios[0];
  const r = reviewCase(c, { ...correct(c), flags: c.draft.map(x => x.id) });
  assert.deepEqual(r.unnecessary, ['symptom', 'reproduction']);
  assert.equal(r.complete, false);
});

test('a supported correct draft should be approved without invented concerns', () => {
  const c = scenarios.find(x => x.id === 'valid-summary');
  const r = reviewCase(c, correct(c));
  assert.equal(r.complete, true);
  assert.equal(r.expectedIssues, 0);
  assert.equal(reviewCase(c, { ...correct(c), action: 'revise' }).complete, false);
});

test('adding the archived source to the current source does not game source selection', () => {
  const c = scenarios.find(x => x.id === 'expired-procedure');
  const r = reviewCase(c, { ...correct(c), evidence: ['old-procedure', 'current-procedure'], openedSources: ['old-procedure', 'current-procedure'] });
  assert.equal(r.evidenceComplete, false);
  assert.deepEqual(r.unnecessaryEvidence, ['old-procedure']);
});

test('supporting ticket evidence is allowed alongside the decisive sharing policy', () => {
  const c = scenarios[0];
  assert.equal(reviewCase(c, { ...correct(c), evidence: ['sharing', 'ticket'], openedSources: ['sharing', 'ticket'] }).complete, true);
});

test('a source must have been opened before it is cited', () => {
  const c = scenarios[0];
  assert.throws(() => reviewCase(c, { ...correct(c), openedSources: [] }), /Open a source/);
});

test('unknown evidence and invalid decisions or confidence fail visibly', () => {
  const c = scenarios[0];
  assert.throws(() => reviewCase(c, { ...correct(c), flags: ['invented'] }), /unknown sentence/);
  assert.throws(() => reviewCase(c, { ...correct(c), action: 'ignore' }), /Choose a next action/);
  assert.throws(() => reviewCase(c, { ...correct(c), confidence: 101 }), /Confidence/);
});

test('duplicate flags do not inflate found concerns', () => {
  const c = scenarios[0];
  assert.equal(reviewCase(c, { ...correct(c), flags: ['identity', 'commercial', 'commercial'] }).found.length, 2);
});

test('first attempts remain first, even after a successful retry', () => {
  const c = scenarios[0];
  const first = reviewCase(c, { ...correct(c), flags: [], action: 'approve', confidence: 100 });
  const retry = reviewCase(c, correct(c));
  const summary = summarizeSession([first, retry]);
  assert.equal(summary.completed, 1);
  assert.equal(summary.supportedDecisions, 0);
  assert.equal(summary.issuesMissed, 2);
  assert.equal(summary.observations[0].confidence, 100);
});

test('assisted fresh-context practice is recorded without an overall skill score', () => {
  const c = scenarios.at(-1);
  const summary = summarizeSession([reviewCase(c, { ...correct(c), assisted: true })]);
  assert.equal(summary.freshCasesCompleted, 1);
  assert.equal(summary.assistedCases, 1);
  assert.equal(Object.hasOwn(summary, 'competenceScore'), false);
});

test('English, French and German cases preserve rubric results, sentences and source identities', () => {
  for (const pack of [scenariosFr, scenariosDe]) {
    assert.deepEqual(scenarios.map(c => c.id), pack.map(c => c.id));
    for (let i = 0; i < scenarios.length; i++) {
    const a = scenarios[i], b = pack[i];
    assert.notEqual(a.title, b.title);
    assert.equal(a.draft.length, b.draft.length);
    assert.equal(a.documents.length, b.documents.length);
    assert.ok(b.documents.every(d => d.title && d.body && d.label));
    assert.deepEqual(reviewCase(a, correct(a)), reviewCase(b, correct(b)));
    assert.deepEqual(a.documents.map(d => d.id), b.documents.map(d => d.id));
    assert.ok(b.draft.every(s => typeof s.text === 'string' && s.text.trim()));
    }
  }
});

test('every interface translation exists in all languages and interpolation preserves numbers', () => {
  assert.deepEqual(Object.keys(locales.en).sort(), Object.keys(locales.fr).sort());
  assert.deepEqual(Object.keys(locales.en).sort(), Object.keys(locales.de).sort());
  for (const language of ['en', 'fr', 'de']) assert.ok(Object.values(locales[language]).every(v => typeof v === 'string' && v.length));
  assert.equal(translate('fr', 'progress', { done: 2, total: 5 }), 'Cas examinés : 2 / 5');
  assert.throws(() => translate('fr', 'missing-key'), /Unknown translation/);
});
