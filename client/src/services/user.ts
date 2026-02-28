import { signal } from '@lit-labs/signals';
import { User } from 'oidc-client-ts';

export interface AuthUser {
    accessToken?: string
    userName?: string
}

const userState = signal<AuthUser>({})

export function setAuthUser(oidcUser: User) {
    const authUser: AuthUser = { accessToken: oidcUser.access_token, userName: oidcUser.profile.name }
    userState.set(authUser)
}

export function setUserLoggedOut() {
    userState.set({})
}