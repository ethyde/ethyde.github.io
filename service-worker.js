const CACHE_NAME = 'PMD-PWA-V1'
const DATA_CACHE_NAME = 'PMD-PWA-DATA-V1'
const STATIC_ASSET = [
  '/',
  '/index.html',
  '/main.js',
  '/main.css'
]

const LATER_USED_ASSETS = []

/**
 * The install event is fired when the registration succeeds.
 * After the install step, the browser tries to activate the service worker.
 * Generally, we cache static resources that allow the website to run offline
 */

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell')
      // You can addAll() later used assets
      cache.addAll(LATER_USED_ASSETS)
      // Then return when needed assets are loaded
      return cache.addAll(STATIC_ASSET)
    })
  )
})

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate')
  // Be sure to have the last APP and DATA cache
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url)
  console.log('[Service Worker] Fetch', requestURL)
  // Here you can apply one or many of the Offline stratégy
  // depend of requestURL informations
  // Adapted from : https://github.com/googlecodelabs/your-first-pwapp/blob/master/final/service-worker.js#L75-L102
 if (requestURL.host === 'api.jikan.moe') {
   /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        console.log(`[Service Worker] Fetch using "Cache then network" Strategy`)
        return fetch(event.request).then((response) => {
          cache.put(event.request.url, response.clone())
          return response
        })
      })
    )
 } else {
   /*
    * The app is asking for app shell files. In this scenario the app uses the
    * "Cache, falling back to the network" offline strategy:
    * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
    */
   event.respondWith(
     caches.match(event.request).then(function(response) {
        console.log(`[Service Worker] Fetch using "Cache, falling back to the network" Strategy`)
        return response || fetch(event.request)
      })
    )
 }
})