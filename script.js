//Handler per visualizzare le opzioni di ricerca per l'API del meteo
function listOptions()
{
    //Div contente l'elemento Select con le varie opzioni di ricerca 
    const select = document.querySelector("#place-api");
    
    if(select.dataset.visible === "false")
    {
        select.classList.remove('hidden');
        select.dataset.visible = "true";
    }
    else
    {
        select.classList.add('hidden');
        select.dataset.visible = "false";
        
        //Se nascondo il Div rendo non visibile il div interno dei risultati
        select.querySelector('#weather-desc').classList.add('hidden');
    }
}


//Associo l'handler al pulsante per mostrare il div di selezione luoghi
const activatePlacesAPI = document.querySelector('#activate-places-api');

activatePlacesAPI.addEventListener('click', listOptions);

//Se la richiesta dell'API ha successo eseguo la seguente funzione che mi restituisce la promessa del json
function onSuccess(response)
{
    return response.json();
}

//Se la promessa del Json ha avuto esito positivo ricavo le previsioni del meteo dal file Json ottenuto
function onJsonWeather(json)
{
    //Individuo il contenitore della descrizione del meteo, rendendolo visibile, e creo i paragrafi contenente la stessa descrizione
    const weatherDiv = document.querySelector('#weather-desc');
    const weather = weatherDiv.childNodes[1];
    const weatherDescr = weatherDiv.childNodes[3];
    const weatherPressure = weatherDiv.childNodes[5];
    const weatherHumidity = weatherDiv.childNodes[7];
    const weatherWindSpeed = weatherDiv.childNodes[9];
    weatherDiv.classList.remove('hidden');
    
    //Creo la stringa da impostare come contenuto del paragrafo creato precdentemente
    weather.textContent = 'Tempo: ' + json.weather[0].main;
    weatherDescr.textContent = 'Condizioni: ' + json.weather[0].description;
    weatherPressure.textContent = 'Pressione: ' + json.main.pressure;
    weatherHumidity.textContent = 'Umidità: ' + json.main.humidity;
    weatherWindSpeed.textContent = 'Velocità vento: ' + json.wind.speed;
}

//Se la promessa del Json ha avuto esito positivo ricavo le coordinate dal file Json ottenuto
function onJsonCoords(json)
{
    //Recupero Latitudine e Longitudine della località trovata come risultato (limit = 1)
    const api_key = 'e15ccc4a6c8b6473f22eb34da6bb26d4';
    const lat = json[0].lat;
    const lon = json[0].lon;
    const lang = 'it';
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + api_key + '&lang=' + lang;
    
    fetch(url).then(onSuccess).then(onJsonWeather);
}

//Handler pulsante "cerca" per l'esecuzione dell'API di controllo del meteo locale del luogo selezionato ("OpenWeather API")
function weatherForecast()
{
    //Leggo il valore dall'opzione selezionata all'interno dell'elemento "<select>"
    const selectElem = document.querySelector('select');
    const optionIndex = selectElem.selectedIndex;
    const optionSelected = encodeURIComponent(selectElem.options[optionIndex].value);
    
    //Preparo il fetch per ottenere le coordinate geografiche delle regioni nel mondo
    const api_key = 'e15ccc4a6c8b6473f22eb34da6bb26d4';
    const limit = '1';
    const url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + optionSelected + '&limit=' + limit + '&appid=' + api_key;
    
    fetch(url).then(onSuccess).then(onJsonCoords);
}

//Pulsante di ricerca
const searchForecast = document.querySelector('#place-api #search-btn');

//Aggiungo l'event listener al pulsante di ricerca
searchForecast.addEventListener('click', weatherForecast);



//OAUTH 2.0 API -- SPOTIFY
//Informazioni riguardanti le playlist di spotify negli appositi contenitori all'interno della sidebar

//OnSucces Function è la stessa definita alla riga 29

//Funzione che si occupa di creare i container per inserire i dati recuperati dalle playlist di spotify
function onJsonSpotPlaylist(json)
{
    //Creazione div all'interno della sidebar
    const spotifyDataContainer = document.querySelector('#sidebar .flex-container');
    const spotifyData = document.createElement('div');
    
    //Aggiungo ai div creati la classe css "container"
    spotifyData.classList.add('container');
    
    
    //Creazione elementi interni ai singoli container recuperando i dati dal json riguardanti i dati della playlist ottenuta dalla chiamata all'API
    const img_link = document.createElement('a');
    img_link.href = json.external_urls.spotify;
    
    const img = document.createElement('img');
    img.src = json.images[0].url;
    
    const namePar = document.createElement('p');
    const descPar = document.createElement('p');
    
    namePar.textContent = json.name;
    descPar.textContent = json.description;
    
    
    img_link.appendChild(img);
    img_link.appendChild(namePar);
    img_link.appendChild(descPar);
    spotifyData.appendChild(img_link);
    
    spotifyDataContainer.appendChild(spotifyData);
}

//Definisco la funzione "onTokenPlaylistSpotify" che viene eseguito quando viene restituita la promessa del Json del token di Spotify e si occupa di eseguire l'API per ottenere le info di una playlist
function onTokenPlaylistSpotify(json)
{
    const token = json.access_token;
    
    const playlistIDs = ['37i9dQZEVXbKyJS56d1pgi', '37i9dQZEVXbJqdarpmTJDL', '37i9dQZEVXbIPWwFssbupI', '37i9dQZEVXbIQnj7RRhdSX']
    
    for(const playlistID of playlistIDs)
    {
        fetch("https://api.spotify.com/v1/playlists/" + playlistID,
            {
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
        ).then(onSuccess).then(onJsonSpotPlaylist);
    }
}

//Definisco la funzione di recupero token mediante il metodo POST di HTTP e invoca l'API per ottenere le info delle playlists tramite la funzione "onTokenPlaylistSpotify"
function getSpotifytData()
{
    //Conservo le credenziali necessarie per ottenere il token mediante "OAuth2.0"
    const client_id = 'de3cc89eefe04929830c31b45c70e643';
    const client_secret = '78c2a7c5f444469ea0abf30b9b3a31d5';
    
    fetch("https://accounts.spotify.com/api/token",
        {
            method: "POST",
            body: 'grant_type=client_credentials',
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
            }
        }
    ).then(onSuccess).then(onTokenPlaylistSpotify);
}

//Eseguo l'API una volta per caricamento di pagina
getSpotifytData();

//Aggiungo gli handlers e gli event listeners per l'apertura/chiusura della sidebar
function openSidebar()
{
    document.querySelector('#sidebar').classList.add('show');
}

function closeSidebar()
{
    document.querySelector('#sidebar').classList.remove('show');
}

const openBtn = document.querySelector('#nav-logo');
const closeBtn = document.querySelector('.close-btn');

openBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);