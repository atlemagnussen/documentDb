import { css, html } from "lit"
import { customElement } from "lit/decorators.js"
import auth from "@db/client/services/authentication.js"
import { AuthUserElement } from "../components/AuthUserElement.js"
import "./userLogin.js"

@customElement('top-menu')
export class TopMenu extends AuthUserElement {

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }
    nav {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    h1 {
      margin-block-start: 0.1rem;
      margin-block-end: 0.1rem;
    }
    img {
      width: 3rem;
      height: 3rem;
    }
    figure {
      width: 3rem;
      height: 3rem;
    }
  `
    
  render() {
    return html`
      <nav class="navbar">
        <a class="navbar-brand" href="/">
          <img class="logo" src="/icon.svg" alt="auth logo">
        </a>
      </nav>
      <h1>Docs</h1>
      <user-login></user-login>
    `
  }
}