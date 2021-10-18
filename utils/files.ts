import { ensureDir, dirname, resolve, exists, extname } from "../deps.ts";

export function getParentDir(path: string) {
  return dirname(path);
}

export async function ensureParentDir(path: string) {
  const parentDir = getParentDir(path);
  await ensureDir(parentDir);
}

/**
 * Get a filename that doesn't exist by adding a number in brackets.
 *
 * @param {string} currentFilename - Provide the file name **with extension**.
 * @param {string} dist - Where to move the file.
 * @returns {string}
 */
export function getNotExistingFilename(currentFilename: string, dist: string) {
  const ext = extname(currentFilename);
  const filenameWithoutExt = currentFilename.replace(ext, "");
  const fileNameWithNoNumber = filenameWithoutExt.replace(/ \(\d+\)$/, "");
  const number =
    parseInt(filenameWithoutExt.replace(/\((\d+)\)$/, "$1"), 10) || 0;

  const checkNumber = async (current: number): Promise<string> => {
    const fileWithoutExt = `${fileNameWithNoNumber} (${current})`;
    const filename = `${fileWithoutExt}${ext}`;
    const doesExist = await exists(resolve(dist, filename));
    if (!doesExist) return fileWithoutExt;
    return checkNumber(current + 1);
  };

  return checkNumber(number + 1);
}
