import { join } from "path";
import fs from "fs/promises";
import ejs from "ejs";

import type { RetrievedTemplate } from "../@types";

export async function generateTemplate(template: RetrievedTemplate) {
  const content = await ejs.renderFile(template.location, template.props);
  await fs.writeFile(join(template.dist, template.filename), content, {
    encoding: "utf-8",
  });
}
