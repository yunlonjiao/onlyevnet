import {entryAnimationHtml, coverKvHtml} from './studio-entry-animation-html.js';

export function createEntryAnimationInspector({$, getState, setInspector, inspector, esc, checkpoint, save, send}) {
  function open() {
    const state = getState();
    if (state.templateId === '04-creator-catalogue') {
      setInspector('入场动画', '封面图', coverKvHtml(state, esc));
      inspector.querySelector('[data-cover-kv]')?.addEventListener('click', () => {
        const input = $('#imageInput');
        input.dataset.path = 'heroImage';
        input.click();
      });
      inspector.querySelector('[data-cover-kv-remove]')?.addEventListener('click', () => {
        checkpoint(); state.heroImage = ''; save();
        send({type: 'OE_PATCH_FIELD', path: 'heroImage', value: ''}); open();
      });
      return;
    }
    setInspector('入场动画', '开屏设置', entryAnimationHtml(state, esc));
    inspector.querySelectorAll('[data-kv-image]').forEach((btn) => btn.addEventListener('click', () => {
      const input = $('#imageInput');
      input.dataset.path = 'entryAnimation.' + btn.dataset.kvImage;
      input.click();
    }));
  }
  return {open};
}
