import config from "../config";

export function getTemplateDefaultFilename(templateName: string) {
  return config.templates[templateName]?.defaultFilename;
}
