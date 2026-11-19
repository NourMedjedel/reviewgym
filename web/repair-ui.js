import { inspectRepair, exampleRepair, retainRepairAttempt, MAX_REPAIR_LENGTH } from './repair.js?v=0.3.2';

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Render a rewrite workspace. The caller owns persistence and the active case. */
export function renderRepairWorkspace(root, { scenario, language, t, record, onSave }) {
  const original = scenario.draft.map(s => s.text).join('\n\n');
  if (typeof record.draft !== 'string' || record.draft.length > MAX_REPAIR_LENGTH) record.draft = original;
  root.innerHTML = `
    <div class="repair-intro"><h3>${t(scenario.action === 'approve' ? 'repairKeepTitle' : 'repairTitle')}</h3><button class="secondary" data-open-repair aria-controls="repair-body" aria-expanded="${Boolean(record.open)}">${t(record.open ? 'repairClose' : 'repairOpen')}</button></div>
    <div id="repair-body" class="repair-body" ${record.open ? '' : 'hidden'}>
      <p class="repair-brief">${t(scenario.action === 'escalate' ? 'repairEscalateBrief' : 'repairBrief')}</p>
      <div class="repair-grid"><div class="repair-editor">
        <label for="repair-text">${t('repairEditor')}</label><p class="repair-small" id="repair-editor-note">${t('repairLanguageNote')}</p>
        <textarea id="repair-text" maxlength="${MAX_REPAIR_LENGTH}" rows="7" aria-describedby="repair-editor-note" spellcheck="true"></textarea>
        <div class="repair-editor-meta"><span data-character-count></span><button class="text-button" data-repair-sources>${t('repairSources')}</button></div>
        <div class="repair-tools"><button class="primary" data-check-repair>${t('repairCheck')}</button><button class="secondary" data-example-repair>${t('repairExample')}</button></div><p class="repair-small" data-example-note>${record.exampleUsed ? t('repairExampleRecorded') : ''}</p>
      </div><div class="repair-preview"><div class="preview-header"><span>${t('repairPreview')}</span><span class="meta">${t('nothingSent')}</span></div>
        <p class="preview-recipient">${escape(scenario.action === 'escalate' ? t('repairApprover') : scenario.recipient)}</p><div class="preview-copy" data-preview></div>
      </div></div>
      <section class="repair-results" aria-label="${t('repairCheckResults')}"><div data-repair-summary role="status" aria-live="polite"></div><ul data-repair-checks></ul><details class="repair-scope"><summary>${t('repairScope')}</summary><p>${t('repairLimit')}</p></details></section>
    </div>`;
  const editor = root.querySelector('textarea');
  editor.value = record.draft;
  let timer;
  const preview = root.querySelector('[data-preview]');

  function updatePreview(result) {
    const text = record.draft;
    const spans = (result?.ranges || []).slice().sort((a, b) => a.start - b.start);
    const merged = [];
    for (const span of spans) {
      const last = merged.at(-1);
      if (last && span.start <= last.end) last.end = Math.max(last.end, span.end);
      else merged.push({ start: span.start, end: span.end });
    }
    if (!text.trim()) { preview.textContent = t('repairEmptyPreview'); return; }
    let cursor = 0, markup = '';
    for (const span of merged) {
      markup += escape(text.slice(cursor, span.start)) + '<mark>' + escape(text.slice(span.start, span.end)) + '</mark>';
      cursor = span.end;
    }
    preview.innerHTML = markup + escape(text.slice(cursor));
  }

  function updateResults() {
    const last = record.latestAttempt;
    const current = last && last.text === record.draft;
    const summary = root.querySelector('[data-repair-summary]');
    const list = root.querySelector('[data-repair-checks]');
    updatePreview(current ? last.result : null);
    root.querySelector('[data-character-count]').textContent = `${record.draft.length} / ${MAX_REPAIR_LENGTH}`;
    if (!current) {
      summary.className = 'repair-result-idle';
      summary.textContent = last ? t('repairChanged') : t('repairNotChecked');
      list.replaceChildren();
      return;
    }
    const r = last.result;
    summary.className = r.status === 'compare-with-sources' ? 'repair-result-review' : 'repair-result-attention';
    const titles = { empty: 'repairEmpty', 'needs-attention': 'repairAttention', 'missing-details': 'repairMissing', 'compare-with-sources': 'repairCompare' };
    summary.textContent = t(titles[r.status]);
    list.innerHTML = r.checks.map(c => `<li class="check-${c.status}"><span class="check-symbol" aria-hidden="true">${['attention', 'missing'].includes(c.status) ? '!' : '✓'}</span><span>${t(c.label)}<small>${t({ attention: 'repairRiskFound', 'not-found': 'repairRiskNotFound', mentioned: 'repairDetailMentioned', missing: 'repairDetailMissing' }[c.status])}</small></span></li>`).join('');
  }

  root.querySelector('[data-open-repair]').addEventListener('click', event => {
    record.open = !record.open;
    root.querySelector('.repair-body').hidden = !record.open;
    event.currentTarget.setAttribute('aria-expanded', String(record.open));
    event.currentTarget.textContent = t(record.open ? 'repairClose' : 'repairOpen');
    onSave();
    if (record.open) editor.focus();
  });
  editor.addEventListener('input', () => {
    record.draft = editor.value;
    updateResults();
    clearTimeout(timer); timer = setTimeout(onSave, 250);
  });
  editor.addEventListener('blur', onSave);
  root.querySelector('[data-check-repair]').addEventListener('click', () => {
    const result = inspectRepair(scenario.id, record.draft);
    const attempt = { caseId: scenario.id, language, text: record.draft, result,
      exampleUsed: Boolean(record.exampleUsed), checkedAt: new Date().toISOString() };
    Object.assign(record, retainRepairAttempt(record, attempt));
    onSave(); updateResults();
  });
  root.querySelector('[data-example-repair]').addEventListener('click', () => {
    // Example assistance does not overwrite the learner's working draft.
    record.exampleUsed = true;
    root.querySelector('[data-example-note]').textContent = t('repairExampleRecorded');
    let panel = root.querySelector('.repair-example');
    if (!panel) {
      panel = document.createElement('details'); panel.className = 'repair-example';
      const label = document.createElement('summary'); label.textContent = t('repairExampleLabel');
      const body = document.createElement('p'); body.textContent = exampleRepair(scenario.id, language);
      panel.append(label, body); root.querySelector('.repair-editor').append(panel);
    }
    panel.open = true; onSave();
  });
  root.querySelector('[data-repair-sources]').addEventListener('click', () => {
    const source = document.querySelector('.evidence-panel');
    document.getElementById('review-workspace').open = true;
    source.open = true;
    source.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    source.querySelector('.source-toggle')?.focus({ preventScroll: true });
  });
  updateResults();
}
