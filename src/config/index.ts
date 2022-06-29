import { join } from "path";
import { FSHelper } from "../lib";

import templates from "./templates";
import * as templateUtils from "./templates-utils";

import type { ConfigFileExtension } from "../@types/Config";

const config = {
  DEFAULT_FILENAME: "base",

  TEMPLATES_DIR: join(
    FSHelper.getCurrentFileMeta(import.meta.url).dirName,
    "..",
    "..",
    "templates",
  ),

  configFile: {
    FILENAME: "file-generator",
    FILE_TYPE: "yaml" as ConfigFileExtension,
    FILE_LOCATION: process.cwd(),
  },

  templates,
  templateUtils,
};

export default config;
