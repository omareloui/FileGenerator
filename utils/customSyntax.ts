import { kebabToPascal, kebabToCamel } from "./index.ts";

export type Cases = "p" | "c";

export function parser(str: string, props?: Record<string, unknown>) {
  const propKeys = Object.keys(props || {});
  if (!props || propKeys.length === 0) return str;

  const RESOLVE_SYNTAX_REGEX = /\{(.+?)\}/g;
  const CASE_SYNTAX_REGEX = /\{.+?(,[pc]?)\}/;

  const removeCaseSyntaxFromString = (
    matchedResult: string,
    matchedCase: string | null
  ) => (matchedCase ? matchedResult.replace(matchedCase, "") : matchedResult);

  const resolved = str.replace(RESOLVE_SYNTAX_REGEX, (v) => {
    const caseMatch = v.match(CASE_SYNTAX_REGEX);
    const wantedCase = caseMatch ? caseMatch[1] : null;
    const trimmedWantedCase = wantedCase?.replace(",", "") as Cases | undefined;

    v = removeCaseSyntaxFromString(v, wantedCase);
    v = v.replace(RESOLVE_SYNTAX_REGEX, "$1");

    const resolvedValue =
      (props[v] as string | number | Date | undefined)?.toString() || "";

    if (trimmedWantedCase === "p") return kebabToPascal(resolvedValue);
    if (trimmedWantedCase === "c") return kebabToCamel(resolvedValue);
    return resolvedValue;
  });

  return resolved;
}
