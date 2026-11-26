import {bannerInspectorHtml, trafficInspectorHtml} from './studio-page-inspector-html.js';

export function createBannerInspector({$, getState, setInspector, inspector, esc, checkpoint, setDeep, save, send}) {
  function open() {
    setInspector('横幅', '首页横幅', bannerInspectorHtml(getState(), esc));
    inspector.querySelectorAll('[data-banner-image]').forEach((btn) => btn.addEventListener('click', () => {
      const input = $('#imageInput');
      input.dataset.path = btn.dataset.bannerImage;
      input.click();
    }));
    inspector.querySelectorAll('[data-banner-remove]').forEach((btn) => btn.addEventListener('click', () => {
      checkpoint();
      const key = btn.dataset.bannerRemove;
      setDeep(key, '');
      save();
      send({type: 'OE_PATCH_FIELD', path: key, value: ''});
      open();
    }));
  }
  return {open};
}

export function createTrafficInspector({$, getState, setInspector, inspector, esc, checkpoint, save, send}) {
  function open() {
    setInspector('交通到达', '交通路线图与导航', trafficInspectorHtml(getState(), esc));
    inspector.querySelector('[data-traffic-image]')?.addEventListener('click', () => {
      const input = $('#imageInput');
      input.dataset.path = 'venueMap.transitImage';
      input.click();
    });
    $('#saveTrafficNav')?.addEventListener('click', () => {
      checkpoint();
      getState().navigationUrl = String($('#trafficNavInput')?.value || '').trim();
      save();
      send({type: 'OE_REPLACE_STATE', state: getState()});
    });
  }
  return {open};
}
