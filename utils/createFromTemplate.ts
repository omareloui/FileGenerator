import { renderFileToString, basename, ensureDir, extname } from "../deps.ts";

/**
 * Create a file from an already existing template file.
 *
 * @param {string} options.srcTemplate - Where the template lives.
 * @param {Object} [options.templateData={}] - The data to provide the template.
 * @param {string} [options.distDir=.] - Where to create the file.
 * @param {string} [options.renameTo] - If you want to rename the file different from the src filename (don't include extension).
 * @returns {void}
 */
export async function createFromTemplate({
  srcTemplate,
  templateData = {},
  distDir = ".",
  renameTo,
}: {
  srcTemplate: string;
  templateData?: Record<string, unknown>;
  distDir?: string;
  renameTo?: string;
}) {
  const distFilename = renameTo
    ? `${renameTo}${extname(srcTemplate)}`
    : basename(srcTemplate);
  const dist = `${distDir}/${distFilename}`;
  const resolvedTemplateString = await renderFileToString(
    srcTemplate,
    templateData
  );
  await ensureDir(distDir);
  await Deno.writeFile(dist, new TextEncoder().encode(resolvedTemplateString));
}
