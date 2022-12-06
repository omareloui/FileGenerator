import { Confirm, Input, Number, Secret } from "cliffy/prompt";
import type { PropValue, Template } from "types";

export async function getPropAnswer<T extends PropValue>(
  template: Template,
  propName: string,
): Promise<T> {
  const propOptions = template.props![propName];

  if (propOptions && propOptions.shouldAsk === false) {
    return propOptions.default as T;
  }

  let questionType:
    | typeof Confirm
    | typeof Number
    | typeof Input
    | typeof Secret;

  switch (propOptions?.type) {
    case "password":
      questionType = Secret;
      break;
    case "number":
      questionType = Number;
      break;
    case "confirm":
      questionType = Confirm;
      break;
    default:
      questionType = Input;
      break;
  }

  const answer = await questionType.prompt({
    message: propOptions?.type === "confirm"
      ? `Add ${propName}`
      : `Enter value for ${propName}`,
    hint: propOptions.hint && ` (${propOptions.hint})`,
    validate: propOptions?.validator,
  });

  return answer as T;
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
