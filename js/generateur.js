
/**
 * Fonction qui permet de rendre visible la div playlistByTop et gère un peu son CSS
 */
function makeVisibleTop(){
    const divPlaylistByTop = document.getElementById('playlistByTop');
    divPlaylistByTop.style.display = 'flex';
    divPlaylistByTop.style.flexDirection = 'column';
    divPlaylistByTop.style.justifyContent = 'center';
    divPlaylistByTop.style.alignItems = 'center';

}

/**
 * Création d'une playlist à partir des top musiques
 */
async function createPlaylistTop(){
    const limit = document.getElementById('rangeNbTracks').value;
    const timerange = document.getElementById('rangePeriodTrack').value;

    // recupere ou donne nom playlist
    const namePlaylist = document.getElementById('playlistName');
    if (namePlaylist.value == ''){
        const timeRangeString = periodeTimeString(timerange);
        namePlaylist.value = `Top ${limit} musiques ${timeRangeString}`;
    }

    // recupere les uri des musiques du top
    const tracksUri = [];
    const tracks = await onlyGetTopTrack(timerange, limit);
    tracks.forEach(track => {
        tracksUri.push(track.uri);
    });

    // recupere visibilité de la playlist
    const visibility = document.getElementById('visibilityPublic').checked;

    // creation de la playlist
    createPlaylist(tracksUri, namePlaylist.value, visibility);
    
}


/**
 * Créé la playlist et ajoute les musiques dedans
 * @param {*} tracksUri uri des musiques à ajouter
 * @param {*} name nom de playlist
 * @param {*} visibility confidentialité (public ou privée)
 * @returns 
 */
async function createPlaylist(tracksUri, name, visibility){
    const userProfile= await getUserProfile();
    const user_id = userProfile.id;

    let token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/users/${user_id}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            name: name,
            description: '',
            public: visibility
        })
    });
    const data = await response.json();

    const dataTrack = await addTracksOnPlaylist(tracksUri, data.id);
    if (dataTrack.snapshot_id != null){
        window.open(data.external_urls.spotify);
        reinitAfterPlaylistCreate(name);
    }
    else{
        console.error('Erreur pendant l\'ajout des musiques dans la playlist');
    }


    return data;

}

/**
 * Ajoute les musiques à la playlist
 * @param {*} tracksUri liste d'uri de musiques
 * @param {*} playlistId id de la playlist dans laquelle on veut ajouter
 * @returns 
 */
async function addTracksOnPlaylist(tracksUri, playlistId){
    let token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks?uris=${tracksUri.join(',')}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    return data;
}


/**
 * Réinitialise les champs après la création de la playlist
 
 */
function reinitAfterPlaylistCreate(namePlaylist){
    document.getElementById('playlistByTop').style.display = 'none';
    document.getElementById('playlistName').value = '';
    document.getElementById('visibilityPublic').checked = true;
    document.getElementById('rangeNbTracks').value = 5;
    document.getElementById('rangePeriodTrack').value = 0;
    document.getElementById('topTracks').innerHTML = '';
    // ajout message de confirmation
    const message = document.createElement('p');
    message.textContent = `Playlist ${namePlaylist} créée avec succès !`;
    document.getElementById('msgPlaylist').appendChild(message);

}