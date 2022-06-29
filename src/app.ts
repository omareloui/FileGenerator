#!/usr/bin/env node --experimental-specifier-resolution=node

import { getRequiredInfo, generateTemplate } from "./utils";

async function main() {
  const template = await getRequiredInfo();
  await generateTemplate(template);
}

main();
