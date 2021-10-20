import type { RouterContext } from "../deps.ts";
import { <%= kebabToPascal(name) %>Service } from "../services/index.ts";

export class <%= kebabToPascal(name) %>Controller {
  public static async create({ request, response, state }: RouterContext) {}
}
