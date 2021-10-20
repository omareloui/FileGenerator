export function kebabToPascal(str: string) {
  return str
    .toLowerCase()
    .replace(/\b./g, (v) => v.toUpperCase())
    .replace(/-/g, "");
}

export function kebabToLazy(str: string) {
  return str.toLowerCase().replace(/-/g, "");
}

export function kebabToCamel(str: string) {
  return str
    .toLowerCase()
    .replace(/(?!^)\b./g, (v) => v.toUpperCase())
    .replace(/-/g, "");
}

export function kebabToSnake(str: string) {
  return str.toLowerCase().replace(/-/g, "_");
}

export function kebabToScreamingSnake(str: string) {
  return str.toUpperCase().replace(/-/g, "_");
}
