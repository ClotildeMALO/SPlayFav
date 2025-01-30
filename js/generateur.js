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
        namePlaylist.value = `Top ${limit} musiques (${timeRangeString})`;
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
 * Recupère la date du jour au format FR
 * @returns date du jour au format FR
 */
function getDateTimeNow(){
    const dtNow = new Date(); 
    const day = dtNow.getDate();
    const month = dtNow.getMonth()+1;
    const year = dtNow.getFullYear();
    const dtFR = `${day}/${month}/${year}`;
    return dtFR;
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
    document.getElementById('nbTracksValue').value = 5;
    document.getElementById('rangePeriodTrack').value = 0;
    document.getElementById('topTracks').innerHTML = '';

    document.getElementById('limitReco').value = 5;
    document.getElementById('limitRecoValue').value= 5;
    document.getElementById('recoTracks').innerHTML = '';
    document.getElementById('typePlaylistTop').checked = true;

    // ajout message de confirmation
    const message = document.createElement('p');
    message.textContent = `Playlist ${namePlaylist} créée avec succès !`;
    document.getElementById('msgPlaylist').appendChild(message);


    window.scrollTo(0, 0);

}


/**
 * Recupère les musiques du top selon le timerange et la limite affiché sur la page
 * @returns id des musiques du top séparé par des virgules
 */
async function getTopId(){
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

    return topId;
}

/**
 * Récupère les musiques likées (aléatoirement)
 * @param {*} limit nombre de musiques / artistes souhaités
 * @param {*} type type de recommandation souhaité (musiques ou artistes)
 * @returns musiques / artistes aléatoires dans les titres likés
 */
async function getAleatFromLike(limit, type){
    let tracks = await getArrayLikedTracks();

    const aleatItems = [];
    if (type == 'musiques'){
        for (let i = 0; i < limit; i++){
            let aleat = Math.floor(Math.random() * tracks.length);
            aleatItems.push(tracks[aleat]);
        }
    }
    else if (type == 'artistes'){
        const artists = [];
        tracks.forEach(track => {
            artists.push(track.track.artists[0]);
        });
        for (let i = 0; i < limit; i++){
            let aleat = Math.floor(Math.random() * artists.length);
            aleatItems.push(artists[aleat]);
        }
    }
    else {
        console.error('Type de recommandation souhaité inconnu');
    }

    return aleatItems;
}
