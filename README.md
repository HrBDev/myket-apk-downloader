[![webpack workflow](https://github.com/HrBDev/myket-apk-downloader/actions/workflows/webpack.yml/badge.svg)](https://github.com/HrBDev/myket-apk-downloader/actions/workflows/webpack.yml)

# About

This browser extension allows users to download APKs from the website using reverse-engineered Myket API, instead of the official Android app.
Available
on [Edge Addons](https://microsoftedge.microsoft.com/addons/detail/myket-apk-downloader/dpjcncnnibmchngbcpgdmacokbadibkd)
and [Add-ons for Firefox](https://addons.mozilla.org/en-US/firefox/addon/myket-apk-downloader-firefox/).

# Requirements

Node.js 22.18+

Puppeteer browser downloads are disabled during dependency installation. Install
test browsers explicitly when needed:

```sh
pnpm exec puppeteer browsers install chrome
pnpm exec puppeteer browsers install firefox
```


# How to run on Chromium

Install dependencies and start webpack's build watcher in one terminal:

```sh
pnpm install
pnpm run dev
```

After the first successful build, open another terminal and launch Chromium with
the extension automatically loaded:

```sh
pnpm run dev:chrome
```


# Build instructions

 ```
 pnpm install
 pnpm run build 
 ```

Builds are written to `dist/firefox` and `dist/chrome`, each with its own manifest.

# TODO

- [x] Add Authentication flow if possible since the Auth token expires every 2 weeks
- [ ] Add an Android API selector
