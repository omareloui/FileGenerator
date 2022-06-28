export interface TemplateProps {
  [KProp: string]: {
    default?: unknown;
    isRequired?: boolean;
    shouldAsk?: boolean;
    hint?: string;
    type?: string;
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
  props?: { [KProp: string]: string };
  filename: string;
  dist: string;
}
