import { Select } from "cliffy/prompt";

import * as path from "path";

import { getTemplates } from "./get_templates.ts";
import { getPropsAnswers } from "./get_props_answers.ts";
import { getArgs } from "./get_args.ts";
import { getConfigFromFile } from "./get_config_from_file.ts";

import { CustomSyntax } from "lib";

import type { PropValue, RetrievedTemplate, Template } from "../types/mod.ts";
import type { ConfigFile } from "config";

async function askForTemplate(templates: Template[]) {
  const template = await Select.prompt(
    {
      message: "Select the template",
      options: templates.map((t) => t.name),
    },
  );
  return templates.find((t) => t.name === template)!;
}

async function askForTemplateProps(template: Template) {
  const templateProps = template?.props && Object.keys(template.props);
  return templateProps && (await getPropsAnswers(template, templateProps));
}

function getFilename(
  template: Template,
  props: Record<string, PropValue> | undefined,
) {
  const { defaultFilename, extension } = template;
  return defaultFilename
    ? `${CustomSyntax.parse(defaultFilename, props)}${extension}`
    : template.filename;
}

function getDestFromArgs(argsDest: string | undefined) {
  return argsDest && path.join(Deno.cwd(), argsDest);
}

function getDestFromConfigFile(
  template: Template,
  configFile: ConfigFile | undefined,
) {
  if (!configFile) return undefined;
  const { templates } = configFile;
  const templateConfig = templates && templates[template.name];
  const templateDest = templateConfig?.dest;
  return templateDest || configFile["default-dest"];
}

function getDest(
  template: Template,
  argsDest: string | undefined,
  configFile: ConfigFile | undefined,
) {
  return (
    getDestFromArgs(argsDest) ||
    getDestFromConfigFile(template, configFile) ||
    template.defaultDest ||
    Deno.cwd()
  );
}

export async function getRequiredInfo(): Promise<RetrievedTemplate> {
  const templates = await getTemplates();

  const args = await getArgs(templates);
  const configFile = await getConfigFromFile();

  const template = args.template || (await askForTemplate(templates));
  const props = await askForTemplateProps(template);

  return {
    ...template,
    props,
    filename: getFilename(template, props),
    dest: getDest(template, args.dest, configFile),
  };
}
