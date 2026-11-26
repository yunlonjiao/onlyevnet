import {shareDialogHtml} from './studio-share-dialog-html.js';

export function createShareDialog({
  $, getState, getRecord, shareDialog, PROMO_CHANNELS, esc,
  checkpoint, save, send, bindInspectorStateInput, toast, qrSvg, downloadSvg, shareTextFor
}) {
  function render() {
    const state = getState(), publishRecord = getRecord();
    state.seo ??= {};
    const seo = state.seo;
    const url = publishRecord?.url || '';
    $('#shareBody').innerHTML = shareDialogHtml(state, publishRecord, PROMO_CHANNELS, esc);
    const body = $('#shareBody');
    $('#shareMessage').value = shareTextFor(state, publishRecord);
    if (url) qrSvg(url).then((svg) => {
      const box = $('#shareQr');
      if (!box) return;
      box.innerHTML = svg;
      $('#shareQrSave').onclick = () => downloadSvg(svg, (state.eventName || '活动') + '-二维码.svg');
    }).catch(() => {
      const box = $('#shareQr');
      if (box) box.textContent = '二维码没能生成，请刷新后重试。';
    });
    body.querySelectorAll('[data-seo-field]').forEach((input) => {
      bindInspectorStateInput(input, 'seo.' + input.dataset.seoField, {clean: true});
      input.addEventListener('input', () => {
        const t = state.seo, card = body.querySelector('.share-card-text');
        if (!card) return;
        card.querySelector('b').textContent = t.ogTitle || t.pageTitle || state.eventName || '活动网站';
        card.querySelector('small').textContent = t.ogDescription || t.metaDescription || state.tagline || '';
      });
    });
    const copy = async (text) => {
      try { await navigator.clipboard.writeText(text); toast('已复制'); }
      catch { toast('复制失败'); }
    };
    body.querySelector('[data-share-copy-url]')?.addEventListener('click', () => copy(url));
    body.querySelectorAll('[data-share-channel]').forEach((b) => b.addEventListener('click', () => copy(url.replace(/\/$/, '') + '/?from=' + b.dataset.shareChannel)));
    body.querySelector('[data-share-open]')?.addEventListener('click', () => window.open(url, '_blank', 'noopener'));
    body.querySelector('[data-share-copy-text]')?.addEventListener('click', () => copy($('#shareMessage').value));
    body.querySelector('[data-seo-image]')?.addEventListener('click', () => {
      $('#imageInput').dataset.path = 'seo.ogImage';
      $('#imageInput').click();
    });
    body.querySelector('[data-seo-image-remove]')?.addEventListener('click', () => {
      checkpoint();
      state.seo.ogImage = '';
      save();
      send({type: 'OE_REPLACE_STATE', state});
      render();
    });
  }

  function open() {
    render();
    if (!shareDialog.open) shareDialog.showModal();
  }

  function openSeo() {
    shareDialog.open ? render() : open();
  }

  return {render, open, openSeo};
}
