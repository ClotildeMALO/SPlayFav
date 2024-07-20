// Valeur de période de temps
const VALUES = {
    1: "short_term",
    2: "medium_term",
    3: "long_term"
};

let clicTopArtist = false;
let clicTopTrack = false;
/**
 * Recuperation du top des artistes
 * @param {* : int} timerangenum période de temps (1 à 3 court à long terme)
 * @param {* : int} limit nombre d'artistes à afficher
 */
async function getTopArtists(timerangenum, limit){
    const token = sessionStorage.getItem('token');
    const timerange = VALUES[timerangenum];

    let timerangeFR = periodeTimeString(timerangenum);

    const response = await fetch(`${BASE_URL}/me/top/artists?time_range=${timerange}&limit=${limit}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    const top = data.items;

    const topArtistsElement = document.getElementById('topArtists');
    topArtistsElement.innerHTML = ''; // Vide la liste actuelle

    const topArtistsHeader = document.createElement('h3');
    topArtistsHeader.textContent = `Votre top ${limit} d'artistes (${timerangeFR}) :`;
    topArtistsElement.appendChild(topArtistsHeader);

    affichageListeArtist(top, topArtistsElement);

    clicTopArtist = true; // permet d'indiquer si le bouton a été cliqué

    /* changer bouton une fois cliqué*/
    const rangePeriod = document.getElementById('rangePeriodArtist');
    const rangeNb = document.getElementById('rangeNbArtist');

    if (rangePeriod.value == timerangenum && rangeNb.value == limit){
        const button = document.getElementById('topArtist');
        button.textContent = 'Cacher mon top artiste';

        button.onclick = function(){
            topArtistsElement.innerHTML = '';
            clicTopArtist = false;
            button.textContent = 'Voir mon top artiste';
            button.onclick = function(){
                getTopArtists(rangePeriod.value, rangeNb.value);
            }
        }
    }

}

/**
 * A la modif de valeur des sliders le bouton repasse en voir top artistes
 * @param {*} timerangenum  période de temps (1 à 3 court à long terme)
 * @param {*} limit nombre d'artistes à afficher
 */
function modifTopArtistRange(timerangenum, limit){
    if (clicTopArtist){
        const button = document.getElementById('topArtist');
        button.textContent = 'Voir mon top artiste';
        button.onclick = function(){
            getTopArtists(timerangenum, limit);
        }

    }
}


/**
 * Met en forme les données des artistes
 * @param {*} artists liste d'artistes
 * @param {*} elementid élément html où l'on va afficher les données
 */
function affichageListeArtist(artists, elementid){
    artists.forEach(artist => {
        const listItem = document.createElement('li');

        const numItem = document.createElement('div');
        numItem.className = 'num-item';
        numItem.textContent = artists.indexOf(artist) + 1;
        listItem.appendChild(numItem);

        const imgItem = document.createElement('img');
        imgItem.src = artist.images[0].url;
        listItem.appendChild(imgItem);

        const nameArtist = document.createElement('a');
        nameArtist.href = artist.external_urls.spotify;
        nameArtist.target = '_blank';
        nameArtist.textContent = artist.name;
        listItem.appendChild(nameArtist);

        elementid.appendChild(listItem);


    });
}

/**
 * Récupération du top des musiques
 * @param {*} timerangenum période de temps (1 à 3 court à long terme)
 * @param {*} limit nombre d'artistes à afficher
 */
async function getTopTrack(timerangenum, limit){
    const token = sessionStorage.getItem('token');
    const timerange = VALUES[timerangenum];

    let timerangeFR = periodeTimeString(timerangenum);
    const response = await fetch(`${BASE_URL}/me/top/tracks?time_range=${timerange}&limit=${limit}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    const tracks = data.items;

    const topArtistsElement = document.getElementById('topTracks');
    topArtistsElement.innerHTML = ''; // Vide la liste actuelle

    const topArtistsHeader = document.createElement('h3');
    topArtistsHeader.textContent = `Votre top ${limit} de musiques (${timerangeFR}) :`;
    topArtistsElement.appendChild(topArtistsHeader);

    affichageListeTracks(tracks, topArtistsElement);

    clicTopTrack = true; // permet d'indiquer si le bouton a été cliqué

    /* changer bouton une fois cliqué*/
    const rangePeriod = document.getElementById('rangePeriodTrack');
    const rangeNb = document.getElementById('rangeNbTracks');

    if (rangePeriod.value == timerangenum && rangeNb.value == limit){
        const button = document.getElementById('topTrack');
        button.textContent = 'Cacher mon top musique';

        button.onclick = function(){
            topArtistsElement.innerHTML = '';
            clicTopTrack = false;
            button.textContent = 'Voir mon top musique';
            button.onclick = function(){
                getTopTrack(rangePeriod.value, rangeNb.value);
            }
        }
    }

}

/**
 * A la modif de valeur des sliders le bouton repasse en voir top musique
 * @param {*} timerangenum  période de temps (1 à 3 court à long terme)
 * @param {*} limit nombre de musique à afficher
 */
function modifTopTrackRange(timerangenum, limit){
    if (clicTopTrack){
        const button = document.getElementById('topTrack');
        button.textContent = 'Voir mon top musique';
        button.onclick = function(){
            getTopTrack(timerangenum, limit);
        }

    }
}

/**
 * Met en forme les données des musiques
 * @param {*} tracks liste de musique
 * @param {*} elementid élément html où l'on va afficher les données
 */
function affichageListeTracks(tracks, elementid){
    tracks.forEach(track =>{
        const listItem = document.createElement('li');

        const numItem = document.createElement('div');
        numItem.className = 'num-item';
        numItem.textContent = tracks.indexOf(track) + 1;
        listItem.appendChild(numItem);


        const imgItem = document.createElement('img');
        imgItem.src = track.album.images[0].url;
        listItem.appendChild(imgItem);

        const trackInfo = document.createElement('div');
        trackInfo.className = 'track-info';

        const nameTrack = document.createElement('a');
        nameTrack.href = track.external_urls.spotify;
        nameTrack.target = '_blank';
        nameTrack.textContent = track.name;
        trackInfo.appendChild(nameTrack);

        const artists = document.createElement('div');
        artists.className = 'artists';
        artists.textContent = 'par ' + track.artists.map(artist => artist.name).join(', ');
        trackInfo.appendChild(artists);

        const album = document.createElement('div');
        album.className = 'album';
        album.textContent = 'Album: ' + track.album.name;
        trackInfo.appendChild(album);

        listItem.appendChild(trackInfo);
        elementid.appendChild(listItem);
    })
}


function periodeTimeString(periodNum){
    let timerangeFR = '';
    switch (periodNum) {
        case '1':
            timerangeFR = 'court terme (4 semaines)';
            break;
        case '2':
            timerangeFR = 'moyen terme (6 mois)';
            break;
        case '3':
            timerangeFR = 'long terme (1 an)';
            break;
        default:
            timerangeFR = 'erreur';
    }
    return timerangeFR;
}



