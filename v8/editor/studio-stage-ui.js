import {esc} from './studio-format.js';
import {stageRowsHtml} from './studio-stage-html.js';

export function createStageUi({$, getState, stageModuleList, save, toast, publishChecks}) {
  function renderStageRows() {
    const state = getState();
    const box = $('#stageRows');
    if (!box) return;
    const stages = state.reveal?.stages || [], mods = stageModuleList();
    const panel = $('#publishStages');
    if (panel) panel.hidden = !mods.length;
    box.innerHTML = stageRowsHtml(stages, mods, esc);
  }

  function refreshStageHint(row) {
    if (!row) return;
    const state = getState();
    const i = Number(row.dataset.i), s = (state.reveal?.stages || [])[i], hint = row.querySelector('.stage-hint');
    if (!hint) return;
    hint.hidden = !!(s && s.at && (s.modules || []).length);
  }

  function refreshPublishChecks() {
    const state = getState();
    const ul = $('#publishChecks');
    if (!ul) return;
    const items = publishChecks(state);
    ul.innerHTML = items.map((t) => '<li>' + esc(t) + '</li>').join('');
    ul.hidden = !items.length;
    const title = $('#publishChecksTitle');
    if (title) title.hidden = !items.length;
  }

  function handleRowEvent(e) {
    const row = e.target.closest?.('.stage-row');
    if (!row) return;
    refreshStageHint(row);
    refreshPublishChecks();
  }

  function bindStageRows() {
    const box = $('#stageRows');
    if (!box) return;
    const touch = () => { const state = getState(); state.reveal ??= {stages: []}; save(); };
    box.addEventListener('input', (e) => {
      const state = getState();
      const row = e.target.closest('.stage-row');
      if (!row) return;
      const s = (state.reveal.stages || [])[Number(row.dataset.i)];
      if (!s) return;
      if (e.target.classList.contains('stage-label')) s.label = e.target.value;
      else if (e.target.classList.contains('stage-at')) s.at = e.target.value;
      else if (e.target.dataset.mod) s.modules = [...row.querySelectorAll('[data-mod]')].filter((i) => i.checked).map((i) => i.dataset.mod);
      save();
    });
    box.addEventListener('click', (e) => {
      if (!e.target.closest('.stage-remove')) return;
      const state = getState();
      const i = Number(e.target.closest('.stage-row').dataset.i);
      state.reveal.stages.splice(i, 1);
      save();
      renderStageRows();
    });
    const add = $('#stageAdd');
    if (add) add.onclick = () => {
      touch();
      const state = getState();
      state.reveal.stages ??= [];
      if (state.reveal.stages.length >= 6) { toast('最多 6 批'); return; }
      state.reveal.stages.push({id: 'st' + Date.now().toString(36), label: '', at: '', modules: []});
      save();
      renderStageRows();
    };
  }

  return {renderStageRows, bindStageRows, refreshPublishChecks, refreshStageHint, handleRowEvent};
}
