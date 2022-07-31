function waitForElement(selector: string): Promise<Element> {
    return new Promise<Element>(resolve => {
        if (document.querySelector(selector)) {
            // @ts-ignore
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
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

waitForElement('a.btn-download').then(downloadButton)

async function downloadButton(downloadButton: Element) {
    let span = document.getElementById('basebtn');
    if (span == null) {
        console.log("Could not find element.")
        return
    }
    try {
        let url: string = downloadButton.getAttribute('href')!;
        let pkg = new URL(url).searchParams.get('packageName');
        let downloadLink = 'https://apiserver.myket.ir/v2/applications/' + pkg + '/';
        let response = await fetch(downloadLink, {
            mode: 'cors',
            method: 'GET',
            headers: header
        })
        if (!response.ok) {
            console.log("Request failure")
            return
        }
        let res = await response.json();
        if (res.price.isFree == false) {
            console.log("Paid App!")
            return
        }
        let size = res.size.actual;
        downloadButton.removeAttribute('onclick');
        downloadButton.setAttribute('href', downloadLink);
        span.textContent = `دانلود (${size})`
    } catch (err) {
        span.textContent = "خطا";
        downloadButton.setAttribute('href', '#');
        console.log(err);
    }
}