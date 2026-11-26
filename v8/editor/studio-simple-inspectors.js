import {heroTitleInspectorHtml} from './studio-hero-title-inspector-html.js';
import {lifecycleInspectorHtml} from './studio-lifecycle-inspector-html.js';
import {addressInspectorHtml} from './studio-address-inspector-html.js';
import {ticketSettingsInspectorHtml} from './studio-ticket-inspector-html.js';

export function createSimpleInspectors({
  $, getState, getTemplate, setInspector, inspector, esc, PALETTES,
  bindInspectorStateInput, checkpoint, setDeep, save, send, toast
}) {
  function hero() {
    const state = getState();
    const view = heroTitleInspectorHtml(state, esc);
    setInspector('主视觉', view.title, view.html);
    inspector.querySelectorAll('[data-sync-path]').forEach((input) => bindInspectorStateInput(input, input.dataset.syncPath, {clean: input.type !== 'color'}));
    inspector.querySelectorAll('[data-hero-image]').forEach((btn) => btn.addEventListener('click', () => {
      $('#imageInput').dataset.path = btn.dataset.heroImage;
      $('#imageInput').click();
    }));
    inspector.querySelectorAll('[data-hero-image-remove]').forEach((btn) => btn.addEventListener('click', () => {
      checkpoint();
      setDeep(btn.dataset.heroImageRemove, '');
      save();
      send({type: 'OE_PATCH_FIELD', path: btn.dataset.heroImageRemove, value: ''});
    }));
  }

  function lifecycle() {
    const state = getState();
    setInspector('活动状态', '生命周期', lifecycleInspectorHtml(state, esc));
    inspector.querySelector('[data-event-status-mode="auto"]')?.addEventListener('click', () => {
      checkpoint();
      state.eventStatusMode = 'auto';
      save();
      send({type: 'OE_REPLACE_STATE', state});
      lifecycle();
    });
    inspector.querySelectorAll('[data-event-status]').forEach((btn) => btn.addEventListener('click', () => {
      checkpoint();
      state.eventStatusMode = 'manual';
      state.eventStatus = btn.dataset.eventStatus;
      save();
      send({type: 'OE_REPLACE_STATE', state});
      lifecycle();
    }));
  }

  function address() {
    const state = getState();
    setInspector('基础信息', '时间、场馆与导航', addressInspectorHtml(state, esc));
    const tplId = getTemplate()?.id || '';
    const num = (tplId.match(/^0\d/) || [])[0];
    if (num && PALETTES[num]) {
      const key = 'palette' + num;
      const options = PALETTES[num].map(([v, l]) => '<option value="' + v + '">' + l + '</option>').join('');
      const box = document.createElement('label');
      box.innerHTML = '<span>配色方案</span><select data-palette>' + options + '</select>';
      inspector.querySelector('.item-fields')?.appendChild(box);
      const sel = inspector.querySelector('[data-palette]');
      if (sel) {
        sel.value = state[key] || PALETTES[num][0][0];
        sel.addEventListener('change', () => {
          checkpoint();
          state[key] = sel.value;
          save();
          send({type: 'OE_REPLACE_STATE', state});
        });
      }
    }
    for (const path of ['eventStartDateTime', 'eventEndDateTime', 'date', 'location', 'edition', 'navigationUrl']) {
      bindInspectorStateInput(inspector.querySelector('[data-sync-path="' + path + '"]'), path, {clean: true});
    }
    $('#testNavigation').onclick = () => {
      const url = String(state.navigationUrl || '').trim();
      if (url.startsWith('https://') || url.startsWith('http://')) window.open(url, '_blank', 'noopener');
      else toast('请填写有效的 http/https 链接');
    };
  }

  function ticket() {
    const state = getState();
    setInspector('票务', '购票平台', ticketSettingsInspectorHtml(state, esc));
    bindInspectorStateInput($('#ticketLinkLabelInput'), 'ticketLinkLabel', {clean: true});
    bindInspectorStateInput($('#ticketUrlInput'), 'ticketUrl', {clean: true});
    $('#testTicketUrl').onclick = () => {
      const url = String(state.ticketUrl || '').trim();
      if (/^https?:\/\//i.test(url)) window.open(url, '_blank', 'noopener');
      else toast('请填写有效的 http/https 链接');
    };
  }

  return {hero, lifecycle, address, ticket};
}
