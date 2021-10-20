import { parse, resolve } from "../deps.ts";
import {
  normalizeProvidedTemplateNames,
  setTemplates,
  getTemplates,
  validateTemplates,
  ask,
} from "./index.ts";
import type { Template, TemplateProps } from "../types.ts";

import config from "../config/index.ts";
const { logger } = config;

export function setDest(enteredDest?: string) {
  const cwd = Deno.cwd();
  return enteredDest ? resolve(cwd, enteredDest) : cwd;
}

export async function askForTemplates(
  templates: Template[]
): Promise<string[]> {
  logger.info("\nAvailable Templates:");
  templates.forEach((temp) => logger.info(` • ${temp.name}`));
  console.log("");
  const neededTemplateNames = await ask("Enter template(s) name(s).");
  if (!neededTemplateNames) {
    logger.warning("\nYou have to enter a template");
    return askForTemplates(templates);
  }
  const _neededTemplates = neededTemplateNames
    .split(" ")
    .map((x) => x.trim())
    .filter((x) => x);
  const isValid = await validateTemplates(templates, _neededTemplates);
  if (!isValid) return askForTemplates(templates);
  return _neededTemplates;
}

export function askForDest() {
  return ask("Where to create it?", { default: "." });
}

export async function askForTemplateProps(
  template: Template,
  propsToCollect: TemplateProps[]
) {
  const props: Record<string, unknown> = {};

  for (const [index, _prop] of propsToCollect.entries()) {
    const propName = Object.keys(_prop)[0] as string;
    const propInfo = _prop[propName];
    let message = `"${template.name}": Enter a value for "${propName}"`;
    if (propInfo.hint) message += ` (${propInfo.hint})`;
    props[propName] = await ask(message, {
      default: propsToCollect[index].default as string,
    });
  }

  return props;
}

export async function retrieveTemplateProps(
  template: Template,
  otherArgs: Record<string, unknown> = {}
): Promise<Record<string, unknown>> {
  const templateProps = template.props;
  const propsKeys = Object.keys(templateProps || {});

  let props = {};

  if (!templateProps || propsKeys.length === 0) return props;

  const setDefaults = (acc: Record<string, unknown>, propName: string) => {
    const { default: defaultValue } = templateProps[propName];
    if (defaultValue) acc[propName] = defaultValue;
    else acc[propName] = undefined;
    return acc;
  };
  props = propsKeys.reduce(setDefaults, {});

  const templateKeysToCollect = propsKeys.filter(
    (prop) => templateProps[prop].shouldAsk !== false
  );

  const setPropsFromArgs = (acc: Record<string, unknown>, propName: string) => {
    const argsResult = otherArgs[propName];
    if (argsResult) acc[propName] = argsResult;
    return acc;
  };
  const propsFromArgs = templateKeysToCollect.reduce(setPropsFromArgs, {});
  props = { ...props, ...propsFromArgs };

  const collectedKeys = Object.keys(propsFromArgs);
  const remainingKeysToCollect = templateKeysToCollect.filter(
    (x) => !collectedKeys.includes(x)
  );
  const remainingRequiredKeysToCollect = remainingKeysToCollect.filter(
    (x) => templateProps[x].isRequired
  );

  if (remainingRequiredKeysToCollect.length === 0) return props;

  const propsFromPrompt = await askForTemplateProps(
    template,
    remainingKeysToCollect.map((tempK) => ({ [tempK]: templateProps[tempK] }))
  );
  props = { ...props, ...propsFromPrompt };
  return props;
}

export async function retrieveData() {
  const templates = await setTemplates();

  let templateNames: string[];
  let dest: string | undefined;

  const { _: clTemplateNames, dest: clDest, d, rename, ...otherArgs } = parse(
    Deno.args
  ) as {
    _: (string | number)[];
    dest?: string;
    d?: string;
    rename?: string;
    [key: string]: unknown;
  };

  templateNames = clTemplateNames.map((x) => x.toString());
  if (clTemplateNames.length === 0)
    templateNames = await askForTemplates(templates);
  templateNames = normalizeProvidedTemplateNames(templateNames);

  dest = clDest || d;
  if (clTemplateNames.length === 0 && !clDest && !d) dest = await askForDest();
  dest = setDest(dest);

  return {
    dest,
    rename,
    templateNames,
    templates: getTemplates(templates, templateNames),
    otherArgs,
  };
}
