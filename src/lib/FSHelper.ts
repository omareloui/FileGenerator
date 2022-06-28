import { opendir, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of await opendir(dir)) {
    const entry = join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

export class FSHelper {
  static getCurrentFileMeta(currentUrl: string) {
    const fileName = fileURLToPath(currentUrl);
    const dirName = dirname(fileName);
    return { fileName, dirName };
  }

  static walk = walk;

  static async ensureDirs(dir: string) {
    await mkdir(dir, { recursive: true });
  }
}
