export function createSaveController({
  getState, saveStateEl, storageKey, syncContentCounts, syncStudioIdentity,
  syncAdminProject, scheduleCloudSync
}) {
  let timer = 0;
  return function save() {
    saveStateEl.textContent = '保存中…';
    syncContentCounts();
    syncStudioIdentity();
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(getState()));
        syncAdminProject();
        saveStateEl.textContent = '已保存';
        scheduleCloudSync();
      } catch {
        saveStateEl.textContent = '保存失败：图片过大或浏览器存储不足';
      }
    }, 180);
  };
}
