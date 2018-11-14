# About :

This is POC for testing some of basic PWA capabilities.

# Install

* Create a folder then git clone this repo 
* Start a local server like [http-server](https://www.npmjs.com/package/http-server) 
* open your browser (prefer Chrome) and navigate to your local host (probably something like `http://127.0.0.1:8080/`)
$ open dev tool

# Resources :

https://codelabs.developers.google.com/codelabs/your-first-pwapp/
https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API/Using_Service_Workers
https://developers.google.com/web/ilt/pwa/
https://vaadin.com/pwa/build
https://blog.eleven-labs.com/fr/votre-premiere-pwa/
https://github.com/yostane/pwa_from_scratch

## Offline/Online and Cache API Management :

https://jakearchibald.com/2014/offline-cookbook
https://serviceworke.rs/
https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/offline-for-pwa

## Store and retrieve Data : 

Because in this POC datas are stored and loaded from the localStore, but it's not a good practice, prefer to use IndexedDB
https://codelabs.developers.google.com/codelabs/your-first-pwapp/#4
https://github.com/googlecodelabs/your-first-pwapp/blob/master/final/scripts/app.js#L333-L362

## With Webpack :

https://vaadin.com/pwa/build/production-pwa-with-webpack-and-workbox
https://webpack.js.org/guides/progressive-web-application/
https://github.com/webpack/webpack-pwa