import { copyTemplates, retrieveData } from "./utils.ts";

async function main() {
  const { templates, dist } = await retrieveData();
  await copyTemplates(templates, dist);
}

if (import.meta.main) main();
