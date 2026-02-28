import { LitElement } from "lit";
import { state } from "lit/decorators.js";
import { effect } from "../services/effect.js";
import { AuthUser, userState } from "../services/user.js";

export class AuthUserElement extends LitElement {
    @state()
    user: AuthUser = { }

    connectedCallback(): void {
        super.connectedCallback()
        effect(() => {
          const authUser = userState.get()
          this.user = authUser
        })
      }
}