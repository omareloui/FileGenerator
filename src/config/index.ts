import { join } from "path";
import { FSHelper } from "../lib";

import templates from "./templates";
import * as templateUtils from "./templates-utils";

const config = {
  DEFAULT_FILENAME: "base",

  TEMPLATES_DIR: join(
    FSHelper.getCurrentFileMeta(import.meta.url).dirName,
    "..",
    "..",
    "templates",
  ),

  templates,
  templateUtils,
};

export default config;
