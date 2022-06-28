import { writeFile } from "fs/promises";
import { join } from "path";

import ejs from "ejs";

import { FSHelper } from "../lib";
import config from "../config";
import type { RetrievedTemplate } from "../@types";

export async function generateTemplate(template: RetrievedTemplate) {
  const content = await ejs.renderFile(template.location, {
    ...config.templateUtils,
    ...(template.props || {}),
  });
  await FSHelper.ensureDirs(template.dist);
  await writeFile(join(template.dist, template.filename), content, {
    encoding: "utf-8",
  });
}
