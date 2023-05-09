# About

This browser extension allows users to download APKs from the website using reverse-engineered Myket API, instead of the official Android app.
Available
on [Edge Addons](https://microsoftedge.microsoft.com/addons/detail/myket-apk-downloader/dpjcncnnibmchngbcpgdmacokbadibkd)
and [Add-ons for Firefox](https://addons.mozilla.org/en-US/firefox/addon/myket-apk-downloader-firefox/).

# Requirements

* Node.js 18.16+
* Corepack (Enable by running `corepack enable` as superuser/admin)
* yarn package manager (`corepack prepare yarn@<version> --activate`)

# Build instructions

 ```
 yarn install
 yarn run build 
 ```

* in the dist folder:
    * For Firefox builds delete manifest.json and rename manifest_firefox.json to manifest.json.
    * For Chromium based browser builds delete manifest_firefox.json.

# TODO

- [x] Add Authentication flow if possible since the Auth token expires every 2 weeks
- [ ] Add an Android API selector
