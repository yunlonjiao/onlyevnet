export function mediaKeysFromValue(value, out = new Set()) {
  if (Array.isArray(value)) {
    for (const v of value) mediaKeysFromValue(v, out);
    return out;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) mediaKeysFromValue(v, out);
    return out;
  }
  if (typeof value === 'string') {
    const re = /\/?media\/(uploads\/[a-zA-Z0-9_\/-]+\.[a-zA-Z0-9]+)/g;
    let m;
    while ((m = re.exec(value))) out.add(m[1]);
  }
  return out;
}
