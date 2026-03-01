import { Signal } from "signal-polyfill"
import { User } from "oidc-client-ts"

export interface AuthUser {
    accessToken?: string
    userName?: string
    fullName?: string
    initials?: string
}

export const userState = new Signal.State<AuthUser>({})

export function setAuthUser(oidcUser: User) {
    const authUser: AuthUser = { 
        accessToken: oidcUser.access_token,
        userName: oidcUser.profile.name,
        fullName: oidcUser.profile.fullname as string ?? "",
        initials: "NA"
    }
    authUser.initials = getInitials(authUser.fullName)
    userState.set(authUser)
}

export function setUserLoggedOut() {
    userState.set({})
}

function getInitials(fullName?: string | null) {
    const trimmed = fullName?.trim() ?? ""
    if (!trimmed) return "NA"

    const parts = trimmed.split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "NA"

    const first = parts[0]
    const last = parts.length > 1 ? parts[parts.length - 1] : parts[0]
    const firstInitial = first[0]?.toUpperCase() ?? ""
    const lastInitial = last[0]?.toUpperCase() ?? ""

    const initials = `${firstInitial}${lastInitial}`.trim()
    return initials || "NA"
}