import { TemplateConfig, TemplateProps } from "../types.ts";

const LICENCE_PROPS: TemplateProps = {
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
};

const LICENCE_NAME = "LICENCE";

const REQUIRED_KEBAB = {
  isRequired: true,
  hint: "in kebab-case",
};

const REQUIRED_KEBAB_NAME = {
  name: REQUIRED_KEBAB,
};

const templatesConfig: TemplateConfig = {
  lit: { props: { name: REQUIRED_KEBAB }, defaultFilename: "{name}" },
  "mongoose-model": { props: REQUIRED_KEBAB_NAME, defaultFilename: "{name,p}" },
  "oak-controller": {
    props: REQUIRED_KEBAB_NAME,
    defaultFilename: "{name}.controller",
  },
  "licence-wtfpl": { props: LICENCE_PROPS, defaultFilename: LICENCE_NAME },
  "licence-mit": { props: LICENCE_PROPS, defaultFilename: LICENCE_NAME },
};

export default templatesConfig;
