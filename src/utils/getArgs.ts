import { ArgumentParser } from "argparse";

import type { Template } from "../@types";

export function getArgs(templates: Template[]) {
  const parser = new ArgumentParser({
    description: "Boilerplate file generator",
  });

  parser.add_argument("-t", "--template", {
    help: "Selected the required template.",
    choices: templates.map(t => t.name),
  });
  parser.add_argument("-d", "--dist", {
    help: "Relative directory to create template.",
  });

  const args = parser.parse_args();

  return {
    template: templates.find(t => t.name === args.template),
    dist: args.dist as string | undefined,
  };
}
