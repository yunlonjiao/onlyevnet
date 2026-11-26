import { b64ToBytes, bytesToB64 } from '../core/crypto.js';

const PBKDF2_ITERATIONS = 100000;

export async function hashPassword(password, saltB64) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: b64ToBytes(saltB64), iterations: PBKDF2_ITERATIONS }, key, 256);
  return bytesToB64(new Uint8Array(bits));
}

export function newSalt() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return bytesToB64(b);
}
