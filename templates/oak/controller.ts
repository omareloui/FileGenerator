import type { RouterContext } from "../deps.ts";
import { <%= CaseConvertor.kebabToPascal(name) %>Service } from "../services/index.ts";

export class <%= CaseConvertor.kebabToPascal(name) %>Controller {
  public static async create({ request, response, state }: RouterContext) {}
}
