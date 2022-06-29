export type PropValue = string | boolean | number;

export interface TemplateProps {
  [KProp: string]: {
    default?: unknown;
    shouldAsk?: boolean;
    hint?: string;
    type?: "input" | "confirm" | "number" | "password";
    validator?: (v: string) => boolean;
  };
}

export interface TemplateConfig {
  [KTemplate: string]: {
    props?: TemplateProps;
    defaultFilename?: string;
    defaultDist?: string;
  };
}

export interface Template {
  name: string;
  filename: string;
  location: string;
  extension: string;
  props?: TemplateProps;
  defaultFilename?: string;
  defaultDist?: string;
}

export interface RetrievedTemplate extends Omit<Template, "props"> {
  props?: { [KProp: string]: PropValue };
  filename: string;
  dist: string;
}
