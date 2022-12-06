export class CaseConvertor {
  static kebabToPascal = (str: string) =>
    str
      .toLowerCase()
      .replace(/\b./g, (v) => v.toUpperCase())
      .replace(/-/g, "");

  static kebabToLazy = (str: string) => str.toLowerCase().replace(/-/g, "");

  static kebabToCamel = (str: string) =>
    str
      .toLowerCase()
      .replace(/(?!^)\b./g, (v) => v.toUpperCase())
      .replace(/-/g, "");

  static kebabToSnake = (str: string) => str.toLowerCase().replace(/-/g, "_");

  static kebabToScreamingSnake = (str: string) =>
    str.toUpperCase().replace(/-/g, "_");
}
