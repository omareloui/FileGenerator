import * as path from "path";

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of Deno.readDir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory) yield* walk(entry);
    else if (d.isFile) yield entry;
  }
}

export class FSHelper {
  static getCurrentFileMeta(currentUrl: string) {
    currentUrl = currentUrl.replace(/^file:\/\//, "");
    const dirName = path.dirname(currentUrl);
    const fileName = path.basename(currentUrl);
    return { fileName, dirName };
  }

  static walk = walk;

  static async ensureDirs(dir: string) {
    await Deno.mkdir(dir, { recursive: true });
  }

  static async readFile(path: string) {
    let content: string | undefined;

    try {
      content = await Deno.readTextFile(path);
    } catch (_e) {
      return;
    }

    return content;
  }
}
