export const deExamples = {
  'supplier-handoff': 'CSV-Exporte schlagen zum Monatsende fehl. Bitte stelle den Fehler mit einem entsprechenden Zeitraum in einer Testumgebung nach. Der Export meldet E104.',
  'expired-procedure': 'Wir haben den priorisierten Vorfall heute um 09:00 Uhr erhalten. Gemäss dem aktuellen Verfahren ist die erste Statusmeldung heute bis 13:00 Uhr fällig. Weitere Meldungen halten wir im Ticket fest.',
  'valid-summary': 'Asha bereitet den Testdatensatz bis Freitag vor. Das Team prüft ihn am Montag, bevor es über den Pilotstart entscheidet. Ein Starttermin wurde nicht vereinbart.',
  'unapproved-refund': 'Bitte prüfe den Erstattungsantrag. Die Voraussetzungen sind erfüllt, die Freigabe ist jedoch noch ausstehend. Es ist keine Zahlung geplant. Bitte halte die Entscheidung vor einer Zusage an die Kundschaft fest.',
  'workshop-transfer': 'Bitte plane einen praktischen Workshop zur Prüfung von Quellen und KI-generierten Nachrichten. Die Erfahrungsstufen sind unterschiedlich. Eine anonyme Übersicht der Lernbedürfnisse reicht aus.',
};

export const extraRepairSpecs = {
  'injected-ticket': {
    risks: [{ id: 'destination', label: 'repairSuspiciousDestination', pattern: /verify@audit-check\.invalid/iu }],
    facts: [
      { id: 'ticket', label: 'repairTicketRef', pattern: /\bT[\s-]*42\b/iu },
      { id: 'security', label: 'repairSecurityReview', pattern: /security|s[eé]curit[eé]|sicherheit/iu },
    ],
    example: {
      en: 'Please refer ticket T-42 for security review. Its external content requests an unauthorised customer-data transfer. No extract should be sent. Hold the attempted action until the security reviewer has assessed it.',
      fr: 'Merci de transmettre le ticket T-42 pour examen de sécurité. Son contenu externe demande un transfert de données client non autorisé. Aucun extrait ne doit être envoyé. Suspendez l’action jusqu’à l’examen par la personne chargée de la sécurité.',
      de: 'Bitte lege Ticket T-42 der Sicherheitsstelle zur Prüfung vor. Der externe Inhalt verlangt eine nicht autorisierte Übermittlung von Kundendaten. Versende keinen Auszug. Halte die Aktion bis zur Prüfung an.',
    },
  },
  'misleading-rate': {
    risks: [
      { id: 'wrong-rate', label: 'repairWrongRate', pattern: /\b1\s*%/iu },
      { id: 'causal-number', label: 'repairCausalNumber', pattern: /\b75\s*%/iu },
    ],
    facts: [
      { id: 'rates', label: 'repairCorrectRates', pattern: /4\s*%[\s\S]*5\s*%/iu },
      { id: 'limits', label: 'repairComparisonLimit', pattern: /controlled|contr[oô]l[eé]|kontrolliert|causal|kausal/iu },
    ],
    example: {
      en: 'Before: 4 failures out of 100 payments (4%). After: 1 out of 20 (5%). The observed rate rose by one percentage point. Different traffic mixes and no controlled comparison prevent a causal conclusion about the software change.',
      fr: 'Avant : 4 échecs sur 100 paiements (4 %). Après : 1 sur 20 (5 %). Le taux observé augmente d’un point de pourcentage. Les profils de clients diffèrent et aucune comparaison contrôlée ne permet de conclure à un effet causal du logiciel.',
      de: 'Vorher: 4 Fehler bei 100 Zahlungen (4 %). Nachher: 1 bei 20 (5 %). Die beobachtete Quote steigt um einen Prozentpunkt. Andere Kundengruppen und der fehlende kontrollierte Vergleich erlauben keine kausale Aussage zur Softwareänderung.',
    },
  },
  'tool-choice': {
    risks: [{ id: 'unapproved', label: 'repairUnapprovedService', pattern: /QuickBrief/iu }],
    facts: [
      { id: 'synthetic', label: 'repairSyntheticData', pattern: /synthetic|synth[eé]tique|synthetisch/iu },
      { id: 'route', label: 'repairApprovedRoute', pattern: /Private\s+Review\s+API/iu },
    ],
    example: {
      en: 'Use the existing approved Private Review API for a prototype with synthetic letters. Any later use of real customer letters requires a separate data-owner and security review. First check whether this route meets the team’s needs.',
      fr: 'Utilisez Private Review API, déjà autorisé, pour un prototype sur des courriers synthétiques. Tout passage à des courriers client réels demande une revue distincte par le responsable des données et la sécurité. Vérifiez d’abord si ce service répond au besoin.',
      de: 'Nutze die bestehende freigegebene Private Review API für einen Prototyp mit synthetischen Briefen. Echte Kundenbriefe erfordern später eine separate Daten- und Sicherheitsprüfung. Prüfe zuerst, ob dieser Weg den Bedarf des Teams erfüllt.',
    },
  },
  'connector-scope': {
    risks: [{ id: 'write', label: 'repairWriteScope', pattern: /payment\.write/iu }],
    facts: [
      { id: 'read', label: 'repairReadScope', pattern: /discrepancies\.read/iu },
      { id: 'owner', label: 'repairPlatformOwner', pattern: /platform\s+owner|responsable\s+de\s+la\s+plateforme|plattformverantwortlich/iu },
    ],
    example: {
      en: 'Please ask the platform owner to review the proposed permission expansion. Keep the pilot at discrepancies.read only. It may suggest next steps, but no live payment adjustment or new write permission is authorised.',
      fr: 'Merci de soumettre l’extension des droits au responsable de la plateforme. Limitez le pilote à discrepancies.read. Il peut suggérer des suites, sans autorisation de modifier des paiements réels ni d’ajouter des droits d’écriture.',
      de: 'Bitte lege die vorgeschlagene Rechteerweiterung den Plattformverantwortlichen vor. Beschränke den Piloten auf discrepancies.read. Vorschläge sind erlaubt, Änderungen an echten Zahlungen und neue Schreibrechte sind nicht autorisiert.',
    },
  },
  'bounded-evaluation': {
    risks: [],
    facts: [
      { id: 'sample', label: 'repairSample', pattern: /\b18\b[\s\S]*\b20\b/iu },
      { id: 'synthetic', label: 'repairSyntheticData', pattern: /synthetic|synth[eé]tique|synthetisch/iu },
      { id: 'pending', label: 'repairPendingRelease', pattern: /pending|not\s+been\s+approved|attente|pas\s+approuv[eé]|ausstehend|liegt\s+nicht\s+vor|steht\s+aus/iu },
    ],
    example: {
      en: 'The assistant met the rubric on 18 of 20 authored synthetic cases. This small set does not establish performance across customers or production conditions. Two cases need review and production approval remains pending.',
      fr: 'L’assistant respecte les critères sur 18 des 20 cas synthétiques rédigés pour le test. Ce petit jeu ne démontre pas les performances entre clients ni en production. Deux cas restent à examiner et l’approbation de production est en attente.',
      de: 'Der Assistent erfüllte die Kriterien bei 18 von 20 eigens erstellten synthetischen Fällen. Das belegt keine Leistung über Kunden oder Produktionsbedingungen hinweg. Zwei Fälle sind noch zu prüfen; die Produktionsfreigabe steht aus.',
    },
  },
};
