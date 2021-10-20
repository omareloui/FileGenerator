import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "./<%= name %>.scss";

@customElement("<%= name %>")
export class <%= kebabToPascal(name) %> extends LitElement {
  static styles = styles;

  render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "<%= name %>": <%= kebabToPascal(name) %>;
  }
}
