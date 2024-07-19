// Valeur de période de temps
const VALUES = {
    1: "short_term",
    2: "medium_term",
    3: "long_term"
};

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

}

/**
 * Met en forme les données des artistes
 * @param {*} artists liste d'artistes
 * @param {*} elementid élément html où l'on va afficher les données
 */
function affichageListeArtist(artists, elementid){
    artists.forEach(artist => {
        const listItem = document.createElement('li');

        const nameArtist = document.createElement('a');
        nameArtist.href = artist.external_urls.spotify;
        nameArtist.target = '_blank';
        nameArtist.textContent = artist.name;
        listItem.appendChild(nameArtist);

        const imgItem = document.createElement('img');
        imgItem.src = artist.images[0].url;
        listItem.appendChild(imgItem);

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

}

/**
 * Met en forme les données des musiques
 * @param {*} tracks liste de musique
 * @param {*} elementid élément html où l'on va afficher les données
 */
function affichageListeTracks(tracks, elementid){
    tracks.forEach(track =>{
        const listItem = document.createElement('li');

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
            timerangeFR = 'court terme';
            break;
        case '2':
            timerangeFR = 'moyen terme';
            break;
        case '3':
            timerangeFR = 'long terme';
            break;
        default:
            timerangeFR = 'erreur';
    }
    return timerangeFR;
}



