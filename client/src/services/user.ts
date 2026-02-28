import { Signal } from "signal-polyfill"
import { User } from "oidc-client-ts"

export interface AuthUser {
    accessToken?: string
    userName?: string
}

export const userState = new Signal.State<AuthUser>({})

export function setAuthUser(oidcUser: User) {
    const authUser: AuthUser = { accessToken: oidcUser.access_token, userName: oidcUser.profile.name }
    userState.set(authUser)
}

export function setUserLoggedOut() {
    userState.set({})
}