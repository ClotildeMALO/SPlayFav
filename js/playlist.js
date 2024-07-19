/**
 * Récupération des playlists de l'utilisateur
 */
async function getActualPlaylists(){
    const token = sessionStorage.getItem('token');
    console.log("getActualPlaylists token : " + token);
    const response = await fetch(`${BASE_URL}/me/playlists`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    console.log(data);
    const playlists = data.items;

    const playlistsElement = document.getElementById('actualplaylists');
    playlistsElement.innerHTML = ''; // Vide la liste actuelle
    affichagePlaylist(playlists, playlistsElement);
}

/**
 * Met en forme les données des playlist
 * @param {*} playlists liste de playlist
 * @param {*} elementid élément html où l'on va afficher les données
 */
function affichagePlaylist(playlists, elementid){
    playlists.forEach(playlist =>{
        const listItem = document.createElement('li');
        const namePlaylist = document.createElement('a');
        namePlaylist.href = playlist.external_urls.spotify;
        namePlaylist.target = '_blank';
        namePlaylist.textContent = playlist.name;
        listItem.appendChild(namePlaylist);

        const imgPlaylist = document.createElement('img');
        imgPlaylist.alt = playlist.name;
        imgPlaylist.src = playlist.images[0]?.url;
        listItem.appendChild(imgPlaylist);

        elementid.appendChild(listItem);
    })
}

// TO DO Creation d'une playlist
async function createPlaylist(userid){
    const URL = `${BASE_URL}/users/${userid}/playlists`;


}

// TO DO Ajout d'un titre à une playlist
async function addTrackToPlaylist(playlist_id) {
    const URL = `${BASE_URL}/playlists/${playlist_id}/tracks`
}

