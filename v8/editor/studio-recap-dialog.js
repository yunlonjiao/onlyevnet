import {esc} from './studio-format.js';
import {recapDialogHtml} from './studio-recap-dialog-html.js';

export function createRecapDialog({$, getState, recapDialog, recapCommit, uid, checkpoint}) {
  function render() {
    const state = getState();
    state.recap ??= {mode: 'off', title: '', summary: '', posts: [], photos: [], videos: [], links: []};
    const r = state.recap;
    for (const k of ['posts', 'photos', 'videos', 'links']) r[k] ??= [];
    $('#recapBody').innerHTML = recapDialogHtml(r, esc);
    $('#recapBody').querySelector('[data-recap="mode"]').value = r.mode || 'off';
  }

  function open() {
    render();
    if (!recapDialog.open) recapDialog.showModal();
  }

  function bind() {
    const body = $('#recapBody');
    body.addEventListener('input', (e) => {
      const state = getState(), t = e.target, r = state.recap;
      if (t.dataset.recap) {
        checkpoint(); r[t.dataset.recap] = t.value; recapCommit(); return;
      }
      const row = t.closest('[data-list]');
      if (!row || !t.dataset.f) return;
      checkpoint(); r[row.dataset.list][Number(row.dataset.i)][t.dataset.f] = t.value; recapCommit();
    });
    body.addEventListener('click', (e) => {
      const state = getState(), r = state.recap, b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.add) {
        checkpoint();
        const k = b.dataset.add;
        r[k].push(k === 'posts' ? {id: uid('rp'), time: '', text: ''} : k === 'photos' ? {id: uid('ph'), image: '', caption: ''} : k === 'videos' ? {id: uid('vd'), url: '', title: ''} : {id: uid('lk'), label: '', url: ''});
        recapCommit({structural: true}); return;
      }
      if (b.classList.contains('recap-rm')) {
        checkpoint();
        const row = b.closest('[data-list]');
        r[row.dataset.list].splice(Number(row.dataset.i), 1);
        recapCommit({structural: true}); return;
      }
      if (b.dataset.pick !== undefined) {
        $('#imageInput').dataset.path = 'recap.photos.' + b.dataset.pick + '.image';
        $('#imageInput').click();
      }
    });
    body.addEventListener('change', (e) => { if (e.target.dataset.recap === 'mode') recapCommit(); });
  }

  return {render, open, bind};
}
