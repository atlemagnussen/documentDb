import { UserManager, settings } from "./authCommon"

const mgr = new UserManager(settings)
mgr.signinSilentCallback()