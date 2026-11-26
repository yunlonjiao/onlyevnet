export function cleanupDeletedReferencesIn(state,collection,item,clearExploreItemRef){
 const id=item?.id;if(!id)return;
 if(collection==='participation'){
   (state.schedule||[]).forEach(row=>{if(row.participationId===id)row.participationId=''});
   (state.featuredActivities||[]).forEach(slot=>{if(slot.participationId===id)slot.participationId=''});
   clearExploreItemRef('participation',id);
 }
 if(collection==='schedule')clearExploreItemRef('schedule',id);
 if(collection==='guests'){
   (state.participation||[]).forEach(row=>{row.guestIds=(row.guestIds||[]).filter(x=>x!==id)});
   (state.schedule||[]).forEach(row=>{row.guestIds=(row.guestIds||[]).filter(x=>x!==id)});
   clearExploreItemRef('guest',id);
 }
 if(collection==='booths')clearExploreItemRef('booth',id);
 if(collection==='guide')clearExploreItemRef('guide',id);
}
