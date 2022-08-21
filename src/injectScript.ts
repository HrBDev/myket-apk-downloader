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
            subtree: true
        })
    })
}

const Auth = ""
    
    
    
    

const Header = {
    Accept: "application/json",
    "Myket-Version": "914",
    Authorization: Auth,
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android x.x; xxxx Build/xxxxxx)",
    Host: "apiserver.myket.ir",
    Connection: "Keep-Alive",
    "Accept-Encoding": "gzip"
}

const v1BaseUrl = "https://apiserver.myket.ir/v1/applications"
const v2BaseUrl = "https://apiserver.myket.ir/v2/applications"

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
        const url: URL = new URL(downloadBtn.getAttribute("href")!)
        const pkgName: string = url.searchParams.get("packageName")!
        const infoUrl = `${v2BaseUrl}/${pkgName}/`
        const infoRes = await fetch(infoUrl, {
            mode: "cors",
            method: "GET",
            headers: Header
        })
        if (!infoRes.ok) throw new Error("Request failure.")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const {
            price: { isFree },
            size: { actual },
            version: { code }
        }: {
            price: { isFree: boolean }
            size: { actual: number }
            version: { code: string }
        } = await infoRes.json()
        if (!isFree) {
            console.log("Paid App!")
            return
        }
        const v1Url =
            `${v1BaseUrl}/${pkgName}/uri/?action=start&` +
            `requestedVersion=${code}&fileType=App&lang=fa`
        const v1Res = await fetch(v1Url, {
            mode: "cors",
            method: "GET",
            headers: Header
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { uri }: { uri: string } = await v1Res.json()
        console.log(`APK Download link: ${uri}`)
        if (!uri) throw new Error("No download link.")
        downloadBtn.removeAttribute("onclick")
        downloadBtn.setAttribute("href", uri)
        btnSpan.textContent = `دانلود (${actual})`
    } catch (e) {
        btnSpan.textContent = "خطا"
        downloadBtn.setAttribute("href", "#")
        console.log(e)
    }
}
