import { headers } from "./constants"
import {
    getAppDownloadUrl,
    getAppInfo,
    getAuthToken,
    getTokenFromLocalStorage,
    saveTokenToLocalStorage,
    waitForElement,
} from "./utils"

const { fetch: originalFetch } = window
window.fetch = async (...args) => {
    const [resource, config] = args
    const response = await originalFetch(resource, config)
    if (!response.ok && response.status === 401) {
        const token = await getAuthToken()
        saveTokenToLocalStorage(token)
        headers.set("Authorization", token)
        return await originalFetch(resource, config)
    }
    return response
}

waitForElement("a.btn-download")
    .then(replaceDownloadBtnHref)
    .catch(() => console.log("Could not find download button."))

async function replaceDownloadBtnHref(downloadBtn: Element) {
    const btnSpan = document.getElementById("basebtn")
    if (!btnSpan) {
        console.log("Could not find download button text element.")
        return
    }
    try {
        await setHeaderAuth()
        const pkgName = extractPkgName(downloadBtn)
        const info = await getAppInfo(pkgName)
        if (!info.price.isFree) {
            console.log("Paid App!")
            btnSpan.textContent = "برنامه پولی است"
            return
        }
        const uri = await getAppDownloadUrl(info.version.code, pkgName)
        console.log(`APK Download link: ${uri}`)
        downloadBtn.removeAttribute("onclick")
        downloadBtn.setAttribute("href", uri)
        btnSpan.textContent = `دانلود (${info.size.actual})`
    } catch (e) {
        btnSpan.textContent = "خطا"
        downloadBtn.setAttribute("href", "#")
        console.log(e)
    }
}

function extractPkgName(downloadBtn: Element) {
    const url = new URL(downloadBtn.getAttribute("href") as string)
    return url.searchParams.get("packageName") as string
}

async function setHeaderAuth() {
    headers.set("Authorization", getTokenFromLocalStorage())
    if (headers.get("Authorization") == "") {
        const token = await getAuthToken()
        saveTokenToLocalStorage(token)
        headers.set("Authorization", token)
    }
}
