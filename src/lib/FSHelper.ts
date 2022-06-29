import { opendir, mkdir, readFile } from "fs/promises";
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

  static async readFile(path: string) {
    let content: string | undefined;

    try {
      content = await readFile(path, { encoding: "utf-8" });
      // eslint-disable-next-line no-empty
    } catch (err) {}

    return content;
  }
}
