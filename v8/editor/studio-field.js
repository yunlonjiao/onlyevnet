/* One editable-field contract for the IP ONLY and creator Studio inspectors. */
/** @param {HTMLInputElement|HTMLTextAreaElement|null} input @param {{path:string, checkpoint:()=>void, update:(path:string,value:any)=>void, cleanValue:(value:string)=>string, parseValue?:(value:string)=>any, onUpdated?:(value:any,path:string)=>void}} options */
export function bindStudioField(input,{path,checkpoint,update,cleanValue,parseValue,onUpdated}={}){
 if(!input)return ()=>{};
 let started=false;
 const parse=typeof parseValue==='function'?parseValue:(value=>value);
 const onInput=event=>{
  if(!started){checkpoint();started=true;}
  const value=parse(event.target.value);
  update(path,value);
  onUpdated?.(value,path);
 };
 const onBlur=event=>{
  started=false;
  if(typeof cleanValue!=='function')return;
  const value=cleanValue(event.target.value);
  if(value!==event.target.value)event.target.value=value;
  update(path,parse(value));
 };
 input.addEventListener('input',onInput);
 input.addEventListener('blur',onBlur);
 return ()=>{input.removeEventListener('input',onInput);input.removeEventListener('blur',onBlur)};
}
