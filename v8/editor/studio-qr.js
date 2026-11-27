let qrLoader=null;
export function qrSvg(text){
 qrLoader??=new Promise((ok,fail)=>{if(/** @type {any} */ (window).qrcode)return ok();const el=document.createElement('script');el.src='/v8/vendor/qrcode.js';el.onload=ok;el.onerror=()=>{qrLoader=null;fail(new Error('qr'))};document.head.appendChild(el)});
 return qrLoader.then(()=>{const q=/** @type {any} */ (window).qrcode(0,'M');q.addData(text);q.make();return q.createSvgTag({cellSize:6,margin:3,scalable:true})});
}
