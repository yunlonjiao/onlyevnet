/* 观众问题: the organizer side of the visitor question box. */
import {getQuestions,setQuestionsEnabled,answerQuestion,deleteQuestion} from '/v8/publisher.js?v=8.52.0';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const when=iso=>{const d=new Date(iso);return Number.isNaN(d.getTime())?'':(d.getMonth()+1)+'/'+d.getDate()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};

// deps: {$, getProject(), cloudIdFor(project), message(text,kind), onCount(n)}
export async function loadAsk({$,getProject,cloudIdFor,message,onCount}){
  const list=$('#askList'),setup=$('#askSetup'),empty=$('#askEmpty');
  list.innerHTML='';setup.hidden=true;empty.hidden=true;message('');
  const project=getProject();
  if(!project){message('还没有活动，先去「模板库」新建一个。');return}
  let cid;
  try{cid=await cloudIdFor(project)}catch(err){message(err?.message||'无法连接账号服务，请检查网络后重试。','error');return}
  let data;
  try{data=await getQuestions(cid)}catch(err){message(err?.message||'没能读取问题，请稍后再试。','error');return}
  setup.hidden=false;$('#askEnabled').checked=data.enabled;
  $('#askEnabled').onchange=async e=>{
    try{await setQuestionsEnabled(cid,e.target.checked);message(e.target.checked?'已打开。游客网站刷新后会出现提问按钮。':'已关闭。','ok')}
    catch(err){e.target.checked=!e.target.checked;message(err?.message||'没保存成功，请稍后再试。','error')}
  };
  const open=data.items.filter(q=>!q.answer).length;onCount(open);
  empty.hidden=data.items.length>0;
  list.innerHTML=data.items.map(q=>
    '<article class="settings-card ask-item'+(q.answer?'':' is-new')+'" data-id="'+esc(q.id)+'"><div class="ask-q"><b>'+esc(q.text)+'</b><small>'+esc(when(q.createdAt))+(q.answer?'':' · 待回复')+'</small></div>'+
    '<textarea rows="3" maxlength="1000" placeholder="写下回复">'+esc(q.answer)+'</textarea>'+
    '<div class="ask-actions"><label><input type="checkbox" class="ask-publish"'+(q.published||!q.answer?' checked':'')+'> 公开成常见问题</label><button type="button" class="primary" data-save>保存回复</button><button type="button" class="quiet" data-delete>删除</button></div></article>').join('');
  list.onclick=async e=>{
    const b=e.target.closest('button');if(!b)return;const card=b.closest('.ask-item'),id=card.dataset.id;
    try{
      if(b.hasAttribute('data-save')){
        await answerQuestion(cid,id,{answer:card.querySelector('textarea').value.trim(),published:card.querySelector('.ask-publish').checked});
        message('已保存。','ok');loadAsk({$,getProject,cloudIdFor,message,onCount});
      }else if(b.hasAttribute('data-delete')){
        if(!confirm('删除这条问题？'))return;
        await deleteQuestion(cid,id);loadAsk({$,getProject,cloudIdFor,message,onCount});
      }
    }catch(err){message(err?.message||'没成功，请稍后再试。','error')}
  };
}
