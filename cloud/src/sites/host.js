import { baseDomain } from '../core/http.js';
import { cleanSlug } from '../core/validation.js';

export const RESERVED_SUBDOMAINS=new Set(['www','publisher','api','admin','app']);

// Recovery codes: 12 characters from an alphabet without 0/O/1/I, shown as XXXX-XXXX-XXXX (60 bits).
// Codes issued before this change (24 characters, case-sensitive) still verify as typed.
export function getSlugFromHost(req,env){const host=new URL(req.url).hostname.toLowerCase(),base=baseDomain(env);if(!base||base.includes('example.com')||!host.endsWith('.'+base))return '';const sub=host.slice(0,-(base.length+1));if(!sub||sub.includes('.')||RESERVED_SUBDOMAINS.has(sub))return '';return cleanSlug(sub)}
