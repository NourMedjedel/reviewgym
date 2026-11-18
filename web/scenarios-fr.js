import { scenarios } from './scenarios.js?v=0.2.0';

const translations = {
  'supplier-handoff': {
    title: 'Un récapitulatif bien utile', context: 'Opérations clients', skill: 'Choisir ce qui peut être partagé',
    request: 'Peux-tu envoyer à notre prestataire logiciel un résumé du bug d’export ? Il lui faut assez de détails pour le reproduire.',
    mission: 'Vérifiez le brouillon avant son envoi à un prestataire externe.', recipient: 'Prestataire externe',
    draft: [
      'Les exports CSV échouent lorsque la période inclut le dernier jour du mois.',
      'Le client concerné est Juniper Bank, compte JB-20491.',
      'Le montant confidentiel de son contrat annuel de support est de 84 000 CHF.',
      'Pour reproduire le problème, utilisez une période de fin de mois dans un environnement de test : l’export renvoie l’erreur E104.',
    ],
    documents: [
      ['Règles de partage externe', 'Politique en vigueur', 'Pour le dépannage par un prestataire, partagez les symptômes, les codes d’erreur et les étapes de reproduction. Ne partagez ni nom de client, ni identifiant de compte, ni conditions commerciales sans autorisation explicite dans le dossier. Aucune autorisation n’est enregistrée ici.'],
      ['Ticket de support', 'Dossier du cas', 'L’export CSV de fin de mois échoue avec E104. La reproduction dans un environnement de test est confirmée. Le prestataire n’a pas besoin d’un vrai dossier client pour reproduire le problème.'],
    ],
    explanation: 'Le prestataire a besoin des détails du bug, pas de l’identité du client ni du prix du contrat. Conservez le symptôme et les étapes de reproduction ; retirez les deux phrases confidentielles.',
    hint: 'Regardez à qui le message est destiné. Quels détails sont nécessaires pour reproduire le bug ? Lesquels nécessitent une autorisation ?',
    outcome: { unsafe: 'Le prestataire recevrait des identifiants client ou un tarif confidentiel.', safe: 'Le prestataire reçoit des détails techniques reproductibles, sans identifiants client ni prix du contrat.' },
    consequence: 'Un résumé bien rédigé peut divulguer des informations que son destinataire n’est pas autorisé à recevoir.',
  },
  'expired-procedure': {
    title: 'Un délai annoncé avec assurance', context: 'Support interne', skill: 'Vérifier la version applicable',
    request: 'Nous avons reçu un incident prioritaire à 9 h aujourd’hui. Prépare un accusé de réception précisant quand le premier point de situation est dû.',
    mission: 'Vérifiez la procédure citée avant d’envoyer une réponse avec un délai.', recipient: 'Demandeur interne',
    draft: [
      'Nous avons reçu votre incident prioritaire et commencé son examen.',
      'Le premier point de situation est prévu pour 9 h demain, soit dans un délai de 24 heures [1].',
      'Les prochains points de situation seront consignés dans le ticket d’incident.',
    ],
    documents: [
      ['[1] Procédure d’incident v1', 'Archivée · remplacée', 'Procédure archivée. Pour les incidents prioritaires, le premier point de situation doit être envoyé dans les 24 heures écoulées. Remplacée par la v2 le 1er novembre 2026.'],
      ['Procédure d’incident v2', 'En vigueur depuis le 1er nov. 2026', 'Pour les incidents prioritaires reçus après le 1er novembre 2026, envoyez le premier point de situation dans les quatre heures écoulées suivant la réception. Pour un incident reçu à 9 h, le premier point est dû à 13 h le même jour.'],
    ],
    explanation: 'La citation existe, mais elle renvoie à une procédure archivée. La version actuelle impose un point de situation à 13 h aujourd’hui. Une source réelle n’est pas forcément une source applicable.',
    hint: 'Un numéro de citation n’est qu’un début de vérification. Regardez la date d’application et les documents de remplacement.',
    outcome: { unsafe: 'Le demandeur recevrait un délai fondé sur une procédure dépassée.', safe: 'Le délai obsolète est retenu pour correction selon la règle actuelle des quatre heures.' },
    consequence: 'Une source authentique peut justifier une réponse qui n’est plus valable.',
  },
  'valid-summary': {
    title: 'Parfois, le brouillon est prêt', context: 'Coordination de projet', skill: 'Reconnaître une réponse fondée',
    request: 'Résume les prochaines étapes pour le canal interne du projet. Inclus uniquement les décisions confirmées.',
    mission: 'Vérifiez si le brouillon est étayé. Il n’y a pas forcément de problème à signaler.', recipient: 'Canal interne du projet',
    draft: [
      'Asha préparera un jeu de données de test pour vendredi.',
      'L’équipe l’examinera lundi avant de décider de lancer le pilote.',
      'Aucune date de lancement du pilote n’a été convenue.',
    ],
    documents: [
      ['Compte rendu validé', 'Approuvé par les participants', 'Décision : Asha prépare un jeu de données de test pour vendredi. L’équipe l’examine lundi. Le début du pilote dépend de cet examen. Aucune date de lancement n’a été convenue. Ces notes peuvent être partagées dans le canal interne du projet.'],
      ['Réflexions préliminaires', 'Idées · pas des décisions', 'Une proposition consistait à lancer immédiatement un pilote. Aucun accord n’a été trouvé pendant cette séance.'],
    ],
    explanation: 'Les trois phrases correspondent au compte rendu validé et au public visé. Savoir approuver une réponse étayée fait partie du discernement. Se méfier davantage n’est pas toujours mieux.',
    hint: 'Comparez chaque phrase aux décisions confirmées. Ne supposez pas que chaque exercice contient une erreur.',
    outcome: { unsafe: 'Un travail utile et étayé serait retardé sans raison.', safe: 'Le résumé étayé peut être partagé dans le canal interne du projet.' },
    consequence: 'L’objectif est de faire confiance à bon escient, pas de rejeter toutes les réponses d’un assistant.',
  },
  'unapproved-refund': {
    title: 'Une promesse de trop', context: 'Service client', skill: 'Distinguer éligibilité et approbation',
    request: 'Ce client semble éligible à un remboursement. Prépare la réponse ; la demande d’approbation est encore en attente.',
    mission: 'Décidez de ce qui doit se passer avant de prendre un engagement envers le client.', recipient: 'Client',
    draft: [
      'Merci de nous avoir transmis les détails de votre demande.',
      'Votre remboursement a été approuvé et sera versé dans un délai de cinq jours.',
      'Merci de rappeler la référence de votre dossier dans tout prochain message.',
    ],
    documents: [
      ['Suivi de l’approbation', 'En attente', 'Vérification d’éligibilité : positive. Décision d’approbation : en attente. Aucun versement n’a été programmé.'],
      ['Procédure de remboursement', 'Politique en vigueur', 'Une vérification d’éligibilité ne vaut pas approbation. Un agent de support ne peut confirmer un remboursement qu’après l’approbation enregistrée par la personne désignée. Transmettez les demandes en attente à cette personne avant de vous engager sur un paiement.'],
    ],
    explanation: 'L’assistant a transformé une éligibilité probable en engagement confirmé. La personne désignée doit d’abord décider. Ni une formulation assurée ni une promesse réécrite ne donnent cette autorisation.',
    hint: 'Que peut déduire l’assistant ? Qu’est-ce qui exige la décision d’une personne habilitée ?',
    outcome: { unsafe: 'Le client recevrait un engagement de paiement non approuvé.', safe: 'La promesse est retenue et le dossier est transmis à la personne habilitée.' },
    consequence: 'Un assistant peut aider à préparer une décision sans être habilité à la prendre.',
  },
  'workshop-transfer': {
    title: 'Autre contexte, même discernement', context: 'Ressources humaines', skill: 'Réutiliser ce que vous avez appris',
    request: 'Envoie les besoins de formation de l’équipe à notre intervenant externe. Une synthèse anonyme lui suffit.',
    mission: 'Appliquez le principe à une nouvelle situation. Décidez avant de voir le retour.', recipient: 'Intervenant externe',
    draft: [
      'Le groupe bénéficierait d’exercices de vérification des sources et de relecture de messages produits par IA.',
      'La personne R-18 a échoué deux fois à l’évaluation interne et fait l’objet d’un accompagnement pour ses performances.',
      'Prévoyez des exercices pratiques adaptés à des niveaux d’expérience variés.',
    ],
    documents: [
      ['Brief validé pour l’intervenant', 'Partage externe autorisé', 'Partagez les besoins collectifs et le format de l’atelier. L’intervenant n’est pas autorisé à recevoir des résultats individuels, des identifiants de personnel ou des informations sur les performances.'],
      ['Besoins collectifs', 'Synthèse anonyme', 'Les participants demandent des exercices pratiques de vérification des sources et de relecture. Les niveaux d’expérience varient. Aucun résultat individuel n’est nécessaire à la préparation de l’atelier.'],
    ],
    explanation: 'Le même principe de partage limité au nécessaire s’applique dans un autre service. Gardez les besoins collectifs et retirez les résultats individuels ainsi que les informations sur les performances.',
    hint: 'Ce cas vous propose d’appliquer le principe précédent à un autre contexte.',
    outcome: { unsafe: 'Des résultats individuels et des informations de performance seraient partagés à l’extérieur.', safe: 'L’intervenant reçoit une synthèse anonyme et utile pour préparer l’atelier.' },
    consequence: 'L’apprentissage doit pouvoir être réutilisé, au-delà de l’exemple exact sur lequel vous vous êtes exercé.',
  },
};

export const scenariosFr = scenarios.map(c => {
  const tr = translations[c.id];
  return { ...c, ...tr,
    draft: c.draft.map((s, i) => ({ ...s, text: tr.draft[i] })),
    documents: c.documents.map((d, i) => ({ ...d, title: tr.documents[i][0], label: tr.documents[i][1], body: tr.documents[i][2] })),
  };
});
