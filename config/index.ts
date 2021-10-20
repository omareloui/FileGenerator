import "./logger.ts";
import { resolve, dirname, fromFileUrl, log } from "../deps.ts";
import templates from "./templates.ts";

const __dir = dirname(fromFileUrl(import.meta.url));

const config = {
  TEMPLATES_DIR: resolve(__dir, "../_templates"),
  DEFAULT_FILENAME: "base",
  logger: log.getLogger(),
  templates,
};

export default config;
