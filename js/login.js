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

