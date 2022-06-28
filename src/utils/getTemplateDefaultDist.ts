import config from "../config";

export function getTemplateDefaultDist(templateName: string) {
  return config.templates[templateName]?.defaultDist;
}
