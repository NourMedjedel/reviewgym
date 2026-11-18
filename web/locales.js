import { repairLocales } from './repair-locales.js?v=0.2.0';

export const locales = {
  en: {
    ...repairLocales.en,
    language: 'Language', practiceCases: 'Practice cases', workspace: 'Workspace', home: 'ReviewGym home',
    noConcerns: 'No concerns needed flagging',
    pageTitle: 'ReviewGym — Practise your AI judgment', skip: 'Skip to the case', beta: 'PLAYABLE PROTOTYPE', idea: 'The idea', session: 'Your session',
    room: 'THE PRACTICE ROOM', intro: 'AI is fast.\nYour judgment matters.', roomDescription: 'Five small workplace decisions.\nReal things to think about.',
    noCases: 'No cases reviewed yet', progress: '{done} of {total} cases reviewed',
    note: 'Some drafts need fixing.\nSome are already good.\nChecking is the skill.', privacy: 'Synthetic cases. No account.\nProgress stays in this browser.',
    yourReview: 'YOUR REVIEW', draftHeading: 'The assistant’s draft', simulated: 'Simulated AI output', instructions: 'Select any sentence that needs attention. Leave supported sentences unmarked.',
    audience: 'Intended audience', noFlags: 'No sentences flagged', flags: '{n} sentence(s) flagged for attention', hint: 'I’d like a hint',
    makeCall: 'MAKE THE CALL', nothingSent: 'Nothing is actually sent', nextAction: 'What should happen next?', confidence: 'How confident are you in your review?', unsure: 'Still unsure', sure: 'Very confident',
    commit: 'Check the sources, then commit to a decision.', retryInstruction: 'Practice retry. Your first attempt stays in the session record.', submit: 'See the consequence', retrySubmit: 'Review this practice retry', complete: 'Review complete',
    evidenceEyebrow: 'DON’T TAKE ITS WORD FOR IT', evidenceHeading: 'Check the evidence', evidenceIntro: 'Open the source. Cite the ones that support your decision.',
    evidenceNote: 'A citation can be real and still be outdated, irrelevant or insufficient.', helpAllowed: 'Help is allowed.', helpDescription: 'This is a practice space. Requested hints are recorded alongside your first attempt.',
    sourceLabel: 'Use as evidence for my decision', fresh: 'FRESH CONTEXT', guided: 'GUIDED PRACTICE', freshCase: 'Fresh case', colleague: 'Your colleague',
    approve: 'Approve', approveDescription: 'Ready for its intended audience', revise: 'Revise', reviseDescription: 'Fix the draft before it is used', escalate: 'Escalate', escalateDescription: 'A responsible person must decide',
    supportedCase: 'SUPPORTED IN THIS CASE', practiceMoment: 'A PRACTICE MOMENT', goodTitle: 'A decision you can stand behind.', unsafeTitle: 'The draft needed another look.', reviewTitle: 'Let’s unpack this decision.',
    consequence: 'SIMULATED CONSEQUENCE', staysReview: 'The case stays in review. Check the highlighted sentences and evidence before deciding.', found: 'concerns found', unnecessary: 'unnecessary flags', evidence: 'Evidence', supported: 'supported', incomplete: 'incomplete', confidenceLabel: 'Confidence', selfReported: 'self-reported',
    retry: 'Practise this case again', next: 'Continue practice', tryFresh: 'Try the fresh case', reviewSession: 'Review your session', firstAttemptNote: 'Your first attempt is retained. A correct practice response is not a certification of competence.',
    firstAttempts: 'YOUR FIRST ATTEMPTS', sessionTitle: 'What your practice shows', observations: 'Observations from {n} authored case(s), not an overall AI skill score.', supportedDecisions: 'Supported decisions', missedConcerns: 'Concerns missed', extraFlags: 'Unnecessary flags', needsPractice: 'Needs practice', hintUsed: 'hint used',
    assisted: '{n} case(s) with a requested hint. {fresh} fresh-context case(s) completed. External AI use cannot be detected by this prototype.', sessionLimit: 'A fresh case checks the same principle in a different setting. Improvement and long-term retention still need a proper learner study.',
    reset: 'Reset local progress', download: 'Download session record', resetTitle: 'Reset this practice session?', resetText: 'This removes the practice record from this browser. Download your session first if you want to keep it.', keep: 'Keep my session', confirmReset: 'Reset progress',
    aboutEyebrow: 'AI ENABLEMENT THROUGH PRACTICE', aboutTitle: 'Understanding shows up in decisions.', aboutIntro: 'ReviewGym lets you practise with plausible assistant output, inspect fictional evidence, and choose what happens next. Some answers are wrong. Some are correct. The work is deciding which is which.',
    aboutHelp: 'Hints support learning and are recorded. This prototype cannot establish whether you used another assistant, memorised an answer or understood it independently.', freshTitle: 'Feedback, then a fresh context', freshText: 'Get a concrete explanation, then try a different situation that uses the same principle. Your first attempt is retained separately from retries.',
    researchTitle: 'Research-informed, not learning-validated', researchText: 'Research on cognitive forcing found reduced overreliance in a specific experimental task, with a usability trade-off. It does not validate this app.', readStudy: 'Read the study', authored: 'All cases and AI drafts are human-authored and fictional. The rubric is deterministic and inspectable in the source. No model calls, external tracking, accounts or real workplace data are involved.',
    close: 'Close dialog', error: 'Please check your review and choose a next action.',
  },
  fr: {
    ...repairLocales.fr,
    language: 'Langue', practiceCases: 'Cas pratiques', workspace: 'Espace de travail', home: 'Accueil ReviewGym',
    noConcerns: 'Aucun point à signaler',
    pageTitle: 'ReviewGym — Exercez votre discernement face à l’IA', skip: 'Aller au cas pratique', beta: 'PROTOTYPE INTERACTIF', idea: 'Le concept', session: 'Votre session',
    room: 'L’ESPACE D’ENTRAÎNEMENT', intro: 'L’IA va vite.\nVotre jugement compte.', roomDescription: 'Cinq décisions du quotidien.\nDe vraies questions à se poser.',
    noCases: 'Aucun cas examiné pour le moment', progress: '{done} cas examinés sur {total}',
    note: 'Certains brouillons sont à corriger.\nD’autres sont déjà bons.\nSavoir vérifier, ça se travaille.', privacy: 'Cas fictifs. Sans compte.\nVotre progression reste dans ce navigateur.',
    yourReview: 'VOTRE RELECTURE', draftHeading: 'Le brouillon de l’assistant', simulated: 'Réponse d’IA simulée', instructions: 'Sélectionnez les phrases qui demandent votre attention. Ne signalez pas celles qui sont étayées.',
    audience: 'Destinataire prévu', noFlags: 'Aucune phrase signalée', flags: '{n} phrase(s) à examiner', hint: 'Je voudrais un indice',
    makeCall: 'À VOUS DE DÉCIDER', nothingSent: 'Aucun message n’est envoyé', nextAction: 'Que doit-il se passer ensuite ?', confidence: 'À quel point êtes-vous sûr de votre relecture ?', unsure: 'Encore des doutes', sure: 'Très sûr',
    commit: 'Vérifiez les sources, puis prenez une décision.', retryInstruction: 'Nouvel essai. Votre première tentative reste enregistrée.', submit: 'Voir la conséquence', retrySubmit: 'Examiner ce nouvel essai', complete: 'Relecture terminée',
    evidenceEyebrow: 'NE LE CROYEZ PAS SUR PAROLE', evidenceHeading: 'Vérifiez les éléments', evidenceIntro: 'Ouvrez les sources et citez celles qui étayent votre décision.',
    evidenceNote: 'Une citation peut être réelle, mais dépassée, hors sujet ou insuffisante.', helpAllowed: 'L’aide est autorisée.', helpDescription: 'C’est un espace d’entraînement. Les indices demandés sont enregistrés avec votre première tentative.',
    sourceLabel: 'Citer cette source pour ma décision', fresh: 'NOUVEAU CONTEXTE', guided: 'ENTRAÎNEMENT GUIDÉ', freshCase: 'Nouveau contexte', colleague: 'Votre collègue',
    approve: 'Approuver', approveDescription: 'Prêt pour son destinataire', revise: 'Corriger', reviseDescription: 'Revoir le brouillon avant utilisation', escalate: 'Transmettre', escalateDescription: 'Une personne habilitée doit décider',
    supportedCase: 'DÉCISION ÉTAYÉE POUR CE CAS', practiceMoment: 'L’OCCASION DE PROGRESSER', goodTitle: 'Une décision que vous pouvez justifier.', unsafeTitle: 'Le brouillon méritait un autre regard.', reviewTitle: 'Examinons votre décision.',
    consequence: 'CONSÉQUENCE SIMULÉE', staysReview: 'Le dossier reste à examiner. Vérifiez les phrases mises en évidence et les sources avant de décider.', found: 'points repérés', unnecessary: 'signalements inutiles', evidence: 'Justification', supported: 'étayée', incomplete: 'incomplète', confidenceLabel: 'Confiance', selfReported: 'déclarée',
    retry: 'Refaire ce cas', next: 'Continuer l’entraînement', tryFresh: 'Essayer le nouveau contexte', reviewSession: 'Voir le bilan', firstAttemptNote: 'Votre première tentative est conservée. Réussir un exercice ne certifie pas votre compétence.',
    firstAttempts: 'VOS PREMIÈRES TENTATIVES', sessionTitle: 'Ce que montre votre entraînement', observations: 'Observations sur {n} cas rédigé(s), et non un score global de maîtrise de l’IA.', supportedDecisions: 'Décisions étayées', missedConcerns: 'Points manqués', extraFlags: 'Signalements inutiles', needsPractice: 'À retravailler', hintUsed: 'indice utilisé',
    assisted: '{n} cas avec un indice demandé. {fresh} cas terminé(s) dans un nouveau contexte. Ce prototype ne détecte pas l’usage d’une IA externe.', sessionLimit: 'Le nouveau contexte reprend le même principe dans une autre situation. Les progrès et la mémorisation à long terme nécessitent une véritable étude auprès des apprenants.',
    reset: 'Réinitialiser la progression', download: 'Télécharger le bilan', resetTitle: 'Réinitialiser cet entraînement ?', resetText: 'Le bilan sera supprimé de ce navigateur. Téléchargez-le d’abord si vous souhaitez le conserver.', keep: 'Conserver ma session', confirmReset: 'Réinitialiser',
    aboutEyebrow: 'APPRENDRE À UTILISER L’IA PAR LA PRATIQUE', aboutTitle: 'La compréhension se voit dans les décisions.', aboutIntro: 'ReviewGym propose des réponses plausibles, des sources fictives à vérifier et une décision à prendre. Certaines réponses sont erronées, d’autres correctes. À vous de faire la différence.',
    aboutHelp: 'Les indices soutiennent l’apprentissage et sont enregistrés. Ce prototype ne peut pas déterminer si vous avez utilisé un autre assistant, mémorisé une réponse ou compris de façon autonome.', freshTitle: 'Un retour, puis un nouveau contexte', freshText: 'Recevez une explication concrète, puis appliquez le même principe à une autre situation. Votre première tentative est conservée séparément des nouveaux essais.',
    researchTitle: 'Éclairé par la recherche, à évaluer auprès des apprenants', researchText: 'Des travaux sur l’effort de réflexion ont réduit la confiance excessive en l’IA dans une tâche expérimentale précise, avec un compromis sur le confort d’utilisation. Ils ne valident pas cette application.', readStudy: 'Lire l’étude', authored: 'Tous les cas et brouillons d’IA sont rédigés par une personne et fictifs. Le barème est déterministe et consultable dans le code. Aucun appel de modèle, suivi externe, compte ou donnée professionnelle réelle n’intervient.',
    close: 'Fermer la fenêtre', error: 'Vérifiez votre relecture et choisissez une action.',
  },
};

export function translate(language, key, values = {}) {
  const template = locales[language]?.[key];
  if (template === undefined) throw new Error(`Unknown translation: ${language}/${key}`);
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}
