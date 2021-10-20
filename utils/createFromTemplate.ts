import { renderFileToString } from "../deps.ts";
import { kebabToPascal } from "./index.ts";

export async function createFromTemplate({
  dest,
  props = {},
  templateSrc,
}: {
  dest: string;
  props?: Record<string, unknown>;
  templateSrc: string;
}) {
  const dejsUtils = { kebabToPascal };
  const resolvedTemplateString = await renderFileToString(templateSrc, {
    ...props,
    ...dejsUtils,
  });
  await Deno.writeFile(dest, new TextEncoder().encode(resolvedTemplateString));
}
