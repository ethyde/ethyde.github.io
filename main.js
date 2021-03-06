//create an empty array on startup
let animeHistory = []
const API_BASE = "https://api.jikan.moe/v3/"
const API_ANIME = API_BASE + "anime/"
const HISTORY_STORAGE_KEY = 'HISTORY_KEY'

/**
 * generate anime tag
 */
function buildAnimeMarkup(anime) {
    return `<div class="anime_item"><img class='anime_image' src=${anime.image_url} />
        <h2 class='anime_name'>${anime.title}</h2>
        <p class='anime_description'>${anime.aired_string}</p></div>`
}

/**
 * add an anime to the history and updates display
 */
function updateHistory(anime) {
    animeHistory.push(anime)

    //Save the array in the local storage. JSON.stringify allows to serialize the array to a string
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(animeHistory))

    //update display
    addAnimeToHistoryTag(anime)
}

/**
 * Update the DOM
 */
function addAnimeToHistoryTag(anime) {
    document.querySelector('#history').innerHTML = buildAnimeMarkup(anime) + document.querySelector('#history').innerHTML
}

/**
 * loadAnAnime from the internet and place it on a target element
 */
async function onOkButtonClickAsync() {
    let targetElementId = '#main_anime'
    let animeId = document.querySelector("#anime_id_input").value
    try {
        const response = await fetch(API_ANIME + animeId)
        if (!response.ok) {
            return
        }
        const anime = await response.json()
        console.log("[Main Script] anime datas", anime)
        document.querySelector(targetElementId).innerHTML = buildAnimeMarkup(anime)

        updateHistory(anime)
    } catch (err) {
        console.error(`error ${err}`)
    }
}

/**
 * The history is serrialized as a JSON array. We use JSON.parse to convert is to a Javascript array
 */
function getLocalHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY))
}



async function installServiceWorkerAsync() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then((registration) => { console.log(`[Main Script] Service Worker Registered: `, registration) })
            .catch((error) => { console.warn(`[Main Script] Failed to register service worker: ${error}`) })
    }
}

async function onLoadAsync() {
    //load the history from cache
    let history = getLocalHistory()
    if (history !== null) {
        //set the animeHistory array and update the display
        animeHistory = history
        animeHistory.forEach(anime => addAnimeToHistoryTag(anime))
    }

    //Install the service worker
    installServiceWorkerAsync()
}

window.addEventListener('load', (event) => {
    onLoadAsync()
})