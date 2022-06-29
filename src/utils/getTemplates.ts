import { basename, extname } from "path";

import config from "../config";
import { FSHelper } from "../lib";

import { getTemplateFromSrc } from "./getTemplateFromSrc";
import { getTemplateProps } from "./getTemplateProps";
import { getTemplateDefaultFilename } from "./getTemplateDefaultFilename";
import { getTemplateDefaultDist } from "./getTemplateDefaultDist";

import type { Template } from "../@types";

export async function getTemplatesSrcs() {
  const templates = [];
  for await (const file of FSHelper.walk(config.TEMPLATES_DIR))
    templates.push(file);
  return templates;
}

export async function getTemplates() {
  const templatesSrcs = await getTemplatesSrcs();

  const templates: Template[] = templatesSrcs.map(f => {
    const name = getTemplateFromSrc(f);

    return {
      location: f,
      filename: basename(f),
      name,
      extension: extname(f),
      props: getTemplateProps(name),
      defaultFilename: getTemplateDefaultFilename(name),
      defaultDist: getTemplateDefaultDist(name),
    };
  });

  return templates;
}
