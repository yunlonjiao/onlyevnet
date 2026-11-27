export function createItemMutations({
  getState, collectionArray, checkpoint, cleanupDeletedReferences, save, send,
  syncContentCounts, openCollectionManager, openItemInspector, showInspectorEmpty, uid, syncModuleControls
}) {
  return function mutateItem(collection, index, op) {
    const state = getState();
    const arr = collectionArray(collection);
    if (!Array.isArray(arr)) return;
    checkpoint();
    if (op === 'up' && index > 0) { [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]; index--; }
    if (op === 'down' && index < arr.length - 1) { [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]]; index++; }
    if (op === 'delete' && arr.length) {
      const removed = arr[index];
      cleanupDeletedReferences(collection, removed);
      arr.splice(index, 1);
      if (!arr.length) {
        save(); send({type: 'OE_REPLACE_STATE', state}); syncContentCounts();
        openCollectionManager(collection); showInspectorEmpty(); return;
      }
      index = Math.max(0, index - 1);
    }
    if (op === 'add') {
      const fresh = collection === 'ribbonItems' ? {id: uid('rb'), text: '新滚动公告'} :
        collection === 'explore' ? {id: uid('ml'), label: '新探索入口', target: 'activities', itemType: 'page', itemId: ''} :
        collection === 'tickets' ? {id: uid('t'), name: '新票种', price: '¥0', gift: '', note: '', image: ''} :
        collection === 'guide' ? {id: uid('gd'), preset: 'custom', title: '新指南内容', label: 'GUIDE', text: ''} :
        collection === 'guests' ? {id: uid('g'), guestType: 'person', name: '新嘉宾', role: 'GUEST', members: '', attendanceNote: '', works: '', intro: '', image: '', socialLinks: []} :
        collection === 'booths' ? {id: uid('b'), no: '', name: '新摊位', logo: '', type: '', intro: '', products: [{id: uid('p'), name: '新制品', tag: '', price: '', note: '', image: ''}]} :
        collection === 'updates' ? {id: uid('u'), date: '', title: '新更新', target: 'top'} :
        collection === 'participation' ? {id: uid('pa'), preset: 'custom', activityType: 'general', title: '新活动', text: '', detail: '', participationMode: '自由参加', requirements: '', rules: '', signingRules: '', activityLocation: '', availabilityNote: '', setlist: '', image: '', target: 'activities', url: '', guestIds: []} :
        collection === 'socialLinks' ? {id: uid('sl'), label: '新社群入口', note: '', url: '', image: ''} :
        collection === 'sponsors' ? {id: uid('sp'), name: '新赞助商', level: '合作伙伴', url: '', logo: ''} :
        {id: uid('s'), time: '12:00', title: '新活动', stage: 'MAIN STAGE', detail: '', participationId: '', guestIds: [], registrationUrl: ''};
      arr.splice(index + 1, 0, fresh); index++;
      if (collection === 'sponsors') {
        state.modules = state.modules || {};
        state.modules.sponsors = true;
        syncModuleControls();
      }
    }
    save(); send({type: 'OE_REPLACE_STATE', state}); syncContentCounts();
    openCollectionManager(collection, index); openItemInspector(collection, index);
  };
}
