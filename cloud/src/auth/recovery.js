const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function newRecoveryCode() {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return [...b].map((x) => ALPHABET[x & 31]).join('');
}

export function formatRecoveryCode(code) {
  return code.replace(/(.{4})(?=.)/g, '$1-');
}

export function recoveryCandidates(input) {
  const raw = String(input || '').trim();
  const canonical = raw.replace(/[\s-]+/g, '').toUpperCase();
  return canonical && canonical !== raw ? [raw, canonical] : [raw];
}
