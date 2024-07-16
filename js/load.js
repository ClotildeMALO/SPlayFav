/**
 * Ajout d'événement au chargement de la page
 */
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    await getAccessToken(code);
    let token = sessionStorage.getItem('token');
    
    affichageBasicProfile();

    const likedTrack = await getLikedTrack(0, 3); // 3 derniers titres likés
    const tracksListElement = document.getElementById('likedtracks');
    affichageListeLikedTrack(likedTrack, tracksListElement);
       
        

    
});