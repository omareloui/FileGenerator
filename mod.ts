import { generateTemplates, retrieveData } from "./utils/index.ts";

async function main() {
  const { templates, dist, rename } = await retrieveData();
  await generateTemplates(templates, dist, rename);
}

if (import.meta.main) main();
