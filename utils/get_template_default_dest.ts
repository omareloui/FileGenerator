import config from "config";

export function getTemplateDefaultDest(templateName: string) {
  return config.templates[templateName]?.defaultDest;
}
