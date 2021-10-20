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

/*
TODO: move to readme

default filename syntax:
  - A string without {} will be resolved literally.
  - On adding {somePropertyKey} it'll resolve to that property value.
  - To change the property's case, pass as a second argument inside the {}
    one of these values (assuming that the provided value was in kebab-case):
    - p for PascalCase
    - c for camelCase

    or pass nothing to leave it as is.
*/

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
