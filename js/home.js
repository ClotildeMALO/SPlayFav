const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const BASE_URL = 'https://api.spotify.com/v1';

var client_id = '***REMOVED***';
var client_secret = '***REMOVED***';
var redirect = 'http://localhost:5500/home.html';
var globalAccessToken = '';
var totalTracks = 0;

// Value period
const VALUES = {
    1: "short_term",
    2: "medium_term",
    3: "long_term"
};

// Recuperation de l'access token
async function getAccessToken(code) {
    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect
        })
    });
    const data = await response.json();
    return data.access_token;
}

// Recuperation des données du profil de l'utilisateur
async function getUserProfile() {
    const response = await fetch(`${BASE_URL}/me`, {
        headers: {
            'Authorization': 'Bearer ' + globalAccessToken
        }
    });
    const data = await response.json();
    return data;
}

// Recuperation des données des titres likés de l'utilisateur
async function getLikedTrack() {
    let offset = 0;
    const limit = 3;

    const response = await fetch(`${BASE_URL}/me/tracks?market=FR&limit=${limit}&offset=${offset}`, {
        headers: {
            'Authorization': 'Bearer ' + globalAccessToken
        }
    });
    const data = await response.json();
    return data.items;
}

// Récupération du nombre total de titres likés et affichage de la première page
async function getAllLikedTracks() {
    const limit = 50; // Nombre max de titres par requête

    const response = await fetch(`${BASE_URL}/me/tracks?market=FR&limit=1&offset=0`, {
        headers: {
            'Authorization': 'Bearer ' + globalAccessToken
        }
    });
    const data = await response.json();
    totalTracks = data.total;

    const totalPages = Math.ceil(totalTracks / limit); // arrondi à l'entier supérieur

    // Affichage de la première page
    await loadLikedTracksPage(1, limit);

    // Création des boutons de pagination
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => loadLikedTracksPage(i, limit);
        paginationElement.appendChild(button);
    }
}

// Chargement des titres likés pour une page donnée
async function loadLikedTracksPage(page, limit) {
    const offset = (page - 1) * limit;

    const response = await fetch(`${BASE_URL}/me/tracks?market=FR&limit=${limit}&offset=${offset}`, {
        headers: {
            'Authorization': 'Bearer ' + globalAccessToken
        }
    });
    const data = await response.json();
    const tracks = data.items;

    const tracksListElement = document.getElementById('allLikedTracks');
    tracksListElement.innerHTML = ''; // Vide la liste actuelle

    const totalTracksHeader = document.createElement('h3');
    totalTracksHeader.textContent = `Vous avez liké ${totalTracks} titres :`;
    tracksListElement.appendChild(totalTracksHeader);
    tracks.forEach(track => {
        const listItem = document.createElement('li');
        listItem.textContent = track.track.name + ' par ' + track.track.artists.map(artist => artist.name).join(', ');
        tracksListElement.appendChild(listItem);
    });
}

// Creation d'une playlist
async function createPlaylist(userid){
    const URL = `${BASE_URL}/users/${userid}/playlists`;


}

// Ajout d'un titre à une playlist
async function addTrackToPlaylist(playlist_id) {
    const URL = `${BASE_URL}/playlists/${playlist_id}/tracks`
}

// recuperation top artistes selon le nombre limité et la période
async function getTopArtists(timerangenum, limit){
    const timerange = VALUES[timerangenum];
    const response = await fetch(`${BASE_URL}/me/top/artists?time_range=${timerange}&limit=${limit}`, {
        headers: {
            'Authorization': 'Bearer ' + globalAccessToken
        }
    });
    const data = await response.json();
    const top = data.items;

    const topArtistsElement = document.getElementById('topArtists');
    topArtistsElement.innerHTML = ''; // Vide la liste actuelle

    const topArtistsHeader = document.createElement('h3');
    topArtistsHeader.textContent = `Votre top ${limit} d'artistes (${timerange}):`;
    topArtistsElement.appendChild(topArtistsHeader);

    top.forEach(artist =>{
        const listItem = document.createElement('li');
        listItem.textContent = artist.name;
        topArtistsElement.appendChild(listItem);
        const imgItem = document.createElement('img');
        imgItem.src = artist.images[0].url;
        topArtistsElement.appendChild(imgItem);
    })

}



// recuperation top artistes selon le nombre limité et la période
async function getTopTrack(timerangenum, limit){
    const timerange = VALUES[timerangenum];
    const response = await fetch(`${BASE_URL}/me/top/tracks?time_range=${timerange}&limit=${limit}`, {
        headers: {
            'Authorization': 'Bearer ' + globalAccessToken
        }
    });
    const data = await response.json();
    const tracks = data.items;

    const topArtistsElement = document.getElementById('topTracks');
    topArtistsElement.innerHTML = ''; // Vide la liste actuelle

    const topArtistsHeader = document.createElement('h3');
    topArtistsHeader.textContent = `Votre top ${limit} de musiques (${timerange}):`;
    topArtistsElement.appendChild(topArtistsHeader);

    tracks.forEach(track =>{
        const listItem = document.createElement('li');
        listItem.textContent = track.name;
        topArtistsElement.appendChild(listItem);
    })

}



document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
        globalAccessToken = await getAccessToken(code);
        const userProfile = await getUserProfile();
        const likedTrack = await getLikedTrack();

        // Ajout du nom de l'utilisateur dans le p profilname
        const profileNameElement = document.getElementById('profilname');
        profileNameElement.textContent = `Bonjour ${userProfile.display_name}`;

        // Ajout des titres likés dans la liste likedtracks
        const tracksListElement = document.getElementById('likedtracks');
        likedTrack.forEach(track => {
            const listItem = document.createElement('li');
            listItem.textContent = track.track.name + ' par ' + track.track.artists.map(artist => artist.name).join(', '); // le join permet de regrouper si plusieurs artistes
            tracksListElement.appendChild(listItem);
        });




    }
});
