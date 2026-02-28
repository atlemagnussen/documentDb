import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"

@customElement("home-view")
export class HomeView extends LitElement {

  static styles = css`
    :host {
      display: block;
    }
  `

  render() {
    return html`
      <div>
        <p>Home</p>
      </div>
      <div>
        <docs-list></docs-list>
      </div>
    `
  }
}