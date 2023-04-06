import {
    authUrl,
    header,
    postRequestInit,
    requestInit,
    v1BaseUrl,
    v2BaseUrl,
} from "./constants"
import {
    AuthErrorResponse,
    AuthResponse,
    V1ApiResponse,
    V2ApiResponse,
} from "./models"

function waitForElement(selector: string): Promise<Element> {
    return new Promise<Element>(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector) as Element)
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector) as Element)
                observer.disconnect()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    })
}

async function Authenticate(invalidate = false) {
    if (localStorage.getItem("Auth") && !invalidate) {
        header.Authorization = localStorage.getItem("Auth") as string
        return
    }
    const response = await fetch(authUrl, postRequestInit)
    if (!response.ok) {
        const { translatedMessage } =
            (await response.json()) as AuthErrorResponse
        throw new Error(translatedMessage ?? "Authentication key error")
    }
    const { token } = (await response.json()) as AuthResponse
    localStorage.setItem("Auth", token)
}

async function getAppInfo(pkgName: string) {
    const infoUrl = `${v2BaseUrl}/${pkgName}/`
    const response = await fetch(infoUrl, requestInit)
    if (!response.ok) {
        if (response.status == 401) {
            await Authenticate(true)
            await getAppInfo(pkgName)
        } else {
            throw new Error("Request failure.")
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return (await response.json()) as V1ApiResponse
}

async function getAppDownloadUrl(version: string, pkgName: string) {
    const v1Url =
        `${v1BaseUrl}/${pkgName}/uri/?` +
        new URLSearchParams({
            action: "start",
            requestedVersion: version,
            fileType: "App",
            lang: "fa",
        }).toString()
    const response = await fetch(v1Url, requestInit)
    const { uriPath, uriServers } = (await response.json()) as V2ApiResponse
    if (!uriPath) {
        throw new Error("No download link.")
    }
    const uriServer = uriServers[Math.floor(Math.random() * uriServers.length)]
    const uri = uriServer + uriPath
    console.log(`APK Download link: ${uri}`)
    return uri
}

waitForElement("a.btn-download")
    .then(getDownloadLink)
    .catch(_ => console.log("Could not find download button."))

async function getDownloadLink(downloadBtn: Element) {
    const btnSpan = document.getElementById("basebtn")
    if (!btnSpan) {
        console.log("Could not find download button text element.")
        return
    }
    try {
        await Authenticate()
        const url = new URL(downloadBtn.getAttribute("href") as string)
        const pkgName: string = url.searchParams.get("packageName") as string
        const info = await getAppInfo(pkgName)
        if (!info.price.isFree) {
            console.log("Paid App!")
            btnSpan.textContent = "برنامه پولی است"
            return
        }
        const uri = await getAppDownloadUrl(info.version.code, pkgName)
        downloadBtn.removeAttribute("onclick")
        downloadBtn.setAttribute("href", uri)
        btnSpan.textContent = `دانلود (${info.size.actual})`
    } catch (e) {
        btnSpan.textContent = "خطا"
        downloadBtn.setAttribute("href", "#")
        console.log(e)
    }
}
