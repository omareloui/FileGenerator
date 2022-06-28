import { join } from "path";
import type { TemplateConfig, TemplateProps } from "../@types";

const CWD = process.cwd();

const REQUIRED_KEBAB: TemplateProps[string] = {
  isRequired: true,
  hint: "in kebab-case",
  validator: (v: string) => !!v.match(/^[a-z][a-z1-9-]+$/),
};

const REQUIRED_KEBAB_NAME: TemplateProps = {
  name: REQUIRED_KEBAB,
};

const LICENSE_OPTIONS: TemplateConfig[string] = {
  props: {
    name: {
      isRequired: true,
    },
    email: {
      isRequired: false,
    },
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
      ...REQUIRED_KEBAB_NAME,
      styles: { default: true, type: "confirm" },
    },
    defaultFilename: "{name}",
  },

  "mongoose-model": {
    props: REQUIRED_KEBAB_NAME,
    defaultFilename: "{name,p}",
    defaultDist: join(CWD, "src", "models"),
  },

  "oak-controller": {
    props: REQUIRED_KEBAB_NAME,
    defaultFilename: "{name}.controller",
  },

  vue: {},

  "license-wtfpl": LICENSE_OPTIONS,
  "license-mit": LICENSE_OPTIONS,
};

export default templatesConfig;
