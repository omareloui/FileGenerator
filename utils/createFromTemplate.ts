import { renderFileToString } from "../deps.ts";
import * as templatesUtils from "../config/templates-utils.ts";

export async function createFromTemplate({
  dest,
  props = {},
  templateSrc,
}: {
  dest: string;
  props?: Record<string, unknown>;
  templateSrc: string;
}) {
  const resolvedTemplateString = await renderFileToString(templateSrc, {
    ...props,
    ...templatesUtils,
  });
  await Deno.writeFile(dest, new TextEncoder().encode(resolvedTemplateString));
}
