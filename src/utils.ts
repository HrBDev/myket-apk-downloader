import {
    authUrl,
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

const TOKEN_KEY = "AUTH"

function getTokenFromLocalStorage(): string {
    return localStorage.getItem(TOKEN_KEY) ?? ""
}

function saveTokenToLocalStorage(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

function waitForElement(selector: string): Promise<Element> {
    return new Promise<Element>(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector) as Element)
        }

        const observer = new MutationObserver(() => {
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

async function getAuthToken() {
    const response = await fetch(authUrl, postRequestInit)
    if (!response.ok) {
        const { translatedMessage } =
            (await response.json()) as AuthErrorResponse
        throw new Error(translatedMessage ?? "Authentication key error")
    }
    const { token } = (await response.json()) as AuthResponse
    return token
}

async function getAppInfo(pkgName: string) {
    const infoUrl = `${v2BaseUrl}/${pkgName}/`
    const response = await fetch(infoUrl, requestInit)
    if (!response.ok) {
        if (response.status == 401) {
            const token = await getAuthToken()
            saveTokenToLocalStorage(token)
            await getAppInfo(pkgName)
        } else {
            throw new Error("Request failure.")
        }
    }
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
    return uriServer + uriPath
}

export {
    getTokenFromLocalStorage,
    saveTokenToLocalStorage,
    waitForElement,
    getAuthToken,
    getAppInfo,
    getAppDownloadUrl,
}
