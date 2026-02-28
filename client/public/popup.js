import { UserManager, settings } from "./authCommon.js"

const mgr = new UserManager(settings)

async function callbackFromPopup() {
    console.log("callbackFromPopup")
    try {
        await mgr.signinPopupCallback()
        console.log("callback-popup: signed in, closing window")
        window.close()
    }
    catch(err) {
        console.error(err)
        const message = err.message
        const main = document.querySelector("main")
        const errorMessage = main?.querySelector("section#error-message")
        const errorHtml = `<div class="error">
            <h2>Error occured while logging in</h2>
            <p class="msg"><i>${message}</i></p>
            
            <p><a href="${window.location.origin}">Try to log in again</a></p>
            </div>`
        if (errorMessage)
            errorMessage.innerHTML = errorHtml
        else {
            document.body.innerHTML = errorHtml
        }
    }
}
callbackFromPopup()