import * as path from "path";
import * as jsonc from "jsonc";
import * as yaml from "yaml";

import { FSHelper } from "lib";
import config from "config";

import type { ConfigFile, ConfigFileExtension } from "config";

const { FILE_TYPE, FILENAME, FILE_LOCATION } = config.configFile;

type Parser =
  | typeof jsonc.parse
  | typeof yaml.parse;

function readFiles(paths: string[]) {
  return Promise.all(paths.map(FSHelper.readFile));
}

function parseFiles(
  contents: (string | undefined)[],
  parser: Parser,
) {
  return contents.map((c) => parser(c || "")).find((c) => c) as
    | ConfigFile
    | undefined;
}

export async function getConfigFromFile() {
  const extensions: ConfigFileExtension[] = ["json", "jsonc", "yaml", "yml"];

  if (!extensions.includes(FILE_TYPE)) {
    throw new Error(`Config type ${FILE_TYPE} isn't supported.`);
  }

  const paths = extensions.map((ext) =>
    path.join(FILE_LOCATION, `${FILENAME}.${ext}`)
  );

  const contents = await readFiles(paths);

  const parser: Parser = ["json", "jsonc"].includes(FILE_TYPE)
    ? jsonc.parse
    : yaml.parse;

  return parseFiles(contents, parser);
}
