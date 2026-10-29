/* Single source of truth for the Studio version shown in the editor toolbar.
   Bump it with every release. The badge is hidden on the production domain. */
export const STUDIO_VERSION='8.52.0';
const HIDDEN_ON=/^(?:www\.)?onlyevent\.cn$/;
export function applyStudioVersion(doc=document,hostname=location.hostname){
  const badge=doc.querySelector('#studioVersion');
  if(!badge)return;
  badge.textContent='v'+STUDIO_VERSION;
  badge.hidden=HIDDEN_ON.test(hostname);
}
