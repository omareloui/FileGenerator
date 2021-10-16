import { resolve, dirname, fromFileUrl } from "./deps.ts";

const __dir = dirname(fromFileUrl(import.meta.url));

const config = {
  TEMPLATES_DIR: resolve(__dir, "templates"),
  DEFAULT_FILENAME: "base",
};

export default config;
