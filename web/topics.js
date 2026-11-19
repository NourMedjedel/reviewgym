export const topics = [
  { id: 'privacy', title: 'topicPrivacy', description: 'topicPrivacyDescription', cases: ['supplier-handoff', 'workshop-transfer'] },
  { id: 'evidence', title: 'topicEvidence', description: 'topicEvidenceDescription', cases: ['expired-procedure', 'misleading-rate'] },
  { id: 'agents', title: 'topicAgents', description: 'topicAgentsDescription', cases: ['injected-ticket', 'connector-scope'] },
  { id: 'adoption', title: 'topicAdoption', description: 'topicAdoptionDescription', cases: ['tool-choice', 'valid-summary'] },
  { id: 'oversight', title: 'topicOversight', description: 'topicOversightDescription', cases: ['unapproved-refund', 'bounded-evaluation'] },
];

export function topicFor(caseId) {
  return topics.find(topic => topic.cases.includes(caseId));
}
