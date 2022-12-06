import * as path from "path";

import config from "config";
import { FSHelper } from "lib";

import { getTemplateFromSrc } from "./get_template_from_src.ts";
import { getTemplateProps } from "./get_template_props.ts";
import { getTemplateDefaultFilename } from "./get_template_default_filename.ts";
import { getTemplateDefaultDest } from "./get_template_default_dest.ts";

import type { Template } from "../types/mod.ts";

export async function getTemplatesSrcs() {
  const templates = [];
  for await (const file of FSHelper.walk(config.TEMPLATES_DIR)) {
    templates.push(file);
  }
  return templates;
}

export async function getTemplates() {
  const templatesSrcs = await getTemplatesSrcs();

  const templates: Template[] = templatesSrcs.map((f) => {
    const name = getTemplateFromSrc(f);

    return {
      location: f,
      filename: path.basename(f),
      name,
      extension: path.extname(f),
      props: getTemplateProps(name),
      defaultFilename: getTemplateDefaultFilename(name),
      defaultDest: getTemplateDefaultDest(name),
    };
  });

  return templates;
}
