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

The English, French and Swiss-standard-German cases share stable IDs and a
deterministic rubric. Ten exercises are grouped into five topics: privacy,
evidence and numbers, agents and permissions, tool adoption, and human oversight.
They cover confidentiality, source freshness, appropriate reliance and authority,
plus denominator errors, unsupported causal claims, prompt injection, least
privilege, tool selection and bounded evaluation reporting.
One fresh-context case reuses the confidentiality principle in another department.
It is a transfer opportunity, not an independently validated transfer assessment.

The library is separate from the single-exercise view. Sources open on demand,
reflection is optional, and a recorded review collapses when feedback appears.
The field guide contains reusable habits and primary-source context. The
monochrome visual system uses a display heading and a separate editorial topic
column. A banknote-inspired guilloche engraving replaces literal banking icons.
A stationary glass review lens magnifies its linework while the engraved seal and
fine orbital security threads rotate slowly underneath. The drawing connects
financial-document authenticity with the act of inspecting AI output, without
text overlays. Reduced-motion preferences disable both animations. This is an
original decorative metaphor, not a real banknote, an authenticity test, live
telemetry, or a security claim.
The exercise view keeps the same focused sequence, with context, draft, sources
and decision. The
experience avoids timers and speed-based rewards. Correct answers are
included so that rejecting everything is not a successful strategy. A request for
help is recorded as an observation, not penalised as misconduct.

## Rewrite workshop

After committing to a review, the learner edits the actual message alongside a
live recipient preview. A refund escalation becomes a note to the designated
internal reviewer; it does not become a customer promise. A correct draft can be
kept as it is. English, French and German working texts are saved separately.

The quick check uses bounded, authored regular expressions to highlight known
exercise details and notice missing context. It does not validate free-form
meaning: negation, paraphrases and unrelated new errors can defeat these patterns.
Even a text containing every expected keyword still requires human source review.
No warning is labelled an approval. Tests include a deliberately incorrect
keyword-complete rewrite to make this boundary explicit.

The first checked rewrite and latest check are distinct snapshots. Viewing an
authored example is recorded without replacing the learner’s text. Changing a
checked draft invalidates its displayed feedback until it is checked again.
These records remain separate from the first review decision. Export schema 2
added `rewrites` (case → language → draft, first/latest attempts, example viewed)
and `rewriteSummary`. Export schema 3 adds the catalog version and current language.
Confidence is now `null` until the learner changes the optional confidence input;
it is not silently recorded as 50%. Historical values are retained as recorded.
Version-1 browser sessions retain their original reviews and case identifiers.
All text stays in browser storage unless the learner downloads the JSON export;
the editor asks for fictional details only.

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

## Domain references

- [FINMA Guidance 08/2024](https://www.finma.ch/en/news/2024/12/20241218-mm-finma-am-08-24/),
  published 18 December 2024, describes governance and risk-management themes for
  financial institutions. It informs topic selection, especially model, data and
  third-party risks. This does not establish that Finnova is directly supervised
  under this guidance or that ReviewGym satisfies any regulatory obligation.
- [OWASP LLM01:2025](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
  informs the boundary between retrieved content and authorised instructions.
- [OWASP LLM06:2025](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)
  informs tool permissions, limited autonomy and approval outside the model.

Sources were checked on 19 November 2026. These are research or technical context,
not the exercise answer key. The answer key is each case’s explicit fictional
source set. No case uses actual customer data, real permissions or money movement.

## Content and language review

New cases and translations were prepared with AI assistance. Automated tests
check IDs, sentence/source counts, required evidence, decisions, translations and
authored rewrite examples across all three languages. German uses Swiss standard
spelling and an informal singular address; French uses formal address. These
checks do not establish native-speaker approval or independent domain validation.
The next content milestone is external review, with issues and reviewer evidence
recorded before calling a case independently reviewed.

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
