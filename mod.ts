import { copyTemplates, retrieveData } from "./utils.ts";

async function main() {
  const { templates, dist, rename } = await retrieveData();
  await copyTemplates(templates, dist, rename);
}

if (import.meta.main) main();
