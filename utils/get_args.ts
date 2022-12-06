import { Command } from "cliffy/command";

import type { Template } from "types";

export async function getArgs(templates: Template[]) {
  const { args, options } = await new Command()
    .name("gf")
    .description("Boilerplate file generator")
    .version("1.0.0")
    .arguments("[template:string]")
    .option(
      "-d, --dest [string]",
      "Relative directory to create template.",
    )
    .parse(Deno.args);

  return {
    template: templates.find((t) => t.name === args[0]),
    dest: typeof options.dest === "string" ? options.dest : undefined,
  };
}
