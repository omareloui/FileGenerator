import { Ask } from "../deps.ts";

export async function ask(
  question: string,
  options: { default?: string } = {}
) {
  const _ask = new Ask();
  const { value } = await _ask.input({
    message: question,
    name: "value",
    suffix: ":",
    ...options,
  });
  return value || "";
}
