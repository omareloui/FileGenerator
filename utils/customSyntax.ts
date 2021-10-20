import {
  kebabToPascal,
  kebabToCamel,
  kebabToLazy,
  kebabToSnake,
  kebabToScreamingSnake,
} from "./index.ts";

export type Cases = "p" | "c" | "l" | "s" | "ss";

export function parser(str: string, props?: Record<string, unknown>) {
  const propKeys = Object.keys(props || {});
  if (!props || propKeys.length === 0) return str;

  const RESOLVE_SYNTAX_REGEX = /\{(.+?)\}/g;
  const CASE_SYNTAX_REGEX = /\{.+?,(p|c|l|s|ss)\}/;

  const removeCaseSyntaxFromString = (
    matchedResult: string,
    matchedCase: string | null
  ) => (matchedCase ? matchedResult.replace(matchedCase, "") : matchedResult);

  const resolved = str.replace(RESOLVE_SYNTAX_REGEX, (v) => {
    const caseMatch = v.match(CASE_SYNTAX_REGEX);
    const wantedCase = caseMatch ? (caseMatch[1] as Cases) : null;

    v = removeCaseSyntaxFromString(v, `,${wantedCase}`);
    v = v.replace(RESOLVE_SYNTAX_REGEX, "$1");

    const resolvedValue =
      (props[v] as string | number | Date | undefined)?.toString() || "";

    if (wantedCase === "p") return kebabToPascal(resolvedValue);
    if (wantedCase === "c") return kebabToCamel(resolvedValue);
    if (wantedCase === "l") return kebabToLazy(resolvedValue);
    if (wantedCase === "s") return kebabToSnake(resolvedValue);
    if (wantedCase === "ss") return kebabToScreamingSnake(resolvedValue);
    return resolvedValue;
  });

  return resolved;
}
