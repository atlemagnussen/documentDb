import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { userState } from "@db/client/services/user.js"
import auth from "@db/client/services/authentication.js"
import { effect } from "@db/client/services/effect.js"

@customElement('home-view')
export class HomeView extends LitElement {

  static styles = css`
    :host {
      display: block;
    }
  `
  @state()
  userName?: string

  connectedCallback(): void {
    super.connectedCallback()
    effect(() => {
      const authUser = userState.get()
      this.userName = authUser.userName
    })
  }
  render() {
    if (!this.userName) {
      return html`
        <p>Not logged in</p>
        <button @click=${() => auth.login()}>Log in</button>
      `
    }
    return html`
      <div> Logged in: 
        ${this.userName}
      </div>
      <div>
        <docs-list></docs-list>
      </div>
    `
  }
}