import { assertEquals } from "../deps.ts";
import { resolve } from "../utils/customSyntax.ts";

Deno.test(
  "should return the string as is if provided a string without {}",
  () => {
    const text = "some-text";
    const result = resolve(text);
    assertEquals(result, text);
  }
);

Deno.test("should not resolve anything if no props provided", () => {
  const text = "{some-text}";
  const result = resolve(text);
  assertEquals(result, text);
});

Deno.test(
  "should resolve the string on provided a prop and pass the string with {}",
  () => {
    const text = "{name}";
    const props = { name: "prop-name" };
    const resolved = resolve(text, props);
    assertEquals(resolved, props.name);
  }
);

Deno.test(
  "should resolve the string on provided a prop and pass the string with {} with a suffix",
  () => {
    const text = "controller.{name}";
    const props = { name: "user" };
    const resolved = resolve(text, props);
    assertEquals(resolved, "controller.user");
  }
);

Deno.test(
  "should resolve the string on provided a prop and pass the string with {} with a prefix",
  () => {
    const text = "{name}.controller";
    const props = { name: "user" };
    const resolved = resolve(text, props);
    assertEquals(resolved, "user.controller");
  }
);

Deno.test(
  "should resolve the string on provided a prop and pass the string with {} with two or more props",
  () => {
    const text = "{name}.{role}";
    const props = { name: "user", role: "admin" };
    const resolved = resolve(text, props);
    assertEquals(resolved, "user.admin");
  }
);

Deno.test(
  "should change the case to PascalCase on providing the option for PascalCase",
  () => {
    const text = "{name,p}.{role}";
    const props = { name: "omar-eloui", role: "admin" };
    const resolved = resolve(text, props);
    assertEquals(resolved, "OmarEloui.admin");
  }
);

Deno.test(
  "should change the case to camelCase on providing the option for camelCase case",
  () => {
    const text = "{name,c}.{role,p}";
    const props = { name: "omar-eloui", role: "admin" };
    const resolved = resolve(text, props);
    assertEquals(resolved, "omarEloui.Admin");
  }
);
