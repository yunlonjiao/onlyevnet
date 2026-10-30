/* 报名管理: COS, photographer, volunteer or custom sign-up forms with one public link each. */
import {listSignups,createSignup,updateSignup,deleteSignup,listSignupEntries,setSignupEntryStatus,deleteSignupEntry,signupLink} from '/v8/publisher.js?v=8.52.0';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const SIGNUP_PRESETS={
  cos:{label:'COS 自由行',title:'COS 自由行报名',intro:'想来现场出 cos 的朋友，填一下信息，主办方会统一安排。',fields:[['昵称 / ID',1],['出的角色 / 作品',1],['联系方式（QQ 或微信）',1],['备注',0,1]]},
  photographer:{label:'摄影师申请',title:'摄影师申请',intro:'填写你的拍摄信息，审核通过后会通知你。',fields:[['昵称 / ID',1],['作品链接 / 主页',1],['擅长的风格',0],['联系方式（QQ 或微信）',1],['备注',0,1]]},
  volunteer:{label:'志愿者申请',title:'志愿者申请',intro:'想来帮忙的朋友，说一下你能来的时间。',fields:[['昵称 / 姓名',1],['能参加的时间段',1],['以前帮忙的经验',0,1],['联系方式（QQ 或微信）',1]]},
  custom:{label:'自定义',title:'报名',intro:'',fields:[['昵称',1],['联系方式',1]]}
};
const STATUS={pending:'待审核',approved:'已通过',rejected:'已拒绝'};
const csvCell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
const toConfig=p=>({title:p.title,intro:p.intro,fields:p.fields.map(([label,required,long])=>({label,required:!!required,long:!!long}))});

export function exportCsv(form,entries){
  const labels=form.config.fields.map(f=>f.label);
  const rows=[['提交时间',...labels,'状态'],...entries.map(e=>[e.createdAt,...labels.map((l,i)=>(e.answers[i]&&e.answers[i].value)||''),STATUS[e.status]||e.status])];
  return '﻿'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
}

