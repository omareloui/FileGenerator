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

const REQUIRED_KEBAB = {
  isRequired: true,
  hint: "in kebab-case",
};

const templatesConfig: TemplateConfig = {
  lit: { props: { name: REQUIRED_KEBAB } },
  "mongoose-model": { props: { name: REQUIRED_KEBAB } },
  "licence-wtfpl": { props: LICENCE_PROPS },
  "licence-mit": { props: LICENCE_PROPS },
};

export default templatesConfig;
