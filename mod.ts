#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --unstable

import { generateTemplate, getRequiredInfo } from "utils";

async function main() {
  const template = await getRequiredInfo();
  await generateTemplate(template);
}

main();
