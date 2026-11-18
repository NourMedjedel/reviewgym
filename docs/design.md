# Product brief

## Purpose

People adopting AI at work need opportunities to practise judgment, with clear
feedback and low stakes. A polished written explanation or completed course is
not enough to establish that someone can act appropriately in a fresh situation.
ReviewGym makes parts of that behaviour observable without claiming to measure
everything about understanding.

The learner reviews a simulated assistant response in a fictional workplace.
They can consult sources and request a hint. They flag sentences, cite evidence,
choose an action and report confidence before receiving feedback. The scenario
shows a simulated consequence; nothing is sent to any customer or external party.

## Initial scope

The English and French cases share stable IDs and a deterministic rubric. They
cover confidentiality, source freshness, appropriate reliance and authority.
One fresh-context case reuses the confidentiality principle in another department.
It is a transfer opportunity, not an independently validated transfer assessment.

The experience avoids timers and speed-based rewards. Correct answers are
included so that rejecting everything is not a successful strategy. A request for
help is recorded as an observation, not penalised as misconduct.

## Evidence and limits

- Buçinca, Malaya and Gajos (2021), [To Trust or to Think](https://arxiv.org/abs/2102.09692):
  an experiment with 199 participants found reduced overreliance using cognitive
  forcing interventions, with lower subjective preference for the more effective
  designs. This motivates trying reflective interactions, not imposing friction
  everywhere or claiming that this particular interface works.
- Lee et al. (2025), [The Impact of Generative AI on Critical Thinking](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/):
  a survey of 319 knowledge workers with 936 examples found associations between
  confidence and self-reported critical-thinking effort. It does not establish
  that AI use causes skill loss or that this training improves skills.

Current observations are first-attempt issue detection, unnecessary flags, selected
evidence, next action, self-reported confidence and hint use. They are not a
validated latent skill measure. Browser-local answers are inspectable, identities
are not checked, and external assistance is unknown.

## How effectiveness could be studied

Pilot the content with representative learners and domain reviewers. For a later
consented study, compare guided practice with a suitable alternative, use matched
new cases before and after, and include a delayed check. Report both missed risks
and unnecessary rejection of correct output. Account for hints and prior domain
knowledge. Do not treat faster completion or satisfaction as proof of learning.

## Technical boundary

The current app has no backend or language model. Its AI responses are labelled
simulations. The authored rubric is separate from the UI. A later optional coach
may use a local model to discuss evidence and ask questions, with source-constrained
feedback and versioned evaluation. It must not silently rewrite the rubric or
issue certification decisions.

## Relevance to AI enablement

The generic scenario engine can support internal team training and reusable case
packs. A banking-software organisation could adapt it for synthetic support,
operations or internal knowledge work after reviewing the content. No actual
Finnova policy, client data, internal system or endorsement is assumed.
