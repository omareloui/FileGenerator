import { join } from "path";
import inquirer from "inquirer";

import { getTemplates } from "./getTemplates";
import { getPropsAnswers } from "./getPropsAnswers";
import { getArgs } from "./getArgs";
import { getConfigFromFile } from "./getConfigFromFile";

import { CustomSyntax } from "../lib";

import type { Template, RetrievedTemplate, PropValue } from "../@types";
import { ConfigFile } from "../@types/Config";

async function askForTemplate(templates: Template[]) {
  const answer = await inquirer.prompt([
    {
      name: "template",
      message: "Select the template",
      type: "list",
      choices: templates.map(t => t.name),
    },
  ]);
  return templates.find(t => t.name === answer.template)!;
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

function getDistFromArgs(argsDist: string | undefined) {
  return argsDist && join(process.cwd(), argsDist);
}

function getDistFromConfigFile(
  template: Template,
  configFile: ConfigFile | undefined,
) {
  if (!configFile) return undefined;
  const { templates } = configFile;
  const templateConfig = templates && templates[template.name];
  const templateDist = templateConfig?.dist;
  return templateDist || configFile["default-dist"];
}

function getDist(
  template: Template,
  argsDist: string | undefined,
  configFile: ConfigFile | undefined,
) {
  return (
    getDistFromArgs(argsDist) ||
    getDistFromConfigFile(template, configFile) ||
    template.defaultDist ||
    process.cwd()
  );
}

export async function getRequiredInfo(): Promise<RetrievedTemplate> {
  const templates = await getTemplates();

  const args = getArgs(templates);
  const configFile = await getConfigFromFile();

  const template = args.template || (await askForTemplate(templates));
  const props = await askForTemplateProps(template);

  return {
    ...template,
    props,
    filename: getFilename(template, props),
    dist: getDist(template, args.dist, configFile),
  };
}
