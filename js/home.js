const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const PROFILE_URL = 'https://api.spotify.com/v1/me';
const TRACKS_URL = 'https://api.spotify.com/v1/me/tracks?market=FR';

var client_id = '9189e6080d5b41e4b2f4c12db928cb9c';
var client_secret = 'a0bf0575757e47adb7920c676afbc43c';
var redirect = 'http://localhost:5500/home.html';
var globalAccessToken = '';


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
async function getUserProfile(accessToken) {
    const response = await fetch(PROFILE_URL, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const data = await response.json();
    return data;
}

// Recuperation des données des titres likés de l'utilisateur
async function getLikedTrack(accessToken) {
    let offset = 0;
    const limit = 3;

    const response = await fetch(`${TRACKS_URL}&limit=${limit}&offset=${offset}`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const data = await response.json();
    return data.items;
}

// Récupération de tous les titres likés de l'utilisateur et ajout dans liste allLikedTracks
async function getAllLikedTracks() {
    let tracks = [];
    let offset = 0;
    const limit = 50; // Nombre max de titres par requête

    while (true) {
        const response = await fetch(`${TRACKS_URL}&limit=${limit}&offset=${offset}`, {
            headers: {
                'Authorization': 'Bearer ' + globalAccessToken
            }
        });
        const data = await response.json();
        tracks = tracks.concat(data.items);
        if (data.items.length < limit) {
            break; // Sort de la boucle si le nombre de titres récupérés est inférieur à la limite
        }
        offset += limit; // Passe au titre suivant
    }
    // Ajout de tous titres likés dans la liste allLikedTracks
    const tracksListElement = document.getElementById('allLikedTracks');
    tracksListElement.innerHTML = ''; // vide liste 

    tracksListElement.textContent = `Vous avez liké ${tracks.length} titres : `;
    tracks.forEach(track => {
        const listItem = document.createElement('li');
        listItem.textContent = track.track.name + ' par ' + track.track.artists.map(artist => artist.name).join(', ');
        tracksListElement.appendChild(listItem);
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
        globalAccessToken = await getAccessToken(code);
        const userProfile = await getUserProfile(globalAccessToken);
        const likedTrack = await getLikedTrack(globalAccessToken);

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