// deps: {$, getProject(), cloudIdFor(project), message(text,kind), onCount(n), download(text,name), copy(text)}
export async function loadSignups(deps){
  const {$,getProject,cloudIdFor,message,onCount}=deps,root=$('#signupRoot');
  root.innerHTML='';message('');
  const project=getProject();
  if(!project){message('还没有活动，先去「模板库」新建一个。');return}
  let cid;try{cid=await cloudIdFor(project)}catch(err){message(err?.message||'无法连接账号服务，请检查网络后重试。','error');return}
  const reload=()=>loadSignups(deps);
  const fail=err=>message(err?.message||'没成功，请稍后再试。','error');
  let forms;try{forms=(await listSignups(cid)).forms}catch(err){fail(err);return}
  onCount(forms.reduce((n,f)=>n+f.pending,0));
  root.innerHTML=
    '<section class="settings-card"><h2>新建报名表</h2><div class="signup-new">'+Object.entries(SIGNUP_PRESETS).map(([k,p])=>'<button type="button" class="quiet" data-new="'+k+'">＋ '+p.label+'</button>').join('')+'</div><p>每个报名表有自己的链接，发给对方就能填，不用登录。一个活动最多 8 个。</p></section>'+
    (forms.length?forms.map(f=>
      '<article class="settings-card signup-card" data-id="'+esc(f.id)+'"><div class="signup-head"><div><b>'+esc(f.config.title)+'</b><small>'+esc(SIGNUP_PRESETS[f.kind]?.label||'')+' · 共 '+f.total+' 份，待审核 '+f.pending+'</small></div><label class="signup-open"><input type="checkbox" data-open'+(f.open?' checked':'')+'> 接受报名</label></div>'+
      '<div class="signup-link"><code>'+esc(signupLink(f.token))+'</code><button type="button" class="quiet" data-copy>复制链接</button></div>'+
      '<div class="signup-actions"><button type="button" class="quiet" data-entries>查看报名</button><button type="button" class="quiet" data-edit>修改内容</button><button type="button" class="quiet" data-delete>删除</button></div><div class="signup-detail"></div></article>').join(''):'<p class="collect-empty">还没有报名表。点上面的按钮新建一个。</p>');
  const formById=id=>forms.find(f=>f.id===id);
  root.onchange=async e=>{
    if(!e.target.hasAttribute('data-open'))return;const f=formById(e.target.closest('.signup-card').dataset.id);
    try{await updateSignup(cid,f.id,{open:e.target.checked});message(e.target.checked?'已开始接受报名。':'已停止接受报名。','ok')}catch(err){e.target.checked=!e.target.checked;fail(err)}
  };
  root.onclick=async e=>{
    const b=e.target.closest('button');if(!b)return;
    try{
      if(b.dataset.new){await createSignup(cid,b.dataset.new,toConfig(SIGNUP_PRESETS[b.dataset.new]));reload();return}
      const card=b.closest('.signup-card');if(!card)return;const f=formById(card.dataset.id),detail=card.querySelector('.signup-detail');
      if(b.hasAttribute('data-copy')){deps.copy(signupLink(f.token));message('链接已复制。','ok')}
      else if(b.hasAttribute('data-delete')){if(!confirm('删除这个报名表和里面的全部报名？'))return;await deleteSignup(cid,f.id);reload()}
      else if(b.hasAttribute('data-edit'))renderEditor(detail,f);
      else if(b.hasAttribute('data-entries'))await renderEntries(detail,f);
    }catch(err){fail(err)}
  };
  function renderEditor(detail,f){
    const c=f.config;
    const rows=()=>c.fields.map((x,i)=>'<div class="signup-field" data-i="'+i+'"><input class="sf-label" maxlength="30" value="'+esc(x.label)+'" placeholder="填写项名称"><label><input type="checkbox" class="sf-req"'+(x.required?' checked':'')+'> 必填</label><label><input type="checkbox" class="sf-long"'+(x.long?' checked':'')+'> 多行</label><button type="button" class="quiet" data-rm="'+i+'" aria-label="删除这一项">×</button></div>').join('');
    detail.innerHTML='<div class="signup-edit"><label>标题<input class="sf-title" maxlength="40" value="'+esc(c.title)+'"></label><label>说明<textarea class="sf-intro" rows="2" maxlength="200">'+esc(c.intro)+'</textarea></label><div class="sf-rows">'+rows()+'</div><div class="signup-actions"><button type="button" class="quiet" data-addfield>＋ 添加填写项</button><button type="button" class="primary" data-saveform>保存</button></div></div>';
    detail.onclick=async ev=>{
      const bt=ev.target.closest('button');if(!bt)return;
      const read=()=>{c.title=detail.querySelector('.sf-title').value;c.intro=detail.querySelector('.sf-intro').value;c.fields=[...detail.querySelectorAll('.signup-field')].map(r=>({label:r.querySelector('.sf-label').value,required:r.querySelector('.sf-req').checked,long:r.querySelector('.sf-long').checked}))};
      if(bt.dataset.rm!==undefined){read();c.fields.splice(Number(bt.dataset.rm),1);detail.querySelector('.sf-rows').innerHTML=rows()}
      else if(bt.hasAttribute('data-addfield')){read();if(c.fields.length>=8){message('一个报名表最多 8 个填写项。','error');return}c.fields.push({label:'',required:false,long:false});detail.querySelector('.sf-rows').innerHTML=rows()}
      else if(bt.hasAttribute('data-saveform')){read();try{await updateSignup(cid,f.id,{config:c});message('已保存。已提交的报名保留当时的填写项。','ok');reload()}catch(err){fail(err)}}
    };
  }
  async function renderEntries(detail,f){
    const {entries}=await listSignupEntries(cid,f.id);
    if(!entries.length){detail.innerHTML='<p class="collect-empty">还没有人报名。</p>';return}
    detail.innerHTML='<div class="signup-actions"><button type="button" class="quiet" data-export>导出名单</button></div>'+entries.map(en=>
      '<div class="signup-entry is-'+en.status+'" data-eid="'+esc(en.id)+'"><div class="signup-answers">'+en.answers.map(a=>'<span><small>'+esc(a.label)+'</small>'+esc(a.value||'—')+'</span>').join('')+'</div><div class="signup-actions"><em>'+(STATUS[en.status]||en.status)+'</em>'+
      (en.status!=='approved'?'<button type="button" class="quiet" data-st="approved">通过</button>':'')+(en.status!=='rejected'?'<button type="button" class="quiet" data-st="rejected">拒绝</button>':'')+'<button type="button" class="quiet" data-del>删除</button></div></div>').join('');
    detail.onclick=async ev=>{
      const bt=ev.target.closest('button');if(!bt)return;
      try{
        if(bt.hasAttribute('data-export')){deps.download(exportCsv(f,entries),(f.config.title||'报名')+'.csv');return}
        const eid=bt.closest('.signup-entry').dataset.eid;
        if(bt.dataset.st)await setSignupEntryStatus(cid,f.id,eid,bt.dataset.st);
        else if(bt.hasAttribute('data-del')){if(!confirm('删除这条报名？'))return;await deleteSignupEntry(cid,f.id,eid)}
        else return;
        await renderEntries(detail,f);
      }catch(err){fail(err)}
    };
  }
}
