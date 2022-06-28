import { join } from "path";
import { FSHelper } from "../lib";

import templates from "./templates";

const config = {
  DEFAULT_FILENAME: "base",

  TEMPLATES_DIR: join(
    FSHelper.getCurrentFileMeta(import.meta.url).dirName,
    "..",
    "..",
    "templates",
  ),

  templates,
};

export default config;
