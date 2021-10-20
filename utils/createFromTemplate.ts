import { renderFileToString } from "../deps.ts";
import { kebabToPascal } from "./index.ts";

export async function createFromTemplate({
  dist,
  props = {},
  templateSrc,
}: {
  dist: string;
  props?: Record<string, unknown>;
  templateSrc: string;
}) {
  const dejsUtils = { kebabToPascal };
  const resolvedTemplateString = await renderFileToString(templateSrc, {
    ...props,
    ...dejsUtils,
  });
  await Deno.writeFile(dist, new TextEncoder().encode(resolvedTemplateString));
}
