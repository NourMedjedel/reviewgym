import { scenarios as scenariosEn, actions } from './scenarios.js?v=0.1.0';
import { scenariosFr } from './scenarios-fr.js?v=0.1.0';
import { translate } from './locales.js?v=0.1.0';
let scenarios = scenariosEn;
let language = 'en';
const t = (key, values) => translate(language, key, values);
import { reviewCase, summarizeSession } from './engine.js?v=0.1.0';

const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'reviewgym.practice.v1';
let state = { version: 1, language: 'en', current: scenarios[0].id, reviews: {}, firstAttempts: [] };
try {
  const stored = JSON.parse(localStorage.getItem(KEY));
  if (stored?.version === 1 && stored.reviews && Array.isArray(stored.firstAttempts)
      && scenarios.some(c => c.id === stored.current)) state = stored;
} catch { /* A blocked or unavailable store does not prevent practice. */ }
language = state.language === 'fr' ? 'fr' : 'en';
scenarios = language === 'fr' ? scenariosFr : scenariosEn;
let retrying = false;
let draft = blankReview();

function blankReview() {
  return { flags: [], evidence: [], openedSources: [], expandedSources: [], action: '', confidence: 50, assisted: false };
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* Session still works in memory. */ }
}
function currentCase() { return scenarios.find(c => c.id === state.current); }
function completed() { return Boolean(state.reviews[state.current]) && !retrying; }
function toggle(array, value) { return array.includes(value) ? array.filter(x => x !== value) : [...array, value]; }

function renderNavigation() {
  const total = state.firstAttempts.length;
  $('session-count').textContent = `${total} / ${scenarios.length}`;
  $('progress-bar').style.width = `${total / scenarios.length * 100}%`;
  $('progress-label').textContent = total ? t('progress', { done: total, total: scenarios.length }) : t('noCases');
  $('case-list').innerHTML = scenarios.map(c => `<button class="case-item" data-case="${c.id}" aria-current="${c.id === state.current}"><span class="case-symbol" aria-hidden="true">${state.reviews[c.id] ? '✓' : '·'}</span><span><strong>${esc(c.title)}</strong><small>${esc(c.stage === 'transfer' ? t('freshCase') + ' · ' + c.minutes : c.skill)}</small></span></button>`).join('');
}

function renderDraft() {
  const c = currentCase();
  const result = completed() ? state.reviews[c.id].result : null;
  $('draft').innerHTML = c.draft.map(s => {
    let feedback = '';
    if (result?.missed.includes(s.id)) feedback = ' feedback-missed';
    if (result?.found.includes(s.id)) feedback = ' feedback-found';
    if (result?.unnecessary.includes(s.id)) feedback = ' feedback-unnecessary';
    return `<button class="sentence${feedback}" data-sentence="${s.id}" aria-pressed="${draft.flags.includes(s.id)}" ${completed() ? 'disabled' : ''}><span class="mark" aria-hidden="true">✓</span><span>${esc(s.text)}</span></button>`;
  }).join('');
  const count = draft.flags.length;
  $('flag-count').textContent = count ? t('flags', { n: count }) : t('noFlags');
}

function renderSources() {
  $('sources').innerHTML = currentCase().documents.map(d => {
    const open = (draft.expandedSources || draft.openedSources).includes(d.id);
    return `<article class="source"><button class="source-toggle" data-source="${d.id}" aria-expanded="${open}" aria-controls="source-${d.id}"><span class="document-icon" aria-hidden="true">≡</span><span><strong>${esc(d.title)}</strong><small>${esc(d.label)}</small></span><span class="chevron" aria-hidden="true">⌄</span></button><div class="source-body" id="source-${d.id}" ${open ? '' : 'hidden'}><p>${esc(d.body)}</p><label class="cite-label"><input type="checkbox" data-evidence="${d.id}" ${draft.evidence.includes(d.id) ? 'checked' : ''} ${completed() ? 'disabled' : ''}>${t('sourceLabel')}</label></div></article>`;
  }).join('');
}

function renderActions() {
  $('actions').innerHTML = actions.map(a => `<button class="action" data-action="${a.id}" aria-pressed="${draft.action === a.id}" ${completed() ? 'disabled' : ''}><strong>${esc(t(a.id))}</strong><small>${esc(t(a.id + 'Description'))}</small></button>`).join('');
  $('submit').disabled = !draft.action || completed();
  $('submit').textContent = completed() ? t('complete') : retrying ? t('retrySubmit') : t('submit');
}

