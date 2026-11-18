/** Deterministic practice rubric. No model judges or identity claims. */
export function reviewCase(scenario, submission) {
  const known = new Set(scenario.draft.map(x => x.id));
  const expected = new Set(scenario.draft.filter(x => x.issue).map(x => x.id));
  const flagged = new Set(submission.flags || []);
  const sourceIds = new Set(scenario.documents.map(x => x.id));
  const evidence = new Set(submission.evidence || []);
  if ([...flagged].some(id => !known.has(id)) || [...evidence].some(id => !sourceIds.has(id))) {
    throw new Error('The review contains an unknown sentence or source.');
  }
  if (!['approve', 'revise', 'escalate'].includes(submission.action)) {
    throw new Error('Choose a next action.');
  }
  if (!Number.isInteger(submission.confidence) || submission.confidence < 0 || submission.confidence > 100) {
    throw new Error('Confidence must be an integer between 0 and 100.');
  }
  const found = [...flagged].filter(id => expected.has(id));
  const missed = [...expected].filter(id => !flagged.has(id));
  const unnecessary = [...flagged].filter(id => !expected.has(id));
  const allowedSources = new Set(scenario.allowedSources || scenario.relevantSources);
  const unnecessaryEvidence = [...evidence].filter(id => !allowedSources.has(id));
  const evidenceComplete = scenario.relevantSources.every(id => evidence.has(id)) && unnecessaryEvidence.length === 0;
  const opened = new Set(submission.openedSources || []);
  if ([...evidence].some(id => !opened.has(id))) throw new Error('Open a source before citing it.');
  const actionCorrect = submission.action === scenario.action;
  const preciseReview = missed.length === 0 && unnecessary.length === 0;
  return {
    caseId: scenario.id, family: scenario.family, stage: scenario.stage,
    found, missed, unnecessary, unnecessaryEvidence, expectedIssues: expected.size,
    flaggedSentences: [...flagged], selectedEvidence: [...evidence],
    openedSources: [...opened], selectedAction: submission.action,
    actionCorrect, evidenceComplete, preciseReview,
    complete: actionCorrect && preciseReview && evidenceComplete,
    confidence: submission.confidence, assisted: Boolean(submission.assisted),
    // Reflect the submitted decision, never a claim that a real message was sent.
    disposition: submission.action === 'approve' && expected.size > 0 ? 'unsafe-approval'
      : actionCorrect && preciseReview && evidenceComplete ? 'supported-decision' : 'needs-review',
  };
}

export function summarizeSession(results) {
  const firstById = new Map();
  for (const result of results) {
    if (!firstById.has(result.caseId)) firstById.set(result.caseId, result);
  }
  const unique = [...firstById.values()];
  return {
    completed: unique.length,
    supportedDecisions: unique.filter(r => r.complete).length,
    issuesFound: unique.reduce((n, r) => n + r.found.length, 0),
    issuesMissed: unique.reduce((n, r) => n + r.missed.length, 0),
    unnecessaryFlags: unique.reduce((n, r) => n + r.unnecessary.length, 0),
    assistedCases: unique.filter(r => r.assisted).length,
    freshCasesCompleted: unique.filter(r => r.stage === 'transfer').length,
    // Case-level observations, deliberately not a validated competence score.
    observations: unique.map(r => ({ caseId: r.caseId, confidence: r.confidence, complete: r.complete })),
  };
}
