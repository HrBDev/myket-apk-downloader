# Requirements

* Node 16.10+
* Enable Corepack by running `corepack enable` as superuser/admin
* yarn package manager (`npm install -g yarn`)

# Build instructions

 ```
 yarn install
 yarn run build 
 ```

* in the dist folder:
    * For Firefox builds delete manifest.json and rename manifest_firefox.json to manifest.json.
    * For Chromium based browser builds delete manifest_firefox.json.