function renderFeedback() {
  const target = $('feedback');
  if (!completed()) { target.hidden = true; target.innerHTML = ''; return; }
  const c = currentCase(), { result: r } = state.reviews[c.id];
  target.hidden = false;
  target.className = `feedback${r.complete ? '' : ' warning'}`;
  const title = r.complete ? t('goodTitle') : r.disposition === 'unsafe-approval' ? t('unsafeTitle') : t('reviewTitle');
  const outcome = r.disposition === 'unsafe-approval' ? c.outcome.unsafe : r.complete ? c.outcome.safe : t('staysReview');
  const i = scenarios.findIndex(x => x.id === c.id);
  target.innerHTML = `<span class="feedback-label">${r.complete ? t('supportedCase') : t('practiceMoment')}</span><h3 id="feedback-title">${title}</h3><p>${esc(c.explanation)}</p><div class="outcome"><span>${t('consequence')}</span><p>${esc(outcome)}</p></div><p>${esc(c.consequence)}</p><div class="feedback-stats"><span>${r.expectedIssues ? `<b>${r.found.length} / ${r.expectedIssues}</b> ${t('found')}` : t('noConcerns')}</span><span><b>${r.unnecessary.length}</b> ${t('unnecessary')}</span><span>${t('evidence')} <b>${r.evidenceComplete ? t('supported') : t('incomplete')}</b></span><span>${t('confidenceLabel')} <b>${r.confidence}%</b> · ${t('selfReported')}</span></div><div class="feedback-buttons"><button class="secondary" id="retry">${t('retry')}</button><button class="primary" id="next">${i < scenarios.length - 1 ? scenarios[i + 1].stage === 'transfer' ? t('tryFresh') : t('next') : t('reviewSession')}</button></div><p class="first-attempt-note">${t('firstAttemptNote')}</p>`;
  $('retry').addEventListener('click', () => { retrying = true; draft = blankReview(); renderCase(); $('workspace').focus(); });
  $('next').addEventListener('click', () => { if (i < scenarios.length - 1) selectCase(scenarios[i + 1].id); else showSession(); });
}

function renderCase() {
  const c = currentCase();
  applyLanguage();
  $('case-context').textContent = c.context;
  $('case-title').textContent = c.title;
  $('case-mission').textContent = c.mission;
  $('case-stage').textContent = c.stage === 'transfer' ? t('fresh') : t('guided');
  $('case-stage').className = `stage${c.stage === 'transfer' ? ' transfer' : ''}`;
  $('avatar').textContent = c.initials;
  $('request-person').textContent = `${c.person} · ${t('colleague')}`;
  $('request-text').textContent = c.request;
  $('recipient').textContent = c.recipient;
  $('confidence').value = draft.confidence;
  $('confidence').disabled = completed();
  $('confidence-value').textContent = `${draft.confidence}%`;
  $('hint').disabled = completed();
  $('hint-box').hidden = !draft.assisted;
  $('hint-box').textContent = draft.assisted ? c.hint : '';
  $('review-instruction').textContent = retrying ? t('retryInstruction') : t('commit');
  $('error').textContent = '';
  renderNavigation(); renderDraft(); renderSources(); renderActions(); renderFeedback();
}

