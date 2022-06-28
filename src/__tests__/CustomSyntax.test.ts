import { CustomSyntax } from "../lib";

describe("Custom syntax parser", () => {
  it("should return the string as is if provided a string without {}", () => {
    const text = "some-text";
    const result = CustomSyntax.parse(text);
    expect(result).toBe(text);
  });

  it("should not resolve anything if no props provided", () => {
    const text = "{some-text}";
    const result = CustomSyntax.parse(text);
    expect(result).toBe(text);
  });

  it("should resolve the string on provided a prop and pass the string with {}", () => {
    const text = "{name}";
    const props = { name: "prop-name" };
    const resolved = CustomSyntax.parse(text, props);
    expect(resolved).toBe(props.name);
  });

  it("should resolve the string on provided a prop and pass the string with {} with a suffix", () => {
    const text = "controller.{name}";
    const props = { name: "user" };
    const resolved = CustomSyntax.parse(text, props);
    expect(resolved).toBe("controller.user");
  });

  it("should resolve the string on provided a prop and pass the string with {} with a prefix", () => {
    const text = "{name}.controller";
    const props = { name: "user" };
    const resolved = CustomSyntax.parse(text, props);
    expect(resolved).toBe("user.controller");
  });

  it("should resolve the string on provided a prop and pass the string with {} with two or more props", () => {
    const text = "{name}.{role}";
    const props = { name: "user", role: "admin" };
    const resolved = CustomSyntax.parse(text, props);
    expect(resolved).toBe("user.admin");
  });

  it("should change the case to PascalCase on providing the option for PascalCase", () => {
    const text = "{name,p}.{role}";
    const props = { name: "omar-eloui", role: "admin" };
    const resolved = CustomSyntax.parse(text, props);
    expect(resolved).toBe("OmarEloui.admin");
  });

  it("should change the case to camelCase on providing the option for camelCase case", () => {
    const text = "{name,c}.{role,p}";
    const props = { name: "omar-eloui", role: "admin" };
    const resolved = CustomSyntax.parse(text, props);
    expect(resolved).toBe("omarEloui.Admin");
  });
});
