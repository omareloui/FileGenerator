import { generateTemplates, retrieveData } from "./utils/index.ts";

async function main() {
  const { templates, dist, rename, otherArgs } = await retrieveData();
  await generateTemplates(templates, dist, rename, otherArgs);
}

if (import.meta.main) main();
