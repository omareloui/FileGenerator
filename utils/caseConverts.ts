export function kebabToPascal(str: string) {
  return str
    .toLowerCase()
    .replace(/\b./g, (v) => v.toUpperCase())
    .replace(/-/g, "");
}

export function kebabToLazy(str: string) {
  return str.toLowerCase().replace(/-/g, "");
}
