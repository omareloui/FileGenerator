import { generateTemplates, retrieveData } from "./utils/index.ts";

async function main() {
  const { templates, dest, rename, otherArgs } = await retrieveData();
  await generateTemplates(templates, dest, rename, otherArgs);
}

if (import.meta.main) main();
