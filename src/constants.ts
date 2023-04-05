const v1BaseUrl = "https://apiserver.myket.ir/v1/applications"
const v2BaseUrl = "https://apiserver.myket.ir/v2/applications"
const authUrl = "https://apiserver.myket.ir/v1/devices/authorize/"

const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Myket-Version": "914",
    Authorization: "",
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android x.x; xxxx Build/xxxxxx)",
    Host: "apiserver.myket.ir",
    Connection: "Keep-Alive",
    "Accept-Encoding": "gzip",
}

const authBody = {
    acId: "",
    acKey: "",
    adId: "82d8810f-e83c-46c0-8bf5-080a83d635c6",
    andId: "82ee24cd7aad5173",
    api: "29",
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

export { v1BaseUrl, v2BaseUrl, authUrl, header, authBody }
