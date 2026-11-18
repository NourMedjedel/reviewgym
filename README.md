# ReviewGym

**Practise the decisions that make AI useful at work.**

Review a plausible assistant draft, inspect the source documents, flag the claims
that need attention and decide whether to approve, revise or involve an authorised
person. See a simulated consequence, get feedback and try the same principle in a
different context. Then edit the message yourself with a live recipient preview.
Some drafts are already correct.

**English and French included.** Language switching preserves the current review
and session history. All scenarios, policies and assistant drafts are fictional
and human-authored. No LLM or paid API is needed to run the prototype.

![ReviewGym workplace review, with a sentence flagged and a source open](docs/preview-en.png)

## Run locally

Requires Python 3 for the static server. From the repository root:

```bash
python3 -m http.server 8788 --bind 127.0.0.1 --directory web
```

Open <http://127.0.0.1:8788>. Alternatively, `npm run dev` starts the same server.
No package installation or build step is needed. Node 20+ is only required for tests:

```bash
npm test
```

## First demo

1. Open **A helpful handoff** / **Un récapitulatif bien utile**.
2. Inspect the draft and the external-sharing rule.
3. Flag the customer identifiers and confidential price. Cite the rule and choose
   **Revise** / **Corriger** to see the consequence.
4. Open the **rewrite workshop**, remove those confidential details and keep the
   reproduction steps. Watch the recipient preview update, then check the rewrite.
5. Try the supported summary and the fresh HR-context case. Switch EN/FR at any time;
   each language keeps its own working draft.

Other cases cover a real but archived citation and a refund promise made before
human approval. The rubric checks sentence-level observations, source selection
and the next action. Selecting every sentence or citing both current and obsolete
procedures does not earn a supported result.

![Rewrite workshop with an editable message, recipient preview and explicit checks](docs/repair-preview-en.png)

The rewrite check highlights configured details from each exercise and looks for
useful context that may have been removed. It uses authored text patterns, not an
LLM judge. It can miss errors or flag harmless mentions; **it never approves the
meaning of a rewrite**. Compare the result with the sources. An optional authored
example is marked as assistance and does not overwrite your draft.

## What the record means

The session retains the **first attempt** separately from retries. It records
missed concerns, unnecessary flags, evidence selection, next action, reported
confidence and requested hints. Download an inspectable JSON summary from
**Your session** / **Votre session**.

The JSON export (schema version 2) also contains working rewrites by case and
language, their first and latest checked versions, and whether an example was
viewed. Editing a message does not replace the first review decision. Exports
include the text you typed; use fictional details only.

This is a formative practice tool, not an identity-verified exam, an anti-cheating
system or a validated competence score. External AI assistance cannot be detected.
Opening a source does not prove that someone read or understood it. The first
prototype has five cases and only one fresh-context case; it does not establish
learning gains, generalisation or long-term retention. Rubrics are deliberately
visible in the browser source.

Progress uses localStorage when available and otherwise lasts for the current
page session. No user accounts, telemetry, real workplace uploads or external
model requests are involved. Reset is available in the session panel.

## Design and research

The product brief and research limits are in [docs/design.md](docs/design.md).
The initial experience is informed by research on reflection and AI reliance,
including [Buçinca et al. (2021)](https://arxiv.org/abs/2102.09692). That experiment
found reduced overreliance in its studied task, alongside a usability trade-off;
it does not validate ReviewGym. [Lee et al. (2025)](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/)
reports self-reported critical-thinking patterns, not a causal test of training.

## Next work

- Test the cases with nontechnical learners and trainers; revise ambiguous rubrics.
- Add case variants and independently reviewed content packs.
- Offer an optional local-model coach that points to evidence; keep the authored
  rubric separate from generated explanations.
- Evaluate learning using new cases and a delayed follow-up, with clear consent
  and a comparison condition before claiming effectiveness.

Independent portfolio prototype by Nour Medjedel. Not affiliated with Finnova,
Microsoft or any training/certification provider. MIT licensed.
