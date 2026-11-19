import { scenarios as scenariosEn, actions } from './scenarios.js?v=0.3.2';
import { scenariosFr } from './scenarios-fr.js?v=0.3.2';
import { scenariosDe } from './scenarios-de.js?v=0.3.2';
import { translate } from './locales.js?v=0.3.2';
import { topics, topicFor } from './topics.js?v=0.3.2';
import { resources } from './resources.js?v=0.3.2';
import { reviewCase, summarizeSession } from './engine.js?v=0.3.2';
import { renderRepairWorkspace } from './repair-ui.js?v=0.3.2';
import { summarizeRepairs } from './repair.js?v=0.3.2';

const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'reviewgym.practice.v1';
const packs = { en: scenariosEn, fr: scenariosFr, de: scenariosDe };
let state = { version: 1, language: 'en', current: scenariosEn[0].id, reviews: {}, firstAttempts: [], repairs: {} };
try {
  const stored = JSON.parse(localStorage.getItem(KEY));
  if (stored?.version === 1 && stored.reviews && Array.isArray(stored.firstAttempts)
      && scenariosEn.some(c => c.id === stored.current)) state = stored;
} catch { /* Practice still works when browser storage is unavailable. */ }
let language = Object.hasOwn(packs, state.language) ? state.language : 'en';
state.repairs ??= {};
let scenarios = packs[language];
let view = 'library';
let retrying = false;
let draft = blankReview();
const t = (key, values) => translate(language, key, values);

function blankReview() { return { flags: [], evidence: [], openedSources: [], expandedSources: [], sourcesVisible: false, action: '', confidence: null, assisted: false }; }
function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* Keep the current session in memory. */ } }
function currentCase() { return scenarios.find(c => c.id === state.current); }
function completed() { return Boolean(state.reviews[state.current]) && !retrying; }
function toggle(array, value) { return array.includes(value) ? array.filter(x => x !== value) : [...array, value]; }
function confidenceText(value) { return Number.isInteger(value) ? `${value}%` : t('notProvided'); }

function applyLanguage() {
  document.documentElement.lang = language === 'de' ? 'de-CH' : language;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $('language').value = language;
  $('close-modal').setAttribute('aria-label', t('close'));
  document.querySelector('.topbar nav').setAttribute('aria-label', t('workspace'));
  document.querySelector('.brand').setAttribute('aria-label', t('home'));
  $('practice-nav').setAttribute('aria-current', view === 'guide' ? 'false' : 'page');
  $('guide-nav').setAttribute('aria-current', view === 'guide' ? 'page' : 'false');
}

function renderLibrary() {
  const words = t('libraryTitle').split(' ');
  $('library-title').innerHTML = esc(words.slice(0, -1).join(' ')) + ' <em>' + esc(words.at(-1)) + '</em>';
  $('library-meta').textContent = t('libraryMeta', { total: scenarios.length });
  $('progress-label').textContent = t('progress', { done: summarizeSession(state.firstAttempts).completed, total: scenarios.length });
  $('topic-list').innerHTML = topics.map(topic => `<section class="topic-group" aria-labelledby="topic-${topic.id}"><div class="topic-heading"><h2 id="topic-${topic.id}">${t(topic.title)}</h2><p>${t(topic.description)}</p></div><div class="case-grid">${topic.cases.map(id => {
    const c = scenarios.find(x => x.id === id);
    return `<button class="case-card" data-case="${c.id}"><strong>${esc(c.title)}</strong><span class="skill">${esc(c.skill)}</span><span class="case-meta"><span>${c.minutes}</span>${c.stage === 'transfer' ? `<span>${t('freshCase')}</span>` : ''}${state.reviews[c.id] ? `<span class="reviewed">${t('completedLabel')}</span>` : ''}</span></button>`;
  }).join('')}</div></section>`).join('');
}

function renderGuide() {
  $('guide-habits').innerHTML = ['Data', 'Evidence', 'Agency', 'Pilot'].map(id => `<section class="habit"><h2>${t('habit' + id)}</h2><p>${t('habit' + id + 'Text')}</p></section>`).join('');
  $('research-list').className = 'research-list';
  $('research-list').innerHTML = resources.map(r => `<article class="research-item"><a href="${r.url}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a><p>${t(r.note)}</p></article>`).join('');
}

