export function now() {
  return new Date().toISOString();
}

export function id(prefix = 'id') {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}
