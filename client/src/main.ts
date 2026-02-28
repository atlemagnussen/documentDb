import "./css/layout.css"
import "./css/site.css"
import "./css/dialog.css"

import "./views/appShell.js"
import "./views/home.js"
import "./views/documents/index.js"

import auth from "@db/client/services/authentication.js"

import { importThirdParty } from "./thirdparty.js"
importThirdParty()
auth.initialize()