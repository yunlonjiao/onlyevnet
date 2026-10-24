/* History is shared by every OnlyEvent Studio template. It stores immutable snapshots. */
export function createStudioHistory({limit=80,onChange=()=>{}}={}){
 const backward=[],forward=[];
 const copy=value=>JSON.parse(JSON.stringify(value));
 const changed=()=>onChange({canUndo:backward.length>0,canRedo:forward.length>0});
 return {
  checkpoint(state){
   backward.push(copy(state));
   if(backward.length>limit)backward.shift();
   forward.length=0;changed();
  },
  undo(current){
   if(!backward.length)return null;
   forward.push(copy(current));
   const previous=backward.pop();changed();return previous;
  },
  redo(current){
   if(!forward.length)return null;
   backward.push(copy(current));
   const next=forward.pop();changed();return next;
  },
  get canUndo(){return backward.length>0},
  get canRedo(){return forward.length>0}
 };
}
