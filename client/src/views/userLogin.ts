import { css, html } from "lit"
import { customElement } from "lit/decorators.js"
import auth from "@db/client/services/authentication.js"
import { AuthUserElement } from "../components/AuthUserElement.js"

@customElement('user-login')
export class UserLogin extends AuthUserElement {

  static styles = css`
    :host {
      display: block;
    }
  `
  onUserSelect(e: any) {
    if (e.detail.item.value === "logout")
      auth.signOut()
  }
  render() {
    if (!this.user.userName) {
      return html`
        <wa-avatar @click=${auth.login}
          label="log in" shape="circle">
        </wa-avatar>
      `
    }
    return html`
      <wa-dropdown @wa-select=${this.onUserSelect}>
        <wa-avatar slot="trigger"
          label="WA" shape="circle" initials="${this.user.initials!}">
        </wa-avatar>

        <wa-dropdown-item value="share">
          <wa-icon slot="icon" name="share"></wa-icon>
          User Profile
        </wa-dropdown-item>

        <wa-dropdown-item value="preferences">
          <wa-icon slot="icon" name="gear"></wa-icon>
          Preferences
        </wa-dropdown-item>

        <wa-divider></wa-divider>

        <h3>Danger zone</h3>

        <wa-dropdown-item value="logout" variant="danger">
          <wa-icon slot="icon" name="trash"></wa-icon>
          Log out
        </wa-dropdown-item>
      </wa-dropdown>
    `
  }
}