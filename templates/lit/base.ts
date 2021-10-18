import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "./base-element.scss";

@customElement("base-element")
export class BaseElement extends LitElement {
  static styles = styles;

  render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "base-element": BaseElement;
  }
}
