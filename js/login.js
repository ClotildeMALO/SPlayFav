const AUTHORIZE = 'https://accounts.spotify.com/authorize';

const client_id = spotifyConfig.client_id;
const client_secret = spotifyConfig.client_secret;
const redirect = spotifyConfig.redirect;

function authorize(){
    let url = AUTHORIZE;
    url += '?client_id=' + client_id ;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect);
    url += "&show_dialog=true";
    url += "&scope=playlist-read-private user-top-read user-library-read playlist-modify-public playlist-modify-private user-library-modify";
    window.location.href = url;
}

