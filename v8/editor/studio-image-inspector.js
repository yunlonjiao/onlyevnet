export function createImageInspector({
  $, getState, getDeep, setInspector, inspector, esc, moreMapsMarkup, bindMoreMaps,
  openCollectionManager, setPageContentActive, mutateItem, checkpoint, setDeep, save,
  send, openImageCropper, toast
}) {
  function open(path) {
    const state = getState();
    const current = getDeep(path);
    if (path === 'venueMap.image' || /^guide\.items\.\d+\.image$/.test(path)) {
      const guideMatch = path.match(/^guide\.items\.(\d+)\.image$/), guideItem = guideMatch ? state.guide?.items?.[Number(guideMatch[1])] : null;
      const isGuideRoute = !!guideItem && guideItem.preset === 'traffic';
      const title = isGuideRoute ? '入口示意图 / 交通路线图' : '场地图';
      const isHomeMap = path === 'venueMap.image' && state.templateId === '02-scrapbook';
      const markup = isHomeMap ?
        '<div class="item-media hero-media-field"><span>场地图 KV</span><div class="item-media-row">' +
        (current ? '<img src="' + esc(current) + '" alt="场地图预览">' : '<div class="item-media-empty">＋</div>') +
        '<div><button id="replaceImage" type="button">选择 / 裁剪</button>' +
        (current ? '<button id="removeImage" type="button" class="ghost danger">移除</button>' : '') +
        '</div></div></div>' +
        '<div class="item-media"><span>地图关联入口</span><div class="map-links-editor-preview">' +
        (state.venueMap?.links || []).map((x, i) => '<button type="button" class="ghost map-link-edit" data-map-link-index="' + i + '"><span>' + esc(x.label || '链接 ' + (i + 1)) + '</span><span>编辑 ↗</span></button>').join('') +
        '<button type="button" class="ghost" id="addMapLink">＋ 添加关联入口</button></div></div>' :
        '<div class="item-media"><span>' + esc(title) + '</span><div class="item-media-row">' +
        (current ? '<img src="' + esc(current) + '" alt="">' : '<div class="item-media-empty">＋</div>') +
        '<div><button id="replaceImage" type="button">' + (current ? '替换图片' : '选择 / 裁剪') + '</button>' +
        (current ? '<button id="removeImage" type="button" class="ghost danger">移除</button>' : '') + '</div></div></div>';
      setInspector(title, isHomeMap ? '图片与关联链接' : title, markup + (path === 'venueMap.image' ? moreMapsMarkup() : ''));
      if (path === 'venueMap.image') bindMoreMaps();
      if (isHomeMap) {
        inspector.querySelectorAll('[data-map-link-index]').forEach((btn) => btn.addEventListener('click', () => {
          openCollectionManager('explore', Number(btn.dataset.mapLinkIndex));
          setPageContentActive({tool: 'map'});
        }));
        $('#addMapLink')?.addEventListener('click', () => mutateItem('explore', (state.venueMap?.links || []).length - 1, 'add'));
      }
      $('#replaceImage').onclick = () => { $('#imageInput').dataset.path = path; $('#imageInput').click(); };
      $('#removeImage')?.addEventListener('click', () => { checkpoint(); setDeep(path, ''); save(); send({type: 'OE_REPLACE_STATE', state}); open(path); });
      return;
    }
    setInspector('媒体', '图片', '<p class="inspector-path">' + esc(path) + '</p><div class="row"><button id="replaceImage" type="button">替换图片</button>' + (current ? '<button id="cropCurrentImage" type="button">裁剪当前图片</button><button id="removeImage" type="button" class="danger ghost">移除图片</button>' : '') + '</div>');
    $('#replaceImage').onclick = () => { $('#imageInput').dataset.path = path; $('#imageInput').click(); };
    $('#cropCurrentImage')?.addEventListener('click', () => openImageCropper(current, path));
    $('#removeImage')?.addEventListener('click', () => { checkpoint(); setDeep(path, ''); save(); send({type: 'OE_REPLACE_STATE', state}); toast('图片已移除'); open(path); });
  }
  return {open};
}
