export function setDeepState(root,path,value){
  const keys=path.split('.');
  let target=root;
  for(let i=0;i<keys.length-1;i++){const key=/^\d+$/.test(keys[i])?Number(keys[i]):keys[i];if(target[key]==null)target[key]=/^\d+$/.test(keys[i+1])?[]:{};target=target[key];}
  target[/^\d+$/.test(keys.at(-1))?Number(keys.at(-1)):keys.at(-1)]=value;
}

export function getDeepState(root,path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],root);}
