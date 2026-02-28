import { css, html } from "lit"
import { customElement } from "lit/decorators.js"
import auth from "@db/client/services/authentication.js"
import { AuthUserElement } from "../components/AuthUserElement.js"

@customElement('home-view')
export class HomeView extends AuthUserElement {

  static styles = css`
    :host {
      display: block;
    }
  `

  render() {
    if (!this.user.userName) {
      return html`
        <p>Not logged in</p>
        <button @click=${() => auth.login()}>Log in</button>
      `
    }
    return html`
      <div> Logged in: 
        ${this.user.userName}
      </div>
      <div>
        AccessToken: ${this.user.accessToken}
      </div>
      <div>
        <a href="/documents">Documents</a>
      </div>
    `
  }
}