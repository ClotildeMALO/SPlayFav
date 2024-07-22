let clicPlaylist = false;

/**
 * Recupère les playlists
 * @returns playlists de l'utilisateur
 */
async function onlyGetActualPlaylists(){
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/me/playlists`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    const playlists = data.items;
    return playlists;
}


/**
 * Récupération des playlists de l'utilisateur + affichage
 */
async function getActualPlaylists(){
    const playlists = await onlyGetActualPlaylists();

    const playlistsElement = document.getElementById('actualplaylists');
    playlistsElement.innerHTML = ''; // Vide la liste actuelle
    affichagePlaylist(playlists, playlistsElement);
    
    clicPlaylist = true;

    if (clicPlaylist){
        const button = document.getElementById('actualplaylist');
        button.textContent = 'Cacher mes playlists';
        button.onclick = function(){
            playlistsElement.innerHTML = '';
            clicPlaylist = false;
            button.textContent = 'Voir mes playlists';
            button.onclick = function(){
                getActualPlaylists();
            }
        }
    }
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
