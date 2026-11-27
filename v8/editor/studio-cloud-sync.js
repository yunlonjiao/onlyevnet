export function createCloudSync({
  getState, getTemplate, getProjectId, readCloudSession,
  ensureCloudProjectFor, saveCloudConfig, syncAdminProject, saveStateEl, getRevision
}) {
  let timer = 0, syncing = false;

  function available() {
    return getProjectId() !== 'default' && !!readCloudSession();
  }

  function schedule() {
    if (!available()) return;
    clearTimeout(timer);
    timer = setTimeout(sync, 2500);
  }

  async function sync() {
    if (syncing) { schedule(); return; }
    syncing = true;
    try {
      const state = getState(), template = getTemplate();
      const revision = getRevision();
      const cloudProjectId = await ensureCloudProjectFor({templateId: template.id, projectId: getProjectId(), name: state.eventName});
      await saveCloudConfig({projectId: cloudProjectId, config: {...state, templateId: template.id}});
      syncAdminProject({cloudProjectId});
      if (getRevision() !== revision) {
        saveStateEl.textContent = '已保存 · 有新修改等待同步';
        schedule();
        return;
      }
      saveStateEl.textContent = '已保存 · 云端已同步';
    } catch (err) {
      saveStateEl.textContent = err?.status === 413
        ? '已保存在本机 · 云端同步失败：项目数据过大'
        : err?.status === 401
          ? '已保存在本机 · 登录后可同步到云端'
          : '已保存在本机 · 云端同步失败';
    } finally {
      syncing = false;
    }
  }

  return {available, schedule, sync};
}
