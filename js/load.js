/**
 * Ajout d'événement au chargement de la page
 */
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');


    let token = sessionStorage.getItem('token');
    if (!token) {
        if (code) {
            token = await getAccessToken(code);
            console.log("token : " + token);
        } 
        else {
            token = await refreshAccessToken();
            console.log("token refresh: " + token);
        }
    }
    


    
    affichageBasicProfile();

    const likedTrack = await getLikedTrack(0, 3); // 3 derniers titres likés
    const tracksListElement = document.getElementById('likedtracks');
    affichageListeImgLikedTrack(likedTrack, tracksListElement);

    exportAllLikedTracks();
});