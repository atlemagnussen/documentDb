import { Router } from "@lit-labs/router";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { routes } from "./routes.js";

@customElement("app-shell")
export class UsersList extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `

  private _router = new Router(this, routes)

  render() {
    return html`
      <header>
        <h1>Docs</h1>
      </header>
      <main>
        ${this._router.outlet()}
      </main>
    `
  }
}