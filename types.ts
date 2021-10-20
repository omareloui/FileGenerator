export interface TemplateProps {
  [prop: string]: {
    default?: unknown;
    isRequired?: boolean;
    shouldAsk?: boolean;
    hint?: string;
  };
}
export interface TemplateConfig {
  [template: string]: {
    props?: TemplateProps;
    defaultFilename?: string;
  };
}

export interface Template {
  name: string;
  filename: string;
  location: string;
  extension: string;
  props?: TemplateProps;
  defaultFilename?: string;
}