function renderDraft() {
  const c = currentCase(), result = completed() ? state.reviews[c.id].result : null;
  $('draft').innerHTML = c.draft.map(s => {
    const feedback = result?.missed.includes(s.id) ? ' feedback-missed' : result?.found.includes(s.id) ? ' feedback-found' : result?.unnecessary.includes(s.id) ? ' feedback-unnecessary' : '';
    return `<button class="sentence${feedback}" data-sentence="${s.id}" aria-pressed="${draft.flags.includes(s.id)}" ${completed() ? 'disabled' : ''}><span class="mark" aria-hidden="true">✓</span><span>${esc(s.text)}</span></button>`;
  }).join('');
  $('flag-count').textContent = draft.flags.length ? t('flags', { n: draft.flags.length }) : t('noFlags');
}
function renderSources() {
  $('source-count').textContent = String(currentCase().documents.length);
  $('sources').innerHTML = currentCase().documents.map(d => {
    const open = (draft.expandedSources || draft.openedSources).includes(d.id);
    return `<article class="source"><button class="source-toggle" data-source="${d.id}" aria-expanded="${open}" aria-controls="source-${d.id}"><span>${esc(d.title)}<small>${esc(d.label)}</small></span><span class="chevron" aria-hidden="true">⌄</span></button><div class="source-body" id="source-${d.id}" ${open ? '' : 'hidden'}><p>${esc(d.body)}</p><label class="cite-label"><input type="checkbox" data-evidence="${d.id}" ${draft.evidence.includes(d.id) ? 'checked' : ''} ${completed() ? 'disabled' : ''}>${t('sourceLabel')}</label></div></article>`;
  }).join('');
}
function renderActions() {
  $('actions').innerHTML = actions.map(a => `<button class="action" data-action="${a.id}" aria-pressed="${draft.action === a.id}" ${completed() ? 'disabled' : ''}><strong>${t(a.id)}</strong><small>${t(a.id + 'Description')}</small></button>`).join('');
  $('submit').disabled = !draft.action || completed();
  $('submit').textContent = completed() ? t('complete') : retrying ? t('retrySubmit') : t('submit');
}
function renderFeedback() {
  const target = $('feedback');
  if (!completed()) { target.hidden = true; target.replaceChildren(); return; }
  const c = currentCase(), { result: r } = state.reviews[c.id];
  target.hidden = false;
  const title = r.complete ? t('goodTitle') : r.disposition === 'unsafe-approval' ? t('unsafeTitle') : t('reviewTitle');
  const outcome = r.disposition === 'unsafe-approval' ? c.outcome.unsafe : r.complete ? c.outcome.safe : t('staysReview');
  target.innerHTML = `<h2 id="feedback-title">${title}</h2><p>${esc(c.explanation)}</p><p class="outcome"><strong>${t('consequence')}</strong>${esc(outcome)}</p><details class="feedback-detail"><summary>${t('reviewDetails')}</summary><div class="feedback-stats"><span>${r.expectedIssues ? `${r.found.length} / ${r.expectedIssues} ${t('found')}` : t('noConcerns')}</span><span>${r.unnecessary.length} ${t('unnecessary')}</span><span>${t('evidence')}: ${r.evidenceComplete ? t('supported') : t('incomplete')}</span><span>${t('confidenceLabel')}: ${confidenceText(r.confidence)}</span></div><p class="first-attempt-note">${t('firstAttemptNote')}</p></details><section class="repair-workspace"></section><div class="feedback-buttons"><button class="secondary" id="retry">${t('retry')}</button><button class="primary" id="next">${t('next')}</button></div>`;
  $('retry').addEventListener('click', () => { retrying = true; draft = blankReview(); renderCase(); $('workspace').focus(); });
  $('next').addEventListener('click', () => {
    const i = scenarios.findIndex(x => x.id === c.id);
    if (i < scenarios.length - 1) selectCase(scenarios[i + 1].id); else showSession();
  });
  state.repairs[c.id] ??= {};
  state.repairs[c.id][language] ??= {};
  renderRepairWorkspace(target.querySelector('.repair-workspace'), { scenario: c, language, t, record: state.repairs[c.id][language], onSave: persist });
}
function renderCase() {
  const c = currentCase();
  $('case-context').textContent = `${t(topicFor(c.id).title)} · ${c.minutes}`;
  $('case-title').textContent = c.title;
  $('case-mission').textContent = c.mission;
  $('request-person').textContent = `${c.person} · ${t('colleague')}`;
  $('request-text').textContent = c.request;
  $('recipient').textContent = c.recipient;
  $('confidence').value = draft.confidence ?? '';
  $('confidence').placeholder = t('notProvided');
  $('confidence').disabled = completed();
  $('hint').disabled = completed();
  $('hint-box').hidden = !draft.assisted;
  $('hint-box').textContent = draft.assisted ? c.hint : '';
  $('error').textContent = '';
  $('review-workspace').open = !completed();
  $('review-summary').hidden = !completed();
  $('evidence-panel').open = Boolean(draft.sourcesVisible);
  renderDraft(); renderSources(); renderActions(); renderFeedback();
}
function render() {
  applyLanguage();
  $('library-view').hidden = view !== 'library';
  $('guide-view').hidden = view !== 'guide';
  $('workspace').hidden = view !== 'practice';
  if (view === 'library') renderLibrary();
  if (view === 'guide') renderGuide();
  if (view === 'practice') renderCase();
}
function changeView(nextView) { view = nextView; render(); $('content').focus(); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
function selectCase(id) {
  if (!scenarios.some(c => c.id === id)) return;
  state.current = id; retrying = false;
  draft = state.reviews[id] ? structuredClone(state.reviews[id].submission) : blankReview();
  view = 'practice'; persist(); render(); $('workspace').focus();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
function showModal(html) { $('modal-body').innerHTML = html; if (!$('modal').open) $('modal').showModal(); }
function showSession() {
  const s = summarizeSession(state.firstAttempts), rewrites = summarizeRepairs(state.repairs);
  showModal(`<h2>${t('sessionTitle')}</h2><p>${t('observations', { n: s.completed })}</p><div class="summary-grid"><div><strong>${s.supportedDecisions}/${s.completed}</strong><span>${t('supportedDecisions')}</span></div><div><strong>${s.issuesMissed}</strong><span>${t('missedConcerns')}</span></div><div><strong>${s.unnecessaryFlags}</strong><span>${t('extraFlags')}</span></div></div>${state.firstAttempts.map(r => `<div class="summary-row"><strong>${esc(scenarios.find(c => c.id === r.caseId)?.title || r.caseId)}</strong><span>${r.complete ? t('supported') : t('needsPractice')} · ${confidenceText(r.confidence)}${r.assisted ? ' · ' + t('hintUsed') : ''}</span></div>`).join('')}<p>${t('assisted', { n: s.assistedCases, fresh: s.freshCasesCompleted })}</p><p>${t('repairSession', { checked: rewrites.checkedDrafts, assisted: rewrites.exampleAssistedDrafts })}</p><p>${t('sessionLimit')}</p><div class="modal-actions"><button class="secondary" id="reset">${t('reset')}</button><button class="primary" id="export">${t('download')}</button></div>`);
  $('export').addEventListener('click', exportSession);
  $('reset').addEventListener('click', () => {
    showModal(`<h2>${t('resetTitle')}</h2><p>${t('resetText')}</p><div class="modal-actions"><button class="secondary" id="cancel-reset">${t('keep')}</button><button class="primary" id="confirm-reset">${t('confirmReset')}</button></div>`);
    $('cancel-reset').addEventListener('click', showSession);
    $('confirm-reset').addEventListener('click', () => {
      state = { version: 1, language, current: scenarios[0].id, reviews: {}, firstAttempts: [], repairs: {} };
      draft = blankReview(); retrying = false; persist(); $('modal').close(); changeView('library');
    });
  });
}
function exportSession() {
  const record = { schemaVersion: 3, catalogVersion: '0.3.2', language, exportedAt: new Date().toISOString(),
    kind: 'authored-practice-observations', summary: summarizeSession(state.firstAttempts), firstAttempts: state.firstAttempts,
    rewrites: state.repairs, rewriteSummary: summarizeRepairs(state.repairs),
    limitations: ['Not an identity-verified assessment.', 'External assistance is unknown.', 'Learning effectiveness and regulatory compliance have not been validated.', 'Rewrite checks do not validate free-form meaning.'] };
  const url = URL.createObjectURL(new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'reviewgym-session.json'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

$('topic-list').addEventListener('click', e => { const c = e.target.closest('[data-case]'); if (c) selectCase(c.dataset.case); });
$('practice-nav').addEventListener('click', () => changeView('library'));
$('explore').addEventListener('click', () => {
  $('topic-list').querySelector('[data-case]')?.focus({ preventScroll: true });
  $('topic-list').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
});
$('back-library').addEventListener('click', () => changeView('library'));
$('guide-nav').addEventListener('click', () => changeView('guide'));
$('language').addEventListener('change', e => { language = e.target.value; state.language = language; scenarios = packs[language]; persist(); render(); });
$('draft').addEventListener('click', e => { const s = e.target.closest('[data-sentence]'); if (s && !completed()) { draft.flags = toggle(draft.flags, s.dataset.sentence); renderDraft(); } });
$('evidence-panel').addEventListener('toggle', e => { draft.sourcesVisible = e.target.open; });
$('sources').addEventListener('click', e => {
  const s = e.target.closest('[data-source]');
  if (s) { const id = s.dataset.source; draft.expandedSources = toggle(draft.expandedSources || draft.openedSources, id); if (!draft.openedSources.includes(id)) draft.openedSources.push(id); renderSources(); }
});
$('sources').addEventListener('change', e => { if (e.target.dataset.evidence && !completed()) draft.evidence = toggle(draft.evidence, e.target.dataset.evidence); });
$('actions').addEventListener('click', e => { const a = e.target.closest('[data-action]'); if (a && !completed()) { draft.action = a.dataset.action; renderActions(); } });
$('confidence').addEventListener('input', e => { draft.confidence = e.target.value === '' ? null : Number(e.target.value); });
$('hint').addEventListener('click', () => { draft.assisted = true; $('hint-box').hidden = false; $('hint-box').textContent = currentCase().hint; });
$('submit').addEventListener('click', () => {
  try {
    const result = reviewCase(currentCase(), draft);
    state.reviews[state.current] = { submission: structuredClone(draft), result };
    if (!state.firstAttempts.some(r => r.caseId === result.caseId)) state.firstAttempts.push(result);
    retrying = false; persist(); render(); $('feedback').focus();
    $('feedback').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  } catch { $('error').textContent = t('error'); }
});
$('session').addEventListener('click', showSession);
$('close-modal').addEventListener('click', () => $('modal').close());
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) $('modal').close(); } });
render();
