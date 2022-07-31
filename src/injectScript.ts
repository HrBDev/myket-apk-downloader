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

waitForElement('a.btn-download').then(downloadButton)

async function downloadButton(downloadButton: Element) {
    let btnSpan = document.getElementById('basebtn');
    if (btnSpan == null) {
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
        btnSpan.textContent = `دانلود (${size})`
    } catch (err) {
        btnSpan.textContent = "خطا";
        downloadButton.setAttribute('href', '#');
        console.log(err);
    }
}