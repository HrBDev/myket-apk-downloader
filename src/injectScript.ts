function waitForElement(selector: string): Promise<Element> {
    return new Promise<Element>(resolve => {
        if (document.querySelector(selector)) {
            // @ts-ignore
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                // @ts-ignore
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const au = 'eyJhY2MiOiIwN2RhYjIzZS00ZWZjLTRjOTQtYmQzZS1kNTJkODZhOTYwYmYiLCJhcGkiOiIyOSIsImNwdSI6ImFybTY0LXY4YTthcm1' +
    'lYWJpLXY3YTthcm1lYWJpIiwiZHQiOjIwNzUzMzk2NCwiYW5kSWQiOiI4MmVlMjRjZDdhYWQ1MTczIiwiYWRJZCI6IjgyZDg4MTBmLWU4M2MtN' +
    'DZjMC04YmY1LTA4MGE4M2Q2MzVjNiIsInYiOjIsImhzaCI6IlczL25Wa0NVQlppa1NRRHJ2MHZ1a3pTVG1JTT0iLCJzY3IiOiIzMDBfNDIwIiw' +
    'idSI6IjY5ZWIwMWIxLTkxOWQtNDhmNC04NGIxLTY4N2NkYzZhN2IwZiJ9';

const header = {
    'Accept': 'application/json',
    'Myket-Version': '914',
    'Authorization': au,
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android x.x; xxxx Build/xxxxxx)',
    'Host': 'apiserver.myket.ir',
    'Connection': 'Keep-Alive',
    'Accept-Encoding': 'gzip'
};

const v1BaseUrl = "https://apiserver.myket.ir/v1/applications"
const v2BaseUrl = "https://apiserver.myket.ir/v2/applications"

waitForElement('a.btn-download').then(getDownloadLink)

async function getDownloadLink(downloadButton: Element) {
    let btnSpan = document.getElementById('basebtn');
    if (!btnSpan) {
        console.log("Could not find element.")
        return
    }
    try {
        let url: string = downloadButton.getAttribute('href')!;
        let pkgName = new URL(url).searchParams.get('packageName');
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
        let v1Res = await fetch(`${v1BaseUrl}/${pkgName}/uri/?action=start&` +
            `requestedVersion=${infoJson.version.code}&fileType=App&lang=fa`, {
            mode: 'cors',
            method: 'GET',
            headers: header
        })
        let v1Json = await v1Res.json()
        console.log(`APK Download link: ${v1Json.uri}`);
        if (!v1Json.uri) throw new Error("No download link.");
        downloadButton.removeAttribute("onclick");
        downloadButton.setAttribute("href", v1Json.uri);
        btnSpan.textContent = `دانلود (${infoJson.size.actual})`
    } catch (err) {
        btnSpan.textContent = "خطا";
        downloadButton.setAttribute("href", "#");
        console.log(err);
    }
}