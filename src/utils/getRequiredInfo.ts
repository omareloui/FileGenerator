import inquirer from "inquirer";

import { getTemplates } from "./getTemplates";
import { getPropsAnswers } from "./getPropsAnswers";
import { CustomSyntax } from "../lib";

import type { Template, RetrievedTemplate, PropValue } from "../@types";

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

export async function getRequiredInfo(): Promise<RetrievedTemplate> {
  const templates = await getTemplates();

  const template = await askForTemplate(templates);
  const props = await askForTemplateProps(template);

  return {
    ...template,
    props,
    filename: getFilename(template, props),
    dist: template.defaultDist || process.cwd(),
  };
}
