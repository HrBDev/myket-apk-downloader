import { authBody, authUrl, header, v1BaseUrl, v2BaseUrl } from "./constants"

function waitForElement(selector: string): Promise<Element> {
    return new Promise<Element>(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector)!)
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector)!)
                observer.disconnect()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    })
}

async function getAuth() {
    if (localStorage.getItem("Auth")) {
        header.Authorization = localStorage.getItem("Auth")!
    }
    const response = await fetch(authUrl, {
        mode: "cors",
        headers: header,
        method: "POST",
        body: JSON.stringify(authBody),
    })
    if (!response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { translatedMessage }: { translatedMessage: string } =
            await response.json()
        throw new Error(translatedMessage ?? "Authentication key error")
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { token }: { token: string } = await response.json()
    localStorage.setItem("Auth", token)
    return token
}

async function getAppInfo(pkgName: string) {
    const infoUrl = `${v2BaseUrl}/${pkgName}/`
    const response = await fetch(infoUrl, {
        mode: "cors",
        method: "GET",
        headers: header,
    })
    if (!response.ok) {
        if (response.status == 401) {
            await getAuth()
            await getAppInfo(pkgName)
        } else {
            throw new Error("Request failure.")
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info: {
        price: { isFree: boolean }
        size: { actual: number }
        version: { code: string }
    } = await response.json()
    return info
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
    const response = await fetch(v1Url, {
        mode: "cors",
        method: "GET",
        headers: header,
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const resJson = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { uri }: { uri: string } = resJson
    console.log(`APK Download link: ${uri}`)
    if (!uri) {
        console.log(resJson)
        throw new Error("No download link.")
        }
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
        await getAuth()
        const url: URL = new URL(downloadBtn.getAttribute("href")!)
        const pkgName: string = url.searchParams.get("packageName")!
        const info = await getAppInfo(pkgName)
        if (!info.price.isFree) {
            console.log("Paid App!")
            btnSpan.textContent = "برنامه پولی!"
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
