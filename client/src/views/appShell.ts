import { Router } from "@lit-labs/router";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { routes } from "./routes.js";
import "./topMenu.js"

@customElement("app-shell")
export class UsersList extends LitElement {
  static styles = css`
    :host {
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        'header'
        'main'
        'footer';
    }
    header {
      grid-area: header;
      display: flex;
      flex-direction: row;
      padding: var(--wa-space-2xs);
      overflow: hidden;
      background-color: var(--wa-color-surface-lowered);
    }

    main {
      overflow-x: hidden;
      overflow-y: auto;
      grid-area: main;
      padding: 0.5rem;
      display: block;
      height: 100%;
    }
  `

  private _router = new Router(this, routes)

  render() {
    return html`
      <header>
        <top-menu></top-menu>
      </header>
      <main>
        ${this._router.outlet()}
      </main>
    `
  }
}