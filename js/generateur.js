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
 * Création d'une playlist selon le type de playlist choisi
 */
function createPlaylistByType(){
    const typeChecked = document.querySelectorAll('input[name="typePlaylist"]:checked');
    console.log(typeChecked[0].value);

    switch (typeChecked[0].value){
        case 'top':
            createPlaylistTop();
            break;
        case 'reco':
            createPlaylistReco();
            break;
        case 'mix':
            createPlaylistMix();
            break;

        default:
            console.error('Type de playlist inconnu');
    }  
}

/**
 * Création d'une playlist selon les recommandations
 */
async function createPlaylistReco(){
    const limit = document.getElementById('limitReco').value;
    const tracksUri = [];
    const tracks = await getRecommandation(limit);
    tracks.forEach(track => {
        tracksUri.push(track.uri);
    });

    const namePlaylist = document.getElementById('playlistName');
    if (namePlaylist.value == ''){
        namePlaylist.value = `Playlist recommandée selon top`;
    }

    const visibility = document.getElementById('visibilityPublic').checked; 

    createPlaylist(tracksUri, namePlaylist.value, visibility);
}

/**
 * Création d'une playlist mixant top et recommandations
 */
async function createPlaylistMix(){
    const limit = parseInt(document.getElementById('rangeNbTracks').value) + parseInt(document.getElementById('limitReco').value);
    const limitReco = document.getElementById('limitReco').value;

    const limitTop = document.getElementById('rangeNbTracks').value;
    const timerange = document.getElementById('rangePeriodTrack').value;

    const tracksUri = [];
    const tracksTop = await onlyGetTopTrack(timerange, limitTop);
    tracksTop.forEach(track => {
        tracksUri.push(track.uri);
    });

    const tracksReco = await getRecommandation(limitReco);
    tracksReco.forEach(track => {
        tracksUri.push(track.uri);
    });

    const namePlaylist = document.getElementById('playlistName');
    if (namePlaylist.value == ''){
        namePlaylist.value = `Playlist mix top et recommandations`;
    }

    const visibility = document.getElementById('visibilityPublic').checked; 

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

    document.getElementById('limitReco').value = 5;
    document.getElementById('recoTracks').innerHTML = '';
    document.getElementById('typePlaylistTop').checked = true;

    // ajout message de confirmation
    const message = document.createElement('p');
    message.textContent = `Playlist ${namePlaylist} créée avec succès !`;
    document.getElementById('msgPlaylist').appendChild(message);

}


/**
 * Récupère les recommandations de musiques selon top musique sur la page (marché FR)
 * @param {*} type type de recommandation (topTrack ou topArtist)
 * @param {*} limit nombre de recommandations
 * @returns musiques recommandées
 */
async function getRecommandation(limit){
    const market = 'FR';
    // Recupere les musiques du top à partir des éléments de la page
    const timerangeTop = document.getElementById('rangePeriodTrack').value;
    const limitTop = document.getElementById('rangeNbTracks').value;
    let tracksTop = await onlyGetTopTrack(timerangeTop, limitTop);


    // Si le top est supérieur à 5, on prend 5 musiques aléatoires
    if (limitTop > 5) { 
        tracksAleat = [];
        for (let i = 0; i < 5; i++) {
            let aleat = Math.floor(Math.random() * limitTop);
            tracksAleat.push(tracksTop[aleat]);
        }
        tracksTop = tracksAleat;
    }

    let topId = tracksTop.map(track => track.id).join(',');

    // Recupere les musiques recommandées
    let token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/recommendations?limit=${limit}&market=${market}&seed_tracks=${topId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    return data.tracks;
}

/**
 * Affiche les recommandations de musiques
 * @param {*} limit limite de recommandations
 */
async function affichageRecommandation(limit){
    const tracksReco = await getRecommandation(limit);
    const recommandationElement = document.getElementById('recoTracks');
    recommandationElement.innerHTML = ''; // Vide la liste actuelle

    const recommandationHeader = document.createElement('h3');
    recommandationHeader.textContent = `Mes ${limit} recommandations de musiques :`;
    recommandationElement.appendChild(recommandationHeader);
    console.log(tracksReco);

    affichageListeTracks(tracksReco, recommandationElement, 'générateur');
    makeVisibleTop();


}
