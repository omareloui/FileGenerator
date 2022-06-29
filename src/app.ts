#!/usr/bin/env node

import { getRequiredInfo, generateTemplate } from "./utils";

async function main() {
  const template = await getRequiredInfo();
  await generateTemplate(template);
}

main();
