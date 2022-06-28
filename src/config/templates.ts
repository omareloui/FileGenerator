import type { TemplateConfig } from "../@types";

const CWD = process.cwd();

const REQUIRED_KEBAB = {
  isRequired: true,
  hint: "in kebab-case",
  validator: (v: string) => !!v.match(/^[a-z][a-z1-9-]+$/),
};

const REQUIRED_KEBAB_NAME = {
  name: REQUIRED_KEBAB,
};

const LICENSE_OPTIONS = {
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
  defaultDist: CWD,
};

const templatesConfig: TemplateConfig = {
  // lit: {
  //   props: {
  //     ...REQUIRED_KEBAB_NAME,
  //     styles: { default: true, type: "boolean" },
  //   },
  //   defaultFilename: "{name}",
  // },
  // "mongoose-model": { props: REQUIRED_KEBAB_NAME, defaultFilename: "{name,p}" },
  // "oak-controller": {
  //   props: REQUIRED_KEBAB_NAME,
  //   defaultFilename: "{name}.controller",
  // },

  "license-wtfpl": LICENSE_OPTIONS,
  "license-mit": LICENSE_OPTIONS,
};

export default templatesConfig;