function selectCase(id) {
  if (!scenarios.some(c => c.id === id)) return;
  state.current = id;
  retrying = false;
  draft = state.reviews[id] ? structuredClone(state.reviews[id].submission) : blankReview();
  persist(); renderCase(); $('workspace').focus();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function showModal(html) {
  $('modal-body').innerHTML = html;
  if (!$('modal').open) $('modal').showModal();
}

function showSession() {
  const s = summarizeSession(state.firstAttempts);
  showModal(`<span class="eyebrow">${t('firstAttempts')}</span><h2>${t('sessionTitle')}</h2><p>${t('observations', { n: s.completed })}</p><div class="summary-grid"><div><strong>${s.supportedDecisions}/${s.completed}</strong><span>${t('supportedDecisions')}</span></div><div><strong>${s.issuesMissed}</strong><span>${t('missedConcerns')}</span></div><div><strong>${s.unnecessaryFlags}</strong><span>${t('extraFlags')}</span></div></div>${state.firstAttempts.map(r => `<div class="summary-row"><strong>${esc(scenarios.find(c => c.id === r.caseId)?.title || 'Case')}</strong><span>${r.complete ? t('supported') : t('needsPractice')} · ${r.confidence}%${r.assisted ? ' · ' + t('hintUsed') : ''}</span></div>`).join('')}<p>${t('assisted', { n: s.assistedCases, fresh: s.freshCasesCompleted })}</p><p>${t('sessionLimit')}</p><div class="modal-actions"><button class="secondary" id="reset">${t('reset')}</button><button class="primary" id="export">${t('download')}</button></div>`);
  $('export').addEventListener('click', exportSession);
  $('reset').addEventListener('click', () => {
    showModal(`<h2>${t('resetTitle')}</h2><p>${t('resetText')}</p><div class="modal-actions"><button class="secondary" id="cancel-reset">${t('keep')}</button><button class="primary" id="confirm-reset">${t('confirmReset')}</button></div>`);
    $('cancel-reset').addEventListener('click', () => { $('modal').close(); showSession(); });
    $('confirm-reset').addEventListener('click', () => { state = { version: 1, language, current: scenarios[0].id, reviews: {}, firstAttempts: [] }; persist(); $('modal').close(); selectCase(scenarios[0].id); });
  });
}

function exportSession() {
  const record = { schemaVersion: 1, exportedAt: new Date().toISOString(),
    kind: 'authored-practice-observations', summary: summarizeSession(state.firstAttempts),
    firstAttempts: state.firstAttempts,
    limitations: ['Not an identity-verified or secure assessment.', 'Hints are tracked; external assistance is unknown.', 'Not evidence of validated learning gains or certification.'] };
  const address = URL.createObjectURL(new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = address; anchor.download = 'reviewgym-session.json';
  anchor.click(); setTimeout(() => URL.revokeObjectURL(address), 1000);
}

$('case-list').addEventListener('click', event => {
  const target = event.target.closest('[data-case]');
  if (target) selectCase(target.dataset.case);
});
$('draft').addEventListener('click', event => {
  const target = event.target.closest('[data-sentence]');
  if (target && !completed()) { draft.flags = toggle(draft.flags, target.dataset.sentence); renderDraft(); }
});
$('sources').addEventListener('click', event => {
  const target = event.target.closest('[data-source]');
  if (target) {
    const id = target.dataset.source;
    draft.expandedSources = toggle(draft.expandedSources || draft.openedSources, id);
    if (!draft.openedSources.includes(id)) draft.openedSources.push(id);
    renderSources();
  }
});
$('sources').addEventListener('change', event => {
  if (event.target.dataset.evidence && !completed()) draft.evidence = toggle(draft.evidence, event.target.dataset.evidence);
});
$('actions').addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (target && !completed()) { draft.action = target.dataset.action; renderActions(); }
});
$('confidence').addEventListener('input', event => { draft.confidence = Number(event.target.value); $('confidence-value').textContent = `${draft.confidence}%`; });
$('hint').addEventListener('click', () => { draft.assisted = true; $('hint-box').hidden = false; $('hint-box').textContent = currentCase().hint; });
$('submit').addEventListener('click', () => {
  try {
    const result = reviewCase(currentCase(), draft);
    state.reviews[state.current] = { submission: structuredClone(draft), result };
    if (!state.firstAttempts.some(x => x.caseId === result.caseId)) state.firstAttempts.push(result);
    retrying = false; persist(); renderCase();
    $('feedback').focus(); $('feedback').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  } catch { $('error').textContent = t('error'); }
});
$('session').addEventListener('click', showSession);
$('close-modal').addEventListener('click', () => $('modal').close());
$('modal').addEventListener('click', event => { if (event.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) $('modal').close(); } });
$('about').addEventListener('click', () => showModal(`<span class="eyebrow">${t('aboutEyebrow')}</span><h2>${t('aboutTitle')}</h2><p>${t('aboutIntro')}</p><h3>${t('helpAllowed')}</h3><p>${t('aboutHelp')}</p><h3>${t('freshTitle')}</h3><p>${t('freshText')}</p><h3>${t('researchTitle')}</h3><p>${t('researchText')} <a class="inline-link" href="https://arxiv.org/abs/2102.09692" target="_blank" rel="noopener noreferrer">${t('readStudy')}</a>.</p><p>${t('authored')}</p>`));

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === language)));
  $('close-modal').setAttribute('aria-label', t('close'));
  document.querySelector('.language-switch').setAttribute('aria-label', t('language'));
  $('case-list').setAttribute('aria-label', t('practiceCases'));
  document.querySelector('.topbar nav').setAttribute('aria-label', t('workspace'));
  document.querySelector('.brand').setAttribute('aria-label', t('home'));
}
document.querySelector('.language-switch').addEventListener('click', event => {
  const choice = event.target.closest('[data-language]');
  if (!choice) return;
  language = choice.dataset.language;
  state.language = language;
  scenarios = language === 'fr' ? scenariosFr : scenariosEn;
  persist(); renderCase();
});

selectCase(state.current);
