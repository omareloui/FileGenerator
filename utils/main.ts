import { parse, resolve, basename, extname, walk, Ask } from "../deps.ts";
import type { Template } from "../types.ts";
import { createFromTemplate, getNotExistingFilename } from "./index.ts";

import config from "../config.ts";
const { TEMPLATES_DIR, DEFAULT_FILENAME, logger } = config;

export async function ask(
  question: string,
  options: { default?: string } = {}
) {
  const _ask = new Ask();
  const { value } = await _ask.input({
    message: question,
    name: "value",
    ...options,
  });
  return value || "";
}

export function setDist(enteredDist?: string) {
  const cwd = Deno.cwd();
  return enteredDist ? resolve(cwd, enteredDist) : cwd;
}

export async function setTemplates() {
  const availableFiles = [];
  for await (const file of walk(TEMPLATES_DIR)) {
    if (!file.isDirectory) availableFiles.push(file.path);
  }

  return availableFiles.map((f) => ({
    location: f,
    filename: basename(f),
    name: setTemplateName(f),
    extension: extname(f),
  })) as Template[];
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

export async function generateTemplates(
  templates: Template[],
  dist: string,
  rename?: string
): Promise<void> {
  let counter = 0;

  for (const template of templates) {
    try {
      await createFromTemplate({
        srcTemplate: template.location,
        distDir: dist,
        templateData: {},
        renameTo: rename,
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

export async function promptForTemplates(
  templates: Template[]
): Promise<string[]> {
  logger.info("\nAvailable Templates:");
  templates.forEach((temp) => logger.info(` • ${temp.name}`));
  console.log("");
  const neededTemplateNames = await ask("Enter template(s) name(s).");
  if (!neededTemplateNames) {
    logger.warning("\nYou have to enter a template");
    return promptForTemplates(templates);
  }
  const _neededTemplates = neededTemplateNames
    .split(" ")
    .map((x) => x.trim())
    .filter((x) => x);

  const isValid = await validateTemplates(templates, _neededTemplates);
  if (!isValid) return promptForTemplates(templates);

  return _neededTemplates;
}

export function promptForDist() {
  return ask("Where to create it?", { default: "." });
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

export async function retrieveData() {
  const templates = await setTemplates();

  let templateNames: string[];
  let _dist: string | undefined;

  const { _: clTemplateNames, dist: clDist, d, rename } = parse(Deno.args) as {
    _: (string | number)[];
    dist?: string;
    d?: string;
    rename?: string;
  };

  templateNames = clTemplateNames.map((x) => x.toString());
  if (clTemplateNames.length === 0)
    templateNames = await promptForTemplates(templates);
  templateNames = normalizeProvidedTemplateNames(templateNames);

  _dist = clDist || d;
  if (clTemplateNames.length === 0 && !clDist && !d)
    _dist = await promptForDist();
  _dist = setDist(_dist);

  return {
    dist: _dist,
    rename,
    templateNames,
    templates: getTemplates(templates, templateNames),
  };
}
