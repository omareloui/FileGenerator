export type ConfigFileExtension = "yaml" | "yml" | "json" | "jsonc";

export interface ConfigFile {
  "default-dist"?: string;

  templates?: {
    [templateName: string]: {
      dist: string;
    };
  };
}
