import { LitElement } from "lit";
import { state } from "lit/decorators.js";
import { effect } from "../services/effect.js";
import { AuthUser, Theme, themeState, userState } from "../services/user.js";

export class AuthUserElement extends LitElement {
    @state()
    user: AuthUser = { }

    @state()
    error?: Error

    @state()
    theme: Theme = "light"
    
    connectedCallback(): void {
      super.connectedCallback()
      effect(() => {
        const authUser = userState.get()
        this.user = authUser

        this.theme = themeState.get()
      })
    }
}