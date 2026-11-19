import { reviewCase } from './engine.js?v=0.3.5';
import { inspectRepair, MAX_REPAIR_LENGTH } from './repair.js?v=0.3.5';

const languages = ['en', 'fr', 'de'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const strings = value => Array.isArray(value) && value.every(item => typeof item === 'string');
const validText = value => typeof value === 'string' && value.length <= MAX_REPAIR_LENGTH;

export function createSession(scenarios, language = 'en') {
  return { version: 1, language: languages.includes(language) ? language : 'en',
    current: scenarios[0].id, reviews: {}, firstAttempts: [], repairs: {} };
}

function restoreReview(value, scenario) {
  if (!object(value) || !strings(value.flags) || !strings(value.evidence) || !strings(value.openedSources)) return null;
  const sources = new Set(scenario.documents.map(source => source.id));
  const submission = { flags: value.flags, evidence: value.evidence,
    openedSources: value.openedSources.filter(id => sources.has(id)),
    expandedSources: (strings(value.expandedSources) ? value.expandedSources : value.openedSources).filter(id => sources.has(id)),
    sourcesVisible: value.sourcesVisible === true, action: value.action,
    confidence: value.confidence ?? null, assisted: value.assisted === true };
  try { return { submission, result: reviewCase(scenario, submission) }; }
  catch { return null; }
}

function restoreRewrite(value, caseId, language) {
  if (!object(value) || value.caseId !== caseId || value.language !== language || !validText(value.text)
      || typeof value.checkedAt !== 'string' || !Number.isFinite(Date.parse(value.checkedAt))) return null;
  return { caseId, language, text: value.text, result: inspectRepair(caseId, value.text),
    exampleUsed: value.exampleUsed === true, checkedAt: value.checkedAt };
}

/** Browser storage can be stale or malformed. Retain valid choices, not stored derived results. */
export function restoreSession(serialized, scenarios) {
  const session = createSession(scenarios);
  let stored;
  try { stored = JSON.parse(serialized); } catch { return session; }
  if (!object(stored) || stored.version !== 1) return session;
  const byId = new Map(scenarios.map(scenario => [scenario.id, scenario]));
  if (languages.includes(stored.language)) session.language = stored.language;
  if (byId.has(stored.current)) session.current = stored.current;

  if (object(stored.reviews)) for (const [id, value] of Object.entries(stored.reviews)) {
    if (!byId.has(id)) continue;
    const review = restoreReview(value?.submission, byId.get(id));
    if (review) session.reviews[id] = review;
  }
  const seen = new Set();
  if (Array.isArray(stored.firstAttempts)) for (const value of stored.firstAttempts) {
    if (!object(value) || !byId.has(value.caseId) || seen.has(value.caseId)) continue;
    const review = restoreReview({ flags: value.flaggedSentences, evidence: value.selectedEvidence,
      openedSources: value.openedSources, action: value.selectedAction,
      confidence: value.confidence, assisted: value.assisted }, byId.get(value.caseId));
    if (review) { session.firstAttempts.push(review.result); seen.add(value.caseId); }
  }
  if (object(stored.repairs)) for (const [id, translations] of Object.entries(stored.repairs)) {
    if (!byId.has(id) || !object(translations)) continue;
    const records = {};
    for (const language of languages) {
      const value = translations[language];
      if (!object(value)) continue;
      const record = { open: value.open === true, exampleUsed: value.exampleUsed === true };
      if (validText(value.draft)) record.draft = value.draft;
      for (const key of ['firstAttempt', 'latestAttempt']) {
        const attempt = restoreRewrite(value[key], id, language);
        if (attempt) record[key] = attempt;
      }
      records[language] = record;
    }
    session.repairs[id] = records;
  }
  return session;
}
