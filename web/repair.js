import { extraRepairSpecs, deExamples } from './repair-extra.js?v=0.3.0';

/** Narrow, authored text checks for practice. These do not approve arbitrary prose. */
export const MAX_REPAIR_LENGTH = 6000;

const specs = {
  ...extraRepairSpecs,
  'supplier-handoff': {
    risks: [
      { id: 'identity', label: 'repairIdentity', pattern: /\bjuniper\s+bank\b|\bJB[\s-]*20491\b/iu },
      { id: 'price', label: 'repairPrice', pattern: /\b84[\s,.'’]*000\b|\b84\s*k\b|eighty[-\s]+four\s+thousand|quatre[-\s]+vingt[-\s]+quatre\s+mille/iu },
    ],
    facts: [
      { id: 'symptom', label: 'repairExportFact', pattern: /\bCSV\b|\bexports?\b/iu },
      { id: 'error-code', label: 'repairErrorFact', pattern: /\bE104\b/iu },
    ],
    example: {
      en: 'CSV exports fail when the date range includes the last day of the month.\n\nPlease reproduce in a test workspace using a month-end range. The export returns error E104.',
      fr: 'Les exports CSV échouent lorsque la période inclut le dernier jour du mois.\n\nPour reproduire le problème, utilisez une période de fin de mois dans un environnement de test. L’export renvoie l’erreur E104.',
    },
  },
  'expired-procedure': {
    risks: [
      { id: 'old-deadline', label: 'repairOldDeadline', pattern: /\b24\s*(?:hours?|heures?|stunden?|h)\b|\b(?:tomorrow|demain|morgen)\b/iu },
    ],
    facts: [
      { id: 'incident', label: 'repairIncidentFact', pattern: /\b(?:incident|vorfall)\b/iu },
      { id: 'current-time', label: 'repairTimeFact', pattern: /\b13\s*(?::\s*00|h(?:eures)?(?:\s*00)?|\s*Uhr)\b|\b1\s*(?::\s*00)?\s*p\.?m\.?/iu },
    ],
    example: {
      en: 'We have received your priority incident at 09:00 today and started the initial review.\n\nUnder the current procedure, the first status update is due by 13:00 today. Further updates will be recorded on the incident ticket.',
      fr: 'Nous avons reçu votre incident prioritaire à 9 h aujourd’hui et commencé son examen.\n\nSelon la procédure actuelle, le premier point de situation est dû à 13 h aujourd’hui. Les prochains points seront consignés dans le ticket d’incident.',
    },
  },
  'valid-summary': {
    risks: [],
    facts: [
      { id: 'owner', label: 'repairOwnerFact', pattern: /\bAsha\b/iu },
      { id: 'dataset-date', label: 'repairFridayFact', pattern: /\b(?:Friday|vendredi|Freitag)\b/iu },
      { id: 'review-date', label: 'repairMondayFact', pattern: /\b(?:Monday|lundi|Montag)\b/iu },
    ],
    example: {
      en: 'Asha will prepare the test dataset by Friday. The team will review it on Monday before deciding whether to start the pilot. No launch date has been agreed.',
      fr: 'Asha préparera les données de test pour vendredi. L’équipe les examinera lundi avant de décider de lancer le pilote. Aucune date de lancement n’a été convenue.',
    },
  },
  'unapproved-refund': {
    risks: [
      { id: 'approval-claim', label: 'repairApprovalClaim', pattern: /\b(?:has\s+been|is)\s+approved\b|\ba\s+[eé]t[eé]\s+approuv[eé]|\bwurde\s+genehmigt\b/iu },
      { id: 'payment-promise', label: 'repairPaymentPromise', pattern: /\b(?:will|shall)\s+be\s+paid\b|\bsera\s+(?:vers[eé]|pay[eé])|\bwithin\s+five\s+days\b|\bdans\s+(?:un\s+d[eé]lai\s+de\s+)?cinq\s+jours\b|\bwird[\s\S]{0,50}ausgezahlt\b|innerhalb\s+von\s+f[üu]nf\s+Tagen/iu },
    ],
    facts: [
      { id: 'pending', label: 'repairPendingFact', pattern: /\b(?:pending|awaiting)\b|\ben\s+attente\b|ausstehend/iu },
      { id: 'request-review', label: 'repairReviewerFact', pattern: /\b(?:review|reviewer|approval|decision)\b|\b(?:examen|validation|d[eé]cision|freigabe|entscheidung|pr[üu]f(?:e|ung))\b/iu },
    ],
    example: {
      en: 'Please review this refund request. The eligibility check passed, but approval is still pending and no payment has been scheduled.\n\nCould the designated reviewer record a decision before we make a commitment to the customer?',
      fr: 'Merci d’examiner cette demande de remboursement. La vérification d’éligibilité est positive, mais la validation est encore en attente et aucun versement n’a été programmé.\n\nLa personne habilitée peut-elle enregistrer sa décision avant tout engagement envers le client ?',
    },
  },
  'workshop-transfer': {
    risks: [
      { id: 'employee-id', label: 'repairEmployeeId', pattern: /\bR[\s-]*18\b/iu },
      { id: 'individual-results', label: 'repairIndividualResults', pattern: /\bfailed\b|\b[eé]chou[eé]\b|\bperformance\s+support\s+plan\b|\baccompagnement\s+pour\s+ses\s+performances\b|nicht\s+bestanden|Leistungsf[öo]rderplan/iu },
    ],
    facts: [
      { id: 'workshop', label: 'repairWorkshopFact', pattern: /\b(?:workshop|atelier|exercices?|exercises?|Workshop)\b/iu },
      { id: 'learning-needs', label: 'repairLearningFact', pattern: /\b(?:sources?|review|relecture|checking|v[eé]rification|Quellen|Pr[üu]fung)\b/iu },
    ],
    example: {
      en: 'Please plan a hands-on workshop on checking sources and reviewing AI-generated messages. Participants have mixed levels of experience, so include exercises at different levels. An anonymous overview of the group’s needs is sufficient.',
      fr: 'Merci de préparer un atelier pratique sur la vérification des sources et la relecture de messages produits par IA. Les niveaux d’expérience sont variés : prévoyez des exercices adaptés à plusieurs niveaux. Une synthèse anonyme des besoins du groupe suffit.',
    },
  },
};

for (const [id, text] of Object.entries(deExamples)) specs[id].example.de = text;

function getSpec(caseId) {
  const spec = specs[caseId];
  if (!Object.hasOwn(specs, caseId) || !spec) throw new Error('Unknown practice case.');
  return spec;
}

/** Return an explicitly authored example; this is assistance, not a model response. */
export function exampleRepair(caseId, language) {
  const value = getSpec(caseId).example[language];
  if (!value || !['en', 'fr', 'de'].includes(language)) throw new Error('Unknown practice language.');
  return value;
}

/** Inspect bounded text for configured exercise details, retaining original offsets. */
export function inspectRepair(caseId, text) {
  const spec = getSpec(caseId);
  if (typeof text !== 'string' || text.length > MAX_REPAIR_LENGTH) {
    throw new Error('A practice rewrite must be text of at most 6000 characters.');
  }
  const ranges = [];
  const riskChecks = spec.risks.map(rule => {
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags + 'g');
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) ranges.push({ start: match.index, end: match.index + match[0].length, checkId: rule.id });
    return { id: rule.id, label: rule.label, kind: 'risk', status: matches.length ? 'attention' : 'not-found' };
  });
  const factChecks = spec.facts.map(rule => ({ id: rule.id, label: rule.label, kind: 'detail',
    status: rule.pattern.test(text) ? 'mentioned' : 'missing' }));
  const attentionCount = riskChecks.filter(c => c.status === 'attention').length;
  const missingCount = factChecks.filter(c => c.status === 'missing').length;
  const empty = text.trim().length === 0;
  return {
    caseId, status: empty ? 'empty' : attentionCount ? 'needs-attention' : missingCount ? 'missing-details' : 'compare-with-sources',
    attentionCount, missingCount, checks: [...riskChecks, ...factChecks], ranges,
    // No score or semantic approval: matching details is not verifying their meaning.
    requiresHumanReview: true,
  };
}

/** Keep the first checked rewrite while allowing later practice attempts. */
export function retainRepairAttempt(previous, attempt) {
  return { firstAttempt: structuredClone(previous?.firstAttempt ?? attempt), latestAttempt: structuredClone(attempt) };
}

/** Count saved rewrites without changing or rescoring the original review. */
export function summarizeRepairs(records = {}) {
  const attempts = Object.values(records).flatMap(byLanguage => Object.values(byLanguage));
  return { checkedDrafts: attempts.filter(r => r.latestAttempt).length,
    exampleAssistedDrafts: attempts.filter(r => r.exampleUsed).length };
}
