/* Cost estimate: a small planning sheet per activity. No accounting, invoices or payments;
   everything stays in this browser. */
export const COST_GROUPS=[
  {key:'venue',label:'场地',hint:'场地租金、押金、水电'},
  {key:'material',label:'物料与制作',hint:'展板、周边、印刷、设备租赁'},
  {key:'promo',label:'宣传',hint:'投放、视觉设计、拍摄'},
  {key:'other',label:'其他支出',hint:'保险、交通、人员补贴'}
];
const num=v=>{const n=Number(String(v??'').replace(/[^\d.\-]/g,''));return Number.isFinite(n)?n:0};

export function emptyCost(){return {items:{venue:[],material:[],promo:[],other:[]},price:0,people:100,variable:0,otherIncome:0}}

export function costSummary(cost){
  const fixed=COST_GROUPS.reduce((n,g)=>n+(cost.items[g.key]||[]).reduce((m,i)=>m+num(i.amount),0),0);
  const price=num(cost.price),variable=num(cost.variable),other=num(cost.otherIncome),people=Math.max(0,Math.round(num(cost.people)));
  const margin=price-variable;
  const at=n=>({people:n,income:n*price+other,cost:fixed+n*variable,balance:n*price+other-fixed-n*variable});
  const need=fixed-other;
  const breakEven=need<=0?0:margin>0?Math.ceil(need/margin):null;
  return {fixed,people,breakEven,now:at(people),table:[0.25,0.5,0.75,1,1.25,1.5].map(k=>at(Math.round(people*k)))};
}

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>(n<0?'-':'')+'¥'+Math.abs(Math.round(n*100)/100).toLocaleString('zh-CN');
const keyFor=id=>'onlyevent-cost-v1:'+id;
const rows=s=>s.table.map(r=>'<tr class="'+(r.balance<0?'neg':'pos')+'"><td>'+r.people+'</td><td>'+money(r.income)+'</td><td>'+money(r.cost)+'</td><td>'+money(r.balance)+'</td></tr>').join('');
const breakText=s=>s.breakEven===null?'票价不够覆盖成本':s.breakEven+' 人';

export function mountCost(root,projectId){
  let cost=emptyCost();
  try{const saved=JSON.parse(localStorage.getItem(keyFor(projectId))||'null');if(saved&&saved.items)cost={...emptyCost(),...saved,items:{...emptyCost().items,...saved.items}}}catch{}
  const save=()=>{try{localStorage.setItem(keyFor(projectId),JSON.stringify(cost))}catch{}};
  const draw=()=>{
    const s=costSummary(cost);
    root.innerHTML=
     '<section class="settings-card"><h2>支出</h2>'+COST_GROUPS.map(g=>
       '<div class="cost-group" data-group="'+g.key+'"><div class="cost-group-head"><b>'+g.label+'</b><small>'+g.hint+'</small></div>'+
       (cost.items[g.key]||[]).map((it,i)=>'<div class="cost-row"><input data-name="'+i+'" value="'+esc(it.name)+'" placeholder="名称"><input data-amount="'+i+'" inputmode="decimal" value="'+esc(it.amount)+'" placeholder="金额 ¥"><button type="button" class="quiet" data-remove="'+i+'" aria-label="删除这一项">×</button></div>').join('')+
       '<button type="button" class="quiet" data-add>＋ 添加一项</button></div>').join('')+'</section>'+
     '<section class="settings-card"><h2>收入与人数</h2><div class="cost-fields">'+
       [['price','单张票价 ¥'],['people','预计人数'],['variable','每位参与者的额外成本 ¥（饮品、小礼物等）'],['otherIncome','其他收入合计 ¥（摊位费、赞助等）']].map(([k,l])=>'<label><span>'+l+'</span><input data-field="'+k+'" inputmode="decimal" value="'+esc(cost[k])+'"></label>').join('')+
     '</div></section>'+
     '<div class="stats-cards cost-cards"><div><small>固定支出</small><b>'+money(s.fixed)+'</b></div><div><small>按预计人数的结余</small><b class="'+(s.now.balance<0?'neg':'pos')+'">'+money(s.now.balance)+'</b></div><div><small>收支平衡人数</small><b>'+breakText(s)+'</b></div></div>'+
     '<section class="settings-card"><h2>不同人数下的收支</h2><table class="cost-table"><thead><tr><th>人数</th><th>收入</th><th>支出</th><th>结余</th></tr></thead><tbody>'+rows(s)+'</tbody></table><p>这是粗略估算，帮你判断活动办不办得起来，不能代替正式的账目。</p></section>';
  };
  // Typing updates the numbers in place so the field keeps focus; adding or removing a row redraws.
  const refresh=()=>{
    const s=costSummary(cost),cards=root.querySelectorAll('.cost-cards b');
    if(cards.length===3){cards[0].textContent=money(s.fixed);cards[1].textContent=money(s.now.balance);cards[1].className=s.now.balance<0?'neg':'pos';cards[2].textContent=breakText(s)}
    const body=root.querySelector('.cost-table tbody');if(body)body.innerHTML=rows(s);
  };
  root.oninput=e=>{
    const t=e.target,g=t.closest('[data-group]')?.dataset.group;
    if(t.dataset.field)cost[t.dataset.field]=t.value;
    else if(g&&t.dataset.name!==undefined)cost.items[g][Number(t.dataset.name)].name=t.value;
    else if(g&&t.dataset.amount!==undefined)cost.items[g][Number(t.dataset.amount)].amount=t.value;
    else return;
    save();refresh();
  };
  root.onclick=e=>{
    const b=e.target.closest('button');if(!b)return;const g=b.closest('[data-group]')?.dataset.group;
    if(b.hasAttribute('data-add')&&g){cost.items[g].push({name:'',amount:''});save();draw();root.querySelector('[data-group="'+g+'"] .cost-row:last-of-type input')?.focus()}
    else if(b.dataset.remove!==undefined&&g){cost.items[g].splice(Number(b.dataset.remove),1);save();draw()}
  };
  draw();
}
