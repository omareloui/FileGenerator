import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

<% if (styles) { %>import styles from "./<%= name %>.sass"; <% } %>

@customElement("<%= name %>")
export class <%= CaseConvertor.kebabToPascal(name) %> extends LitElement {
<% if (styles) { %>
  static styles = styles;
<% } %>
  render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "<%= name %>": <%= CaseConvertor.kebabToPascal(name) %>;
  }
}
