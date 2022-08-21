function waitForElement(selector: string): Promise<Element> {
    return new Promise<Element>(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector)!);
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector)!);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const Auth = "" 
    
    
    

const header = {
    'Accept': 'application/json',
    'Myket-Version': '914',
    'Authorization': Auth,
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android x.x; xxxx Build/xxxxxx)',
    'Host': 'apiserver.myket.ir',
    'Connection': 'Keep-Alive',
    'Accept-Encoding': 'gzip'
};

const v1BaseUrl = "https://apiserver.myket.ir/v1/applications"
const v2BaseUrl = "https://apiserver.myket.ir/v2/applications"

waitForElement('a.btn-download').then(getDownloadLink).catch(_ => {
    console.log("Could not find download button.")
})

async function getDownloadLink(downloadBtn: Element) {
    let btnSpan = document.getElementById('basebtn');
    if (!btnSpan) {
        console.log("Could not find download button text element.")
        return
    }
    try {
        let url: URL = new URL(downloadBtn.getAttribute('href')!);
        let pkgName = url.searchParams.get('packageName');
        let infoUrl = `${v2BaseUrl}/${pkgName}/`;
        let infoRes = await fetch(infoUrl, {
            mode: 'cors',
            method: 'GET',
            headers: header
        })
        if (!infoRes.ok) throw new Error("Request failure.")
        let infoJson = await infoRes.json();
        if (!infoJson.price.isFree) {
            console.log("Paid App!")
            return
        }
        let v1Url = `${v1BaseUrl}/${pkgName}/uri/?action=start&` +
            `requestedVersion=${infoJson.version.code}&fileType=App&lang=fa`
        let v1Res = await fetch(v1Url, {
            mode: 'cors',
            method: 'GET',
            headers: header
        })
        let v1Json = await v1Res.json()
        console.log(`APK Download link: ${v1Json.uri}`);
        if (!v1Json.uri) throw new Error("No download link.");
        downloadBtn.removeAttribute("onclick");
        downloadBtn.setAttribute("href", v1Json.uri);
        btnSpan.textContent = `دانلود (${infoJson.size.actual})`
    } catch (e) {
        btnSpan.textContent = "خطا";
        downloadBtn.setAttribute("href", "#");
        console.log(e);
    }
}