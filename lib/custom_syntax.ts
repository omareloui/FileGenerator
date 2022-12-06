import { assertEquals } from "assert";

import { CaseConvertor } from "./case_convertor.ts";

import type { PropValue } from "../types/mod.ts";

export type Case = "p" | "c" | "l" | "s" | "ss";

export class CustomSyntax {
  private static RESOLVE_SYNTAX_REGEX = /\{(.+?)\}/g;

  private static CASE_SYNTAX_REGEX = /\{.+?,(p|c|l|s|ss)\}/;

  public static parse<T extends Record<string, PropValue>>(
    str: string,
    props?: T,
  ) {
    if (!props) return str;

    const propKeys = Object.keys(props || {});
    if (propKeys.length === 0) return str;

    const resolved = str.replace(this.RESOLVE_SYNTAX_REGEX, (v) => {
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

Deno.test("should return the string as is if provided a string without {}", () => {
  const text = "some-text";
  const result = CustomSyntax.parse(text);

  assertEquals(result, text);
});

Deno.test("should not resolve anything if no props provided", () => {
  const text = "{some-text}";
  const result = CustomSyntax.parse(text);
  assertEquals(result, text);
});

Deno.test("should resolve the string on provided a prop and pass the string with {}", () => {
  const text = "{name}";
  const props = { name: "prop-name" };
  const resolved = CustomSyntax.parse(text, props);
  assertEquals(resolved, props.name);
});

Deno.test("should resolve the string on provided a prop and pass the string with {} with a suffix", () => {
  const text = "controller.{name}";
  const props = { name: "user" };
  const resolved = CustomSyntax.parse(text, props);
  assertEquals(resolved, "controller.user");
});

Deno.test("should resolve the string on provided a prop and pass the string with {} with a prefix", () => {
  const text = "{name}.controller";
  const props = { name: "user" };
  const resolved = CustomSyntax.parse(text, props);
  assertEquals(resolved, "user.controller");
});

Deno.test("should resolve the string on provided a prop and pass the string with {} with two or more props", () => {
  const text = "{name}.{role}";
  const props = { name: "user", role: "admin" };
  const resolved = CustomSyntax.parse(text, props);
  assertEquals(resolved, "user.admin");
});

Deno.test("should change the case to PascalCase on providing the option for PascalCase", () => {
  const text = "{name,p}.{role}";
  const props = { name: "omar-eloui", role: "admin" };
  const resolved = CustomSyntax.parse(text, props);
  assertEquals(resolved, "OmarEloui.admin");
});

Deno.test("should change the case to camelCase on providing the option for camelCase case", () => {
  const text = "{name,c}.{role,p}";
  const props = { name: "omar-eloui", role: "admin" };
  const resolved = CustomSyntax.parse(text, props);
  assertEquals(resolved, "omarEloui.Admin");
});
