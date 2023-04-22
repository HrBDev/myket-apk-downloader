import { header } from "./constants"
import {
    getAppDownloadUrl,
    getAppInfo,
    getAuthToken,
    getTokenFromLocalStorage,
    saveTokenToLocalStorage,
    waitForElement,
} from "./utils"

waitForElement("a.btn-download")
    .then(replaceDownloadBtnHref)
    .catch(_ => console.log("Could not find download button."))

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
    header.Authorization = getTokenFromLocalStorage()
    if (header.Authorization == "") {
        const token = await getAuthToken()
        saveTokenToLocalStorage(token)
        header.Authorization = token
    }
}
