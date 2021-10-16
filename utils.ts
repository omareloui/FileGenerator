import {
  parse,
  resolve,
  basename,
  extname,
  copy,
  walk,
  readLines,
  log,
  ensureDir,
  exists,
} from "./deps.ts";
import type { Template } from "./types.ts";

import config from "./config.ts";
const { TEMPLATES_DIR, DEFAULT_FILENAME } = config;

export async function ask(question: string) {
  log.info(question);
  const { value } = await readLines(Deno.stdin).next();
  return value as string;
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

export function checkIfTemplatesExists(
  templates: Template[],
  templateNames: string[]
) {
  return templateNames.every((tn) =>
    templates.find((temp) => temp.name === tn)
  );
}

export function getTemplates(
  templates: Template[],
  templateNames: (string | number)[]
) {
  return templateNames.map((tn) => {
    const template = templates.find((t) => t.name === tn);
    if (!template) {
      log.error(`Couldn't find "${tn}" template.`);
      Deno.exit(1);
    }

    return template;
  });
}

export async function copyTemplates(
  templates: Template[],
  dist: string,
  rename?: string
) {
  const distDir = resolve(dist);
  await ensureDir(distDir);

  let copiedCounter = 0;

  for (const template of templates) {
    const _dist = resolve(
      distDir,
      rename ? `${rename}${template.extension}` : template.filename
    );

    try {
      await copy(template.location, _dist);
      copiedCounter++;
    } catch (e) {
      if (e.message.match("already exists")) {
        const currentFilename =
          rename || template.filename.replace(extname(template.filename), "");
        const fileNameWithNoNumber = currentFilename.replace(/ \(\d+\)$/, "");
        const number =
          parseInt(currentFilename.replace(/\((\d+)\)$/, "$1"), 10) || 0;

        // const _rename = `${fileNameWithNoNumber} (${number + 1})`;

        const getNotExistingFilename = async (
          current: number
        ): Promise<string> => {
          const fileWithoutExt = `${fileNameWithNoNumber} (${current})`;
          const filename = `${fileWithoutExt}${template.extension}`;
          const doesExist = await exists(resolve(distDir, filename));
          if (!doesExist) return fileWithoutExt;
          return getNotExistingFilename(current + 1);
        };

        const _rename = await getNotExistingFilename(number + 1);

        await copyTemplates(templates, dist, _rename);
      } else {
        log.info(`Copied ${copiedCounter} template(s).`);
        log.error(e.message);
        Deno.exit(1);
      }
    }
  }

  log.info(`Copied ${copiedCounter} template(s).`);
}

export async function promptForTemplates(templates: Template[]) {
  console.log("\nAvailable Templates:");
  templates.forEach((temp) => console.log(temp.name));
  console.log("");
  const neededTemplateNames = await ask("Enter template(s) name(s).");
  return neededTemplateNames
    .split(" ")
    .map((x) => x.trim())
    .filter((x) => x);
}

export function promptForDist() {
  return ask("Where to copy it (leave empty for current directory)?");
}

export function validateTemplates(
  templates: Template[],
  templateNames: string[]
) {
  if (templateNames.length === 0) {
    log.error("You have to enter a template name.");
    Deno.exit(1);
  }
  if (!checkIfTemplatesExists(templates, templateNames)) {
    log.error(`Couldn't find some or all of the provided template(s).`);
    Deno.exit(1);
  }
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

  // == Setting up the needed templates == //
  templateNames = clTemplateNames.map((x) => x.toString());
  if (clTemplateNames.length === 0)
    templateNames = await promptForTemplates(templates);

  templateNames = normalizeProvidedTemplateNames(templateNames);
  validateTemplates(templates, templateNames);

  // == Setting up the dist == //
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
