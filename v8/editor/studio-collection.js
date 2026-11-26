export function collectionArrayFor(collection,state){
  if(collection==='guide')return state.guide?.items;
  if(collection==='explore')return state.venueMap?.links;
  return state[collection];
}

export function collectionPathFor(collection,index,key){
  if(collection==='guide')return 'guide.items.'+index+'.'+key;
  if(collection==='explore')return 'venueMap.links.'+index+'.'+key;
  return collection+'.'+index+'.'+key;
}
