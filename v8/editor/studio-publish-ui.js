export function createPublishUi({
  $, getState, getTemplate, getRecord, hasLiveSite, cleanSlug, suggestSlug, publishChecks,
  renderStages, renderShare, dialog, slugInput, primary, status, result, url,
  isRenaming, setRenaming
}) {
  function render() {
    renderStages();
    renderShare();
    const state = getState(), template = getTemplate(), record = getRecord();
    const hasSite = hasLiveSite(record);
    const slug = cleanSlug(record?.slug || suggestSlug(state.eventName, state.date));
    if (!hasSite) setRenaming(false);
    slugInput.value = slug;
    slugInput.readOnly = hasSite && !isRenaming();
    const rename = $('#publishRename');
    if (rename) rename.hidden = !hasSite || isRenaming();
    const hint = $('#publishSlugHint');
    if (hint) hint.textContent = isRenaming() ? '改网址后，旧网址会自动跳到新网址。' : '发布后得到一个游客网址，再次发布会更新同一个网站。';
    const host = $('#publishHost');
    if (host) host.textContent = '.onlyevent.cn';
    primary.textContent = hasSite ? (isRenaming() ? '保存新网址并更新' : '更新网站') : '发布网站';
    status.textContent = hasSite ? '已发布。点「更新网站」把最新修改发上去。' : (slugInput.value ? '确认信息后点「发布网站」上线。' : '先填一个网站地址。');
    const checks = publishChecks(state, { hasBoothPage: !(template.studioPages?.hidden || []).includes('booths') });
    const list = $('#publishChecks');
    if (list) {
      list.innerHTML = checks.map(() => '<li></li>').join('');
      checks.forEach((t, i) => { list.children[i].textContent = t; });
      list.hidden = !checks.length;
      const title = $('#publishChecksTitle');
      if (title) title.hidden = !checks.length;
    }
    result.hidden = !record?.url;
    url.textContent = record?.url || '';
    const open = $('#publishOpen'), copy = $('#publishCopy');
    if (open) open.disabled = !record?.url;
    if (copy) copy.disabled = !record?.url;
  }

  function open() {
    setRenaming(false);
    render();
    dialog.showModal();
    if (!hasLiveSite(getRecord())) setTimeout(() => slugInput.select(), 0);
  }

  function setBusy(busy, text = '') {
    primary.disabled = busy;
    const download = $('#publishDownload');
    if (download) download.disabled = busy;
    slugInput.disabled = busy || (hasLiveSite(getRecord()) && !isRenaming());
    const rename = $('#publishRename');
    if (rename) rename.disabled = busy;
    if (text) status.textContent = text;
  }

  return {render, open, setBusy};
}
