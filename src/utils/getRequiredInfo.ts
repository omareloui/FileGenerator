import inquirer from "inquirer";

import { getTemplates } from "./getTemplates";
import { getPropsAnswers } from "./getPropsAnswers";

import type { RetrievedTemplate } from "../@types";

export async function getRequiredInfo(): Promise<RetrievedTemplate> {
  const templates = await getTemplates();

  const answer = await inquirer.prompt([
    {
      name: "template",
      message: "Select the template",
      type: "list",
      choices: templates.map(t => t.name),
    },
  ]);

  const selectedTemplate = templates.find(t => t.name === answer.template)!;
  const templateProps =
    selectedTemplate?.props && Object.keys(selectedTemplate.props);

  const propsAnswers =
    templateProps && (await getPropsAnswers(selectedTemplate, templateProps));

  return {
    ...selectedTemplate,
    props: propsAnswers,
    filename: selectedTemplate.defaultFilename || selectedTemplate.filename,
    dist: selectedTemplate.defaultDist || process.cwd(),
  };
}
