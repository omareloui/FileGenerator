import config from "config";

export function getTemplateFromSrc(src: string) {
  return src
    .replace(config.TEMPLATES_DIR, "") // Remove the parent dir
    .replace(/\.[^.]+$/, "") // Remove extension
    .replace(/(\\(\\)?|\/)/g, "-") // Replace path separators with -
    .replace(/^-/, "") // Remove the front - left from trimming the parent dir
    .replace(`-${config.DEFAULT_FILENAME}`, "") // Remove the default if it's the current template
    .toLowerCase();
}
