import { CaseConvertor } from "./CaseConvertor";

export type Case = "p" | "c" | "l" | "s" | "ss";

export class CustomSyntax {
  private static RESOLVE_SYNTAX_REGEX = /\{(.+?)\}/g;

  private static CASE_SYNTAX_REGEX = /\{.+?,(p|c|l|s|ss)\}/;

  public static parse<
    T extends Record<string, string | number | Date | undefined>,
  >(str: string, props?: T) {
    if (!props) return str;

    const propKeys = Object.keys(props || {});
    if (propKeys.length === 0) return str;

    const resolved = str.replace(this.RESOLVE_SYNTAX_REGEX, v => {
      const caseMatch = v.match(this.CASE_SYNTAX_REGEX);
      const wantedCase = caseMatch ? (caseMatch[1] as Case) : null;

      const propWithCurly = this.removeCaseSyntaxFromString(
        v,
        `,${wantedCase}`,
      );
      const propName = propWithCurly.replace(this.RESOLVE_SYNTAX_REGEX, "$1");

      const resolvedValue = props[propName]?.toString() || "";

      return this.resolveCase(resolvedValue, wantedCase);
    });

    return resolved;
  }

  private static removeCaseSyntaxFromString(
    matchedResult: string,
    matchedCase: string | null,
  ) {
    return matchedCase ? matchedResult.replace(matchedCase, "") : matchedResult;
  }

  private static resolveCase(v: string, c: Case | null) {
    if (c === "p") return CaseConvertor.kebabToPascal(v);
    if (c === "c") return CaseConvertor.kebabToCamel(v);
    if (c === "l") return CaseConvertor.kebabToLazy(v);
    if (c === "s") return CaseConvertor.kebabToSnake(v);
    if (c === "ss") return CaseConvertor.kebabToScreamingSnake(v);
    return v;
  }
}
