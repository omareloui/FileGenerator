export type ConfigFileExtension = "yaml" | "yml" | "json";

export interface ConfigFile {
  "default-dist"?: string;

  templates?: {
    [templateName: string]: {
      dist: string;
    };
  };
}
