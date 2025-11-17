const apiServerUrl = "https://apiserver.myket.ir"
const v1BaseUrl = `${apiServerUrl}/v1/applications`
const v2BaseUrl = `${apiServerUrl}/v2/applications`
const authUrl = `${apiServerUrl}/v1/devices/authorize/`

const headers: Headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "Myket-Version": "914",
    Authorization: "",
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android x.x; xxxx Build/xxxxxx)",
    Host: "apiserver.myket.ir",
    Connection: "Keep-Alive",
    "Accept-Encoding": "gzip",
})

function getAuthBody(apiVersion: string) {
    return {
        acId: "",
        acKey: "",
        adId: "82d8810f-e83c-46c0-8bf5-080a83d635c6",
        andId: "82ee24cd7aad5173",
        api: apiVersion,
        brand: "Nokia",
        cpuAbis: ["armeabi-v7a", "armeabi"],
        dens: 2.625,
        deviceModel: "Nokia 7 plus",
        deviceName: "B2N_sprout",
        deviceType: "normal",
        dsize: "300",
        hsh: "4e9118e410d75e2ef80aac45357493e397037940",
        imei: "",
        imsi: "",
        manufacturer: "HMD Global",
        product: "Onyx_00WW",
        supportedAbis: ["arm64-v8a", "armeabi-v7a", "armeabi"],
        uuid: "235f746f-3a40-44b7-97b4-01cac934df6d",
    }
}

async function getPostRequestInit(): Promise<RequestInit> {
    return new Promise<RequestInit>(resolve => {
        chrome.storage.local.get(["apiVersion"], result => {
            const apiVersion =
                typeof result.apiVersion === "string" ? result.apiVersion : "29"
            resolve({
                mode: "cors",
                headers: headers,
                method: "POST",
                body: JSON.stringify(getAuthBody(apiVersion)),
            })
        })
    })
}

const requestInit: RequestInit = {
    mode: "cors",
    method: "GET",
    headers: headers,
}

export {
    v1BaseUrl,
    v2BaseUrl,
    authUrl,
    headers,
    requestInit,
    getPostRequestInit,
}
