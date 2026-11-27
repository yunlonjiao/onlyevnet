import {productInspectorHtml} from './studio-product-inspector-html.js';
import {boothProductsHtml} from './studio-booth-products-html.js';

export function createProductInspector({
  $, getState, setInspector, inspector, esc, fitTextarea, checkpoint, save, send,
  cleanValue, openBoothProductManager, openImageCropper, openItemInspector,
  moveBoothProduct, addBoothProduct
}) {
  function product(boothIndex, productIndex, {focusImage = false} = {}) {
    const state = getState();
    const booth = state.booths?.[boothIndex], item = booth?.products?.[productIndex];
    if (!booth || !item) return;
    const path = 'booths.' + boothIndex + '.products.' + productIndex;
    setInspector('制品', '编辑制品', productInspectorHtml(booth, item, esc));
    inspector.querySelector('[data-direct-product-back]')?.addEventListener('click', () => openBoothProductManager(boothIndex));
    inspector.querySelectorAll('textarea').forEach(fitTextarea);
    try {
      const h = inspector.querySelector('textarea[data-key="setlist"]');
      if (h && !h.dataset.chips) {
        h.dataset.chips = '1';
        const wrap = document.createElement('div'); wrap.className = 'chip-editor';
        const list = document.createElement('div'); list.className = 'chip-list';
        const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'chip-input'; inp.placeholder = '输入曲名后回车';
        wrap.append(list, inp); h.parentElement.insertBefore(wrap, h); h.classList.add('chip-source');
        const splitSongs = (v) => String(v || '').split(/(?=《)|[\/、,，\n]+/).map((t) => t.trim()).filter(Boolean);
        const sync = () => {
          h.value = [...list.querySelectorAll('.chip')].map((c) => /** @type {HTMLElement} */ (c).dataset.v).join('\n');
          h.dispatchEvent(new Event('input', {bubbles: true})); h.dispatchEvent(new Event('change', {bubbles: true}));
          h.blur && h.blur();
          try { save(); send({type: 'OE_REPLACE_STATE', state}); } catch (e) { console.warn('[chips sync]', e); }
        };
        const add = (v) => {
          if (!v) return;
          const c = document.createElement('span'); c.className = 'chip'; c.dataset.v = v;
          c.innerHTML = esc(v) + '<button type="button" aria-label="删除">×</button>';
          c.querySelector('button').onclick = () => { c.remove(); sync(); };
          list.appendChild(c);
        };
        splitSongs(h.value).forEach(add);
        inp.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault(); add(inp.value.trim()); inp.value = ''; inp.blur(); setTimeout(() => sync(), 0);
        });
      }
    } catch (err) { console.warn('[chips]', err); }
    inspector.querySelectorAll('[data-direct-product-key]').forEach((input) => {
      let started = false;
      input.addEventListener('input', (e) => {
        if (!started) { checkpoint(); started = true; }
        const key = e.target.dataset.directProductKey;
        item[key] = e.target.value; save(); send({type: 'OE_REPLACE_STATE', state});
        if (e.target.tagName === 'TEXTAREA') fitTextarea(e.target);
      });
      input.addEventListener('blur', (e) => {
        const key = e.target.dataset.directProductKey, cleaned = cleanValue(e.target.value);
        if (cleaned !== e.target.value) {
          e.target.value = cleaned; item[key] = cleaned; save(); send({type: 'OE_REPLACE_STATE', state});
          if (e.target.tagName === 'TEXTAREA') fitTextarea(e.target);
        }
      });
    });
    const choose = () => {
      const input = $('#imageInput');
      input.dataset.path = path + '.image';
      input.dataset.returnCollection = 'product:' + boothIndex;
      input.dataset.returnIndex = String(productIndex);
      input.click();
    };
    inspector.querySelector('[data-direct-product-image]')?.addEventListener('click', choose);
    inspector.querySelector('[data-direct-product-crop]')?.addEventListener('click', () => openImageCropper(item.image, path + '.image', 'product:' + boothIndex, String(productIndex)));
    inspector.querySelector('[data-direct-product-remove-image]')?.addEventListener('click', () => {
      checkpoint(); item.image = ''; save(); send({type: 'OE_REPLACE_STATE', state}); product(boothIndex, productIndex);
    });
    inspector.querySelector('[data-direct-product-delete]')?.addEventListener('click', () => {
      checkpoint(); booth.products.splice(productIndex, 1); save(); send({type: 'OE_REPLACE_STATE', state}); openBoothProductManager(boothIndex);
    });
    if (focusImage) requestAnimationFrame(() => inspector.querySelector('[data-direct-product-image]')?.focus());
  }

  function booth(boothIndex) {
    const state = getState();
    const item = state.booths?.[boothIndex];
    if (!item) return;
    setInspector('制品', '制品管理 · ' + (item.no || item.name || '摊位'), boothProductsHtml(item, boothIndex, esc));
    inspector.querySelector('[data-booth-product-back]')?.addEventListener('click', () => openItemInspector('booths', boothIndex));
    inspector.querySelector('[data-booth-product-add]')?.addEventListener('click', () => addBoothProduct(boothIndex));
    inspector.querySelectorAll('[data-booth-product-open]').forEach((btn) => btn.addEventListener('click', () => product(boothIndex, Number(btn.dataset.boothProductOpen))));
    inspector.querySelectorAll('[data-booth-product-move]').forEach((btn) => btn.addEventListener('click', () => moveBoothProduct(boothIndex, Number(btn.dataset.boothProductMove), Number(btn.dataset.dir))));
  }

  return {product, booth};
}
