import { basename, extname, walk } from "../deps.ts";
import {
  getNotExistingFilename,
  createFromTemplate,
  retrieveTemplateProps,
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
    };
  });
  return templates;
}

export function getTemplateProps(templateName: string) {
  return templatesConfig[templateName]?.props;
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
  dist: string,
  rename?: string,
  otherArgs?: Record<string, unknown>
): Promise<void> {
  let counter = 0;
  for (const template of templates) {
    try {
      const props = await retrieveTemplateProps(template, otherArgs);
      await createFromTemplate({
        srcTemplate: template.location,
        distDir: dist,
        renameTo: rename,
        props,
      });
      counter++;
    } catch (e) {
      if (e.message.match("already exists")) {
        const filename = rename
          ? `${rename}${template.extension}`
          : template.filename;
        const _rename = await getNotExistingFilename(filename, dist);
        return generateTemplates(templates, dist, _rename);
      } else {
        logger.info(`Generated ${counter} template(s).`);
        logger.error(e.message);
        Deno.exit(1);
      }
    }
  }
  logger.info(`Generated ${counter} template(s).`);
}
