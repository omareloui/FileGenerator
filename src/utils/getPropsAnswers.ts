import inquirer from "inquirer";
import { Template } from "../@types";

export async function getPropAnswer(
  template: Template,
  propName: string,
): Promise<string> {
  const propOptions = template.props![propName];

  if (propOptions.default) return propOptions.default as string;

  const answer = await inquirer.prompt({
    name: "prop",
    message: `Enter value for ${propName}`,
    suffix: propOptions.hint && ` (${propOptions.hint})`,
    validate: propOptions && propOptions.validator,
  });

  return answer.prop;
}

export async function getPropsAnswers(template: Template, props: string[]) {
  const answers = [];

  for (let i = 0; i < props.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const answer = await getPropAnswer(template, props[i]);
    answers.push(answer);
  }

  return Object.fromEntries(answers.map((a, i) => [props[i], a]));
}
