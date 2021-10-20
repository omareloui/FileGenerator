import { basename, extname, walk, ensureDir, exists } from "../deps.ts";
import {
  getNotExistingFilename,
  createFromTemplate,
  retrieveTemplateProps,
  parser,
} from "./index.ts";
import type { Template } from "../types.ts";

import config from "../config/index.ts";
const {
  TEMPLATES_DIR,
  DEFAULT_FILENAME,
  logger,
  templates: templatesConfig,
} = config;

export async function setTemplates() {
  const availableFiles = [];
  for await (const file of walk(TEMPLATES_DIR)) {
    if (!file.isDirectory) availableFiles.push(file.path);
  }
  const templates: Template[] = availableFiles.map((f) => {
    const name = setTemplateName(f);
    return {
      location: f,
      filename: basename(f),
      name: name,
      extension: extname(f),
      props: getTemplateProps(name),
      defaultFilename: getTemplateDefaultFilename(name),
    };
  });
  return templates;
}

export function getTemplateProps(templateName: string) {
  return templatesConfig[templateName]?.props;
}

export function getTemplateDefaultFilename(templateName: string) {
  return templatesConfig[templateName]?.defaultFilename;
}

export function setTemplateName(templateLocation: string) {
  return templateLocation
    .replace(TEMPLATES_DIR, "") // Remove the parent dir
    .replace(/\.[^.]+$/, "") // Remove extension
    .replace(/(\\(\\)?|\/)/g, "-") // Replace path separators with -
    .replace(/^-/, "") // Remove the front - left from trimming the parent dir
    .replace(`-${DEFAULT_FILENAME}`, "") // Remove the default if it's the current template
    .toLowerCase();
}

export function getTemplates(
  templates: Template[],
  templateNames: (string | number)[]
) {
  return templateNames.map((tn) => {
    const template = templates.find((t) => t.name === tn);
    if (!template) {
      logger.error(`\nCouldn't find "${tn}" template.`);
      Deno.exit(1);
    }
    return template;
  });
}

export function validateTemplates(
  templates: Template[],
  templateNames: string[]
) {
  let hasError = false;
  if (templateNames.length === 0) {
    logger.error("You have to enter a template name.");
    hasError = true;
  }
  templateNames.forEach((tn) => {
    if (templates.findIndex((x) => x.name === tn) === -1) {
      logger.error(`\nCouldn't find "${tn}" template.`);
      hasError = true;
    }
  });
  return !hasError;
}
export function normalizeProvidedTemplateNames(templatesNames: string[]) {
  return templatesNames.map((x) => x.trim().toLocaleLowerCase());
}

export async function generateTemplates(
  templates: Template[],
  dest: string,
  rename?: string,
  otherArgs?: Record<string, unknown>,
  retrievedProps?: Record<string, unknown>
): Promise<void> {
  let counter = 0;
  for (const template of templates) {
    const templateSrc = template.location;
    const props =
      retrievedProps || (await retrieveTemplateProps(template, otherArgs));
    if (!rename && template.defaultFilename)
      rename = parser(template.defaultFilename, props);

    let fileDest: string;

    try {
      fileDest = await getFileDest({
        destDir: dest,
        renameTo: rename,
        templateSrc,
      });
    } catch (e) {
      if (e.message.match("already exists")) {
        const filename = rename
          ? `${rename}${template.extension}`
          : template.filename;
        rename = await getNotExistingFilename(filename, dest);
        fileDest = await getFileDest({
          destDir: dest,
          renameTo: rename,
          templateSrc,
        });
      } else throw new Error(e);
    }

    try {
      await createFromTemplate({
        dest: fileDest,
        props,
        templateSrc: template.location,
      });
      counter++;
    } catch (e) {
      logger.info(`Generated ${counter} template(s).`);
      logger.error(e.message);
      Deno.exit(1);
    }
  }
  logger.info(`Generated ${counter} template(s).`);
}

export async function getFileDest({
  templateSrc,
  renameTo,
  destDir,
}: {
  templateSrc: string;
  renameTo?: string;
  destDir: string;
}) {
  const destFilename = renameTo
    ? `${renameTo}${extname(templateSrc)}`
    : basename(templateSrc);
  const dest = `${destDir}/${destFilename}`;
  await ensureDir(destDir);
  const fileAlreadyExists = await exists(dest);
  if (fileAlreadyExists) throw new Error(`File: ${dest} already exists`);
  return dest;
}
