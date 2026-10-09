/**
 * Shared renderer dependency contract.
 * Keep this module tiny: it is used by the editor renderer only.
 *
 * @typedef {Object} RendererContext
 * @property {(selector:string)=>Element|null} qs
 * @property {(selector:string)=>Element[]} qsa
 * @property {(value:any)=>string} escapeHtml
 * @property {()=>any} getState
 * @property {()=>string} getMode
 */

/**
 * Fail fast when a renderer module dependency is missing.
 * @param {RendererContext} context
 * @returns {RendererContext}
 */
export function validateRendererContext(context){
  const required=['qs','qsa','escapeHtml','getState','getMode'];
  const missing=required.filter(key=>typeof context?.[key]!=='function');
  if(missing.length)throw new TypeError('Invalid renderer context: missing '+missing.join(', '));
  return context;
}
