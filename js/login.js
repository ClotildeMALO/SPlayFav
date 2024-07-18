const AUTHORIZE = 'https://accounts.spotify.com/authorize';

var client_id = '9189e6080d5b41e4b2f4c12db928cb9c';
var client_secret = 'a0bf0575757e47adb7920c676afbc43c';
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