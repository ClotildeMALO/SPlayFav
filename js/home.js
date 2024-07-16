const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const BASE_URL = 'https://api.spotify.com/v1';


var client_id = '9189e6080d5b41e4b2f4c12db928cb9c';
var client_secret = 'a0bf0575757e47adb7920c676afbc43c';
var redirect = 'http://localhost:5500/home.html';

/**
 * Récupération du token d'accès
 * @param {*} code : code d'accès
 * @returns token d'accès
 */
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
    sessionStorage.setItem('token', data.access_token); 
    return data.access_token;
}


/**
 * Récupération des genres disponibles
 */
async function getAvailableGenre(){
    const token = sessionStorage.getItem('token');
    // Recuperation des genres disponibles
    const response = await fetch(`${BASE_URL}/recommendations/available-genre-seeds`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    const genres = data.genres;

}



