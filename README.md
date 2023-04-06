# About

Reverse engineered Myket API that allows the download of APKs from the website instead of the official android app.

# Requirements

* Node.js 16.10+ or Install Corepack with `npm i -g corepack` on Older Node.js
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
