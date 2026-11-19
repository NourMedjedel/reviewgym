import { scenarios } from './scenarios.js?v=0.3.5';
import { bankingDe } from './banking-translations.js?v=0.3.5';

const translations = {
  ...bankingDe,
  'supplier-handoff': {
    title: 'Eine hilfreiche Übergabe', context: 'Kundenbetrieb', skill: 'Zulässige Weitergabe erkennen',
    request: 'Schicke unserem externen Softwareanbieter eine kurze Zusammenfassung des Exportfehlers. Er braucht genug Angaben, um ihn nachzustellen.',
    mission: 'Prüfe den Entwurf vor der Weitergabe an einen externen Anbieter.', recipient: 'Externer Anbieter',
    draft: ['CSV-Exporte schlagen fehl, wenn der Zeitraum den letzten Tag des Monats enthält.', 'Betroffen ist Juniper Bank, Konto JB-20491.', 'Die vertrauliche jährliche Supportgebühr beträgt CHF 84 000.', 'Stelle den Fehler in einer Testumgebung mit einem Zeitraum zum Monatsende nach; der Export meldet E104.'],
    documents: [
      ['Regeln zur externen Weitergabe', 'Aktuelle Richtlinie', 'Teile zur Fehleranalyse Symptome, Fehlercodes und Schritte zur Reproduktion. Kundennamen, Kontokennungen und Vertragskonditionen dürfen nur bei ausdrücklicher Autorisierung im Fall weitergegeben werden. Hier liegt keine solche Autorisierung vor.'],
      ['Supportticket', 'Fallprotokoll', 'Der CSV-Export zum Monatsende schlägt mit E104 fehl. Die Reproduktion in einer Testumgebung ist bestätigt. Der Anbieter benötigt keinen echten Kundendatensatz, um den Fehler nachzustellen.'],
    ],
    explanation: 'Der Anbieter braucht die Fehlerbeschreibung, nicht die Kundenidentität oder den Vertragspreis. Behalte Symptome und Reproduktionsschritte bei und entferne beide vertraulichen Sätze.',
    hint: 'Wer erhält die Nachricht? Welche Angaben sind zur Reproduktion nötig, welche brauchen eine Erlaubnis?',
    outcome: { unsafe: 'Kundenkennungen oder vertrauliche Preise würden extern weitergegeben.', safe: 'Der Anbieter erhält reproduzierbare technische Angaben ohne Kundenkennungen oder Vertragspreis.' },
    consequence: 'Auch eine gut formulierte Zusammenfassung kann unzulässige Informationen preisgeben.',
  },
  'expired-procedure': {
    title: 'Die überzeugende Frist', context: 'Interner Service Desk', skill: 'Die gültige Quelle prüfen',
    request: 'Heute um 09:00 Uhr ging ein priorisierter Vorfall ein. Entwirf eine Bestätigung mit der Frist für die erste Statusmeldung.',
    mission: 'Prüfe die zitierte Regel vor dem Versand einer zeitkritischen Antwort.', recipient: 'Intern anfragende Person',
    draft: ['Wir haben deinen priorisierten Vorfall erhalten und mit der ersten Prüfung begonnen.', 'Die erste Statusmeldung ist morgen bis 09:00 Uhr fällig, innerhalb von 24 Stunden [1].', 'Weitere Meldungen halten wir im Vorfallticket fest.'],
    documents: [
      ['[1] Vorfallverfahren v1', 'Archiviert · ersetzt', 'Archiviertes Verfahren. Bei priorisierten Vorfällen erfolgt die erste Statusmeldung innerhalb von 24 verstrichenen Stunden. Am 1. November 2026 durch v2 ersetzt.'],
      ['Vorfallverfahren v2', 'Gültig seit 1. Nov. 2026', 'Bei priorisierten Vorfällen ab dem 1. November 2026 muss die erste Statusmeldung innerhalb von vier verstrichenen Stunden nach Eingang erfolgen. Bei Eingang um 09:00 Uhr ist sie am selben Tag um 13:00 Uhr fällig.'],
    ],
    explanation: 'Die Quelle existiert, ist aber archiviert. Das aktuelle Verfahren verlangt die Meldung heute bis 13:00 Uhr. Eine echte Quelle ist nicht automatisch eine anwendbare Quelle.',
    hint: 'Prüfe bei einer Quellenangabe auch Gültigkeitsdatum und mögliche Nachfolgedokumente.',
    outcome: { unsafe: 'Die anfragende Person erhielte eine überholte Frist.', safe: 'Die veraltete Frist wird anhand der aktuellen Vierstundenregel korrigiert.' },
    consequence: 'Eine echte Quelle kann eine Antwort stützen, die inzwischen ungültig ist.',
  },
  'valid-summary': {
    title: 'Manchmal ist der Entwurf fertig', context: 'Projektkoordination', skill: 'Belegte Inhalte erkennen',
    request: 'Fasse die vereinbarten nächsten Schritte für den internen Projektkanal zusammen. Nenne nur bestätigte Entscheidungen.',
    mission: 'Entscheide, ob der Entwurf belegt ist. Möglicherweise ist nichts zu markieren.', recipient: 'Interner Projektkanal',
    draft: ['Asha bereitet den Testdatensatz bis Freitag vor.', 'Das Team prüft ihn am Montag, bevor es über den Pilotstart entscheidet.', 'Ein Starttermin für den Piloten wurde nicht vereinbart.'],
    documents: [
      ['Bestätigte Besprechungsnotizen', 'Von den Teilnehmenden freigegeben', 'Beschluss: Asha bereitet den Testdatensatz bis Freitag vor. Das Team prüft ihn am Montag. Der Pilotstart hängt von dieser Prüfung ab. Ein Starttermin wurde nicht vereinbart. Die Notizen dürfen im internen Projektkanal geteilt werden.'],
      ['Früheres Brainstorming', 'Ideen · keine Beschlüsse', 'Eine Idee war, sofort einen Piloten zu starten. Im Brainstorming wurde dazu keine Einigung erzielt.'],
    ],
    explanation: 'Alle drei Aussagen stimmen mit den bestätigten Notizen und dem vorgesehenen Empfängerkreis überein. Belegte Inhalte freizugeben gehört zu gutem Urteilsvermögen. Zusätzliche Skepsis ist nicht automatisch besser.',
    hint: 'Vergleiche jeden Satz mit den bestätigten Beschlüssen. Nicht jede Übung enthält einen Fehler.',
    outcome: { unsafe: 'Nützliche, belegte Arbeit würde unnötig verzögert.', safe: 'Die belegte Zusammenfassung ist für den internen Projektkanal bereit.' },
    consequence: 'Ziel ist angemessenes Vertrauen, nicht die pauschale Ablehnung von KI-Ausgaben.',
  },
  'unapproved-refund': {
    title: 'Ein voreiliges Versprechen', context: 'Kundensupport', skill: 'Berechtigung und Freigabe unterscheiden',
    request: 'Diese Person scheint die Voraussetzungen für eine Erstattung zu erfüllen. Bereite eine Antwort vor. Die Freigabe steht noch aus.',
    mission: 'Entscheide, was vor einer Zusage geschehen muss.', recipient: 'Kundin oder Kunde',
    draft: ['Vielen Dank für die Angaben zu deiner Anfrage.', 'Deine Erstattung wurde genehmigt und wird innerhalb von fünf Tagen ausgezahlt.', 'Bitte nenne bei Rückfragen deine Fallreferenz.'],
    documents: [
      ['Freigabeprotokoll', 'Ausstehend', 'Voraussetzungen: erfüllt. Freigabeentscheidung: ausstehend. Es ist keine Zahlung geplant.'],
      ['Erstattungsprozess', 'Aktuelle Richtlinie', 'Erfüllte Voraussetzungen sind keine Freigabe. Der Support darf eine Erstattung erst bestätigen, wenn die zuständige prüfende Person sie genehmigt hat. Leite offene Anträge vor einer Zahlungszusage an diese Person weiter.'],
    ],
    explanation: 'Der Assistent hat aus erfüllten Voraussetzungen eine verbindliche Zusage gemacht. Zuerst muss die zuständige Person entscheiden. Eine überzeugende Formulierung oder ein umgeschriebenes Versprechen ersetzt keine Freigabe.',
    hint: 'Was lässt sich aus den Daten ableiten? Was erfordert eine autorisierte Entscheidung?',
    outcome: { unsafe: 'Die Kundschaft erhielte eine nicht genehmigte Zahlungszusage.', safe: 'Die Zusage wird zurückgehalten und der Fall der zuständigen Person vorgelegt.' },
    consequence: 'Ein Assistent kann eine Entscheidung vorbereiten, ohne sie treffen zu dürfen.',
  },
  'workshop-transfer': {
    title: 'Neuer Kontext, gleiches Prinzip', context: 'Personalentwicklung', skill: 'Gelerntes auf einen neuen Kontext übertragen',
    request: 'Schicke der externen Workshop-Leitung die Lernbedürfnisse des Teams. Eine anonyme Übersicht reicht aus.',
    mission: 'Wende dein Urteil in einem neuen Kontext an. Entscheide vor der Rückmeldung.', recipient: 'Externe Workshop-Leitung',
    draft: ['Die Gruppe benötigt Übungen zur Quellenprüfung und zur Kontrolle von KI-generierten Nachrichten.', 'Die Person mit Kennung R-18 hat die interne Prüfung zweimal nicht bestanden und befindet sich in einem Leistungsförderplan.', 'Bitte plane praktische Übungen für unterschiedliche Erfahrungsstufen ein.'],
    documents: [
      ['Freigegebenes Workshop-Briefing', 'Externe Weitergabe erlaubt', 'Teile nur zusammengefasste Lernbedürfnisse und das Workshop-Format. Die externe Leitung darf keine individuellen Prüfungsergebnisse, Personalkennungen oder Leistungsinformationen erhalten.'],
      ['Lernbedürfnisse der Gruppe', 'Anonyme Übersicht', 'Gewünscht sind praktische Übungen zur Quellenprüfung und Nachrichtenkontrolle. Die Erfahrungsstufen sind unterschiedlich. Für die Planung werden keine individuellen Ergebnisse benötigt.'],
    ],
    explanation: 'Das Prinzip der auf das Nötige begrenzten Weitergabe gilt auch in einer anderen Abteilung. Behalte die Lernbedürfnisse der Gruppe bei und entferne individuelle Prüfungs- und Leistungsinformationen.',
    hint: 'Übertrage das zuvor geübte Prinzip auf den neuen Kontext.',
    outcome: { unsafe: 'Individuelle Prüfungs- und Leistungsinformationen würden extern weitergegeben.', safe: 'Die Workshop-Leitung erhält ein anonymes und nützliches Briefing.' },
    consequence: 'Gelerntes soll auch in einer neuen Situation anwendbar sein, nicht nur im bekannten Beispiel.',
  },
};

export const scenariosDe = scenarios.map(c => {
  const tr = translations[c.id];
  if (!tr) throw new Error(`Missing German case: ${c.id}`);
  return { ...c, ...tr,
    draft: c.draft.map((s, i) => ({ ...s, text: tr.draft[i] })),
    documents: c.documents.map((d, i) => ({ ...d, title: tr.documents[i][0], label: tr.documents[i][1], body: tr.documents[i][2] })),
  };
});
