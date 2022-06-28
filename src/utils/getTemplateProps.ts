import config from "../config";

export function getTemplateProps(templateName: string) {
  return config.templates[templateName]?.props;
}
