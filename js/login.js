const AUTHORIZE = 'https://accounts.spotify.com/authorize';

var client_id = '***REMOVED***';
var client_secret = '***REMOVED***';
var redirect = 'http://localhost:5500/home.html';


function authorize(){
    let url = AUTHORIZE;
    url += '?client_id=' + client_id ;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect);
    url += "&show_dialog=true";
    url += "&scope=playlist-read-private user-top-read user-library-read playlist-modify-public playlist-modify-private user-library-modify";
    window.location.href = url;
}

async function getAccessToken(code) {
    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect
        })
    });

    const data = await response.json();
    const token = data.access_token;

    // Stocker le token dans sessionStorage
    sessionStorage.setItem('token', token);

    return token;
}