import inquirer from "inquirer";
import type { Template, PropValue } from "../@types";

export async function getPropAnswer<T extends PropValue>(
  template: Template,
  propName: string,
): Promise<T> {
  const propOptions = template.props![propName];

  if (propOptions && propOptions.shouldAsk === false)
    return propOptions.default as T;

  const answer = await inquirer.prompt({
    name: "prop",
    message:
      propOptions?.type === "confirm"
        ? `Add ${propName}`
        : `Enter value for ${propName}`,
    suffix: propOptions.hint && ` (${propOptions.hint})`,
    validate: propOptions?.validator,
    type: propOptions?.type,
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
