import { join } from "path";

import { parse as yamlParser } from "yaml";
import { jsonc } from "jsonc";

import { FSHelper } from "../lib";
import config from "../config";

import type { ConfigFile, ConfigFileExtension } from "../@types/Config";

const { FILE_TYPE, FILENAME, FILE_LOCATION } = config.configFile;

function readFiles(paths: string[]) {
  return Promise.all(paths.map(FSHelper.readFile));
}

function parseFiles(
  contents: (string | undefined)[],
  parser: (content: string) => unknown,
) {
  return contents.map(c => parser(c || "")).find(c => c) as
    | ConfigFile
    | undefined;
}

export async function getConfigFromFile() {
  const extensions: ConfigFileExtension[] = ["json", "jsonc", "yaml", "yml"];

  if (!extensions.includes(FILE_TYPE))
    throw new Error(`Config type ${FILE_TYPE} isn't supported.`);

  const paths = extensions.map(ext =>
    join(FILE_LOCATION, `${FILENAME}.${ext}`),
  );

  const contents = await readFiles(paths);

  const parser = ["json", "jsonc"].includes(FILE_TYPE)
    ? jsonc.parse
    : yamlParser;

  return parseFiles(contents, parser);
}
