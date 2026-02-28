import { Router } from "@lit-labs/router";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { routes } from "./routes.js";

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
      background-color: var(--wa-color-surface-raised);
      nav {
        width: 100%;
        display: flex;
        justify-content: space-around;
        flex-direction: row;
      }
      img {
        width: 3rem;
        height: 3rem;
      }
      figure {
        width: 3rem;
        height: 3rem;
      }
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
        <nav class="navbar">
          <a class="navbar-brand" href="/">
              <img class="logo" src="/icon.svg" alt="auth logo">
          </a>
        </nav>
        <h1>Docs</h1>
      </header>
      <main>
        ${this._router.outlet()}
      </main>
    `
  }
}