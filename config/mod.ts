import * as path from "path";

import { FSHelper } from "lib";

import templates from "./templates.ts";
import * as templateUtils from "./templates_utils.ts";

export type ConfigFileExtension = "yaml" | "yml" | "json" | "jsonc";
export interface ConfigFile {
  "default-dest"?: string;

  templates?: {
    [templateName: string]: {
      dest: string;
    };
  };
}

const config = {
  DEFAULT_FILENAME: "base",

  TEMPLATES_DIR: path.join(
    FSHelper.getCurrentFileMeta(import.meta.url).dirName,
    "..",
    "templates",
  ),

  configFile: {
    FILENAME: "file-generator",
    FILE_TYPE: "yaml" as ConfigFileExtension,
    FILE_LOCATION: Deno.cwd(),
  },

  templates,
  templateUtils,
};

export default config;
