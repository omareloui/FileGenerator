import { join } from "path";

import { parse } from "yaml";

import { FSHelper } from "../lib";
import config from "../config";

import type { ConfigFile } from "../@types/Config";

const { FILE_TYPE, FILENAME, FILE_LOCATION } = config.configFile;

async function getConfigFromYaml() {
  const yamlPath = join(FILE_LOCATION, `${FILENAME}.yaml`);
  const ymlPath = join(FILE_LOCATION, `${FILENAME}.yml`);

  const yaml = await FSHelper.readFile(yamlPath);
  const parsedYaml = parse(yaml || "");

  const yml = await FSHelper.readFile(ymlPath);
  const parsedYml = parse(yml || "");

  return parsedYaml || parsedYml || {};
}

export async function getConfigFromFile() {
  if (FILE_TYPE !== "yaml" && FILE_TYPE !== "yml")
    throw new Error(`Config type ${FILE_TYPE} isn't supported.`);

  const parsedConfig = await getConfigFromYaml();

  return parsedConfig as ConfigFile;
}
