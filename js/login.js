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
    url += "&scope=user-read-private user-read-email user-read-playback-state user-top-read";
    window.location.href = url;
}