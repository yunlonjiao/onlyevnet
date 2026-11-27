import {optionalPageHtml} from './studio-optional-page-html.js';

export function createOptionalPageInspector({$, getState, setInspector, inspector, esc, bindInspectorStateInput, checkpoint, setDeep, send}) {
  function open(key) {
    const page = getState()[key] || {};
    setInspector('页面内容', key === 'freewalk' ? 'COS自由行' : '痛车展示', optionalPageHtml(key, page, esc));
    inspector.querySelectorAll('[data-optional-field]').forEach((input) => bindInspectorStateInput(input, key + '.' + input.dataset.optionalField, {clean: true}));
    inspector.querySelector('[data-optional-image]')?.addEventListener('click', () => {
      $('#imageInput').dataset.path = key + '.image';
      $('#imageInput').click();
    });
    inspector.querySelector('[data-optional-image-remove]')?.addEventListener('click', () => {
      checkpoint();
      setDeep(key + '.image', '');
      send({type: 'OE_REPLACE_STATE', state: getState()});
      open(key);
    });
  }
  return {open};
}
