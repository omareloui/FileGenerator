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

const templatesConfig: TemplateConfig[] = [
  { template: "licence-wtfpl", props: LICENCE_PROPS },
  { template: "licence-mit", props: LICENCE_PROPS },
  { template: "mongoose-model", props: { name: REQUIRED_KEBAB } },
  { template: "lit", props: { name: REQUIRED_KEBAB } },
];

export default templatesConfig;
