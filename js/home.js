const TOKEN_URL = 'https://accounts.spotify.com/api/token';

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

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
        const accessToken = await getAccessToken(code);
        console.log('Access Token:', accessToken);
        // Stocke l'access token et utilise-le pour des requêtes API Spotify
    }
});
