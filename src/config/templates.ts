import { join } from "path";
import type { TemplateConfig, TemplateProps } from "../@types";

const CWD = process.cwd();

const KEBAB: TemplateProps[string] = {
  hint: "in kebab-case",
  validator: (v: string) => !!v.match(/^[a-z][a-z1-9-]+$/),
};

const KEBAB_NAME: TemplateProps = {
  name: KEBAB,
};

const LICENSE_OPTIONS: TemplateConfig[string] = {
  props: {
    name: {},
    email: {},
    date: {
      default: new Date().getFullYear(),
      shouldAsk: false,
    },
  },
  defaultFilename: "LICENSE",
};

const templatesConfig: TemplateConfig = {
  lit: {
    props: {
      ...KEBAB_NAME,
      styles: { default: true, type: "confirm" },
    },
    defaultFilename: "{name}",
  },

  "mongoose-model": {
    props: KEBAB_NAME,
    defaultFilename: "{name,p}",
    defaultDist: join(CWD, "src", "models"),
  },

  "oak-controller": {
    props: KEBAB_NAME,
    defaultFilename: "{name}.controller",
  },

  vue: {},

  readme: {
    props: { title: {} },
    defaultFilename: "README",
    defaultDist: CWD,
  },

  "license-wtfpl": LICENSE_OPTIONS,
  "license-mit": LICENSE_OPTIONS,
};

export default templatesConfig;
