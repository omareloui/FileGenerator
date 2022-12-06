import * as path from "path";
import * as dejs from "dejs";

import { FSHelper } from "lib";
import config from "config";

import type { RetrievedTemplate } from "../types/mod.ts";

export async function generateTemplate(template: RetrievedTemplate) {
  const content = await dejs.renderFileToString(
    template.location,
    {
      ...config.templateUtils,
      ...(template.props || {}),
    },
  );

  await FSHelper.ensureDirs(template.dest);

  await Deno.writeTextFile(
    path.join(template.dest, template.filename),
    content,
  );
}
