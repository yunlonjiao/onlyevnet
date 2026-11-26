export function createPublishFlow({
  slugInput, statusEl, getState, getTemplate, getProjectId,
  getRecord, setRecord, saveRecord, clearRecord, hasLiveSite, syncButton,
  cleanSlug, isValidSlug, publishStudioSite, getPending, setPending, setSiteStages,
  setBusy, renderDialog, syncAdminProject, toast,
  isRenaming, setRenaming
}) {
  return {
    async publish(html) {
      const slug = cleanSlug(slugInput.value);
      if (!isValidSlug(slug)) {
        setBusy(false, '地址需为 3–50 位小写字母、数字或连字符。');
        slugInput.focus();
        return;
      }
      setBusy(true, hasLiveSite(getRecord()) ? '正在更新网站…' : '正在发布网站…');
      try {
        const result = await publishStudioSite({
          html,
          title: getState().eventName || 'OnlyEvent',
          slug,
          templateId: getState().templateId || getTemplate().id,
          localProjectId: getProjectId(),
          publication: getRecord()
        });
        const publishedUrl = result.url || ('https://' + result.slug + '.onlyevent.cn');
        setRecord({});
        const pending = getPending();
        if (pending) {
          setBusy(true, '正在设置分批公开…');
          await setSiteStages(result.siteId, pending);
        }
        saveRecord({...result, url: publishedUrl, staged: !!pending?.length});
        setPending(null);
        syncAdminProject({siteUrl: publishedUrl, status: 'published'});
        const renamed = isRenaming();
        setRenaming(false);
        renderDialog();
        statusEl.textContent = renamed ? '网址已修改，旧网址会自动跳转到新网址' : '网站已上线';
        toast(renamed ? '网址已修改' : '网站已发布');
      } catch (error) {
        const msg = String(error?.message || '');
        if (/404|网站不存在|不属于当前活动项目/.test(msg)) {
          setRecord({});
          clearRecord();
          syncButton();
          renderDialog();
          statusEl.textContent = '这个网站已经被删除了，可以重新发布。';
          return;
        }
        statusEl.textContent = msg || '发布失败，请稍后重试';
      } finally {
        setBusy(false);
      }
    }
  };
}
