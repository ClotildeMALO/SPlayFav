
var totalTracks = 0;
var actualPage = 1;
const buttons = [];

/**
 * Recuperation des données des titres likés de l'utilisateur
 * @returns {Promise<*>} - Les données des titres likés
 */
async function getLikedTrack(offset, limit) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/me/tracks?market=FR&limit=${limit}&offset=${offset}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    let likedtrack= [];
    if (response.status !== 200) {
        throw new Error('Erreur lors de la récupération des titres likés');
    }
    else{
        const data = await response.json();
        totalTracks = data.total;
        likedtrack = data.items;
    }

    return likedtrack;
}


/**
 * Affichage de toute la liste des titres likés avec pagination
 */
async function getAllLikedTracks() {
    const limit = 50; // Nombre max de titres par requête
    var totalPages = 0;

    if (totalTracks!=0){
        totalPages = Math.ceil(totalTracks / limit);// arrondi à l'entier supérieur
    }
    else{
        getLikedTrack(0, 1); // permet de MAJ le nombre total de titres likés en demandant le premier titre
    }

    var tracksPage = await loadLikedTracksPage(1, limit);// Affichage de la première page
    affichageLikedTracksPage(tracksPage);

    // Création des boutons de pagination
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';


    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        updateButtonStyles(); // pour 1ere page
        button.onclick = async () => {
            affichageLikedTracksPage(await loadLikedTracksPage(i, limit));
            actualPage = i;
            updateButtonStyles();
        }

        buttons.push(button); // Ajoute le bouton à la liste
        paginationElement.appendChild(button);
    }

}

/**
 * Récupère tous les titres likés dans une liste
 * @returns {Promise<*>} - Les données de tous les titres likés
 */
async function getArrayLikedTracks() {
    const limit = 50;
    var totalPages = Math.ceil(totalTracks / limit);// arrondi à l'entier supérieur
    // Recup tous les titres likés dans liste (tableau de page avec a l'intérieur tableau de promesse avec les titres sous forme de tableau)
    var allTracks = [];
    for (let i = 1; i <= totalPages; i++) {
        allTracks.push(loadLikedTracksPage(i, limit));
    }

    allTracks = await Promise.all(allTracks); // converti la liste de promesse en liste de données
    allTracks = allTracks.flat(); // regroupe en une liste de page plutot que plusieurs

    return allTracks;
}

/**
 * ! CSS ! Met à jour la classe des boutons pour le bouton de la page actuelle
 */
function updateButtonStyles() {
    buttons.forEach((button, i) => {
        if (i + 1 === actualPage) {
            button.style.backgroundColor = "var(--coloractivepage)";
        } 
        else {
            button.style.backgroundColor = "";
        }
    });
}

/**
 * Chargement et mise en forme des titres likés pour une page donnée
 * @param {* int} page 
 * @param {* int} limit 
 * @returns {Promise<*>} - Les données des titres likés pour la page
 */
async function loadLikedTracksPage(page, limit) {
    const offset = (page - 1) * limit;
    const tracks = await getLikedTrack(offset, limit);
    return tracks;
}

/**
 * Affichage des titres likés pour les pages
 * @param {*} tracks données des titres likés
 */
async function affichageLikedTracksPage(tracks){
    const totalTracksHeaderContainer = document.getElementById('totalTracksHeaderContainer');
    totalTracksHeaderContainer.innerHTML = '';
    const totalTracksHeader = document.createElement('h3');
    totalTracksHeader.id = 'totalTracksHeader';
    totalTracksHeader.textContent = `Vous avez liké ${totalTracks} titres :`;
    totalTracksHeaderContainer.appendChild(totalTracksHeader);
    
    const tracksListElement = document.getElementById('allLikedTracks');
    tracksListElement.innerHTML = ''; // Vide la liste actuelle
    affichageListeLikedTrack(tracks, tracksListElement);
}




/**
 * Met en forme les données des titres likés
 * @param {*} likedtracks titre likés
 * @param {*} elementid élément html où l'on va afficher les données
 */
function affichageListeLikedTrack(likedtracks, elementid) {
    likedtracks.forEach(track => {
        const listItem = document.createElement('li');

        const albumImage = document.createElement('img');
        if (track.track.album.images && track.track.album.images.length > 0) {
            albumImage.src = track.track.album.images[0]?.url
        } 
        else {
            albumImage.style.display = 'none'; 
        }
        albumImage.alt = track.track.album.name;

        const trackInfo = document.createElement('div');
        trackInfo.className = 'track-info';

        const trackName = document.createElement('a');
        trackName.href = track.track.external_urls.spotify;
        trackName.target = '_blank';
        trackName.textContent = track.track.name;

        const artists = document.createElement('div');
        artists.className = 'artists';
        artists.textContent = 'par ' + track.track.artists.map(artist => artist.name).join(', ');

        const album = document.createElement('div');
        album.className = 'album';
        album.textContent = 'Album: ' + track.track.album.name;

        trackInfo.appendChild(trackName);
        trackInfo.appendChild(artists);
        trackInfo.appendChild(album);

        listItem.appendChild(albumImage);
        listItem.appendChild(trackInfo);

        elementid.appendChild(listItem);
    });

}

/**
 * Met en forme les données des titres likés avec images
 * @param {*} likedtracks titre likés
 * @param {*} elementid élément html où l'on va afficher les données
 */
function affichageListeImgLikedTrack(likedtracks, elementid) {
    likedtracks.forEach(track => {
        const listItem = document.createElement('li');
        listItem.innerHTML = track.track.name + ' par '
                                + track.track.artists.map(artist => artist.name).join(', ')
                                + '<br/>' + 'Album : ' + track.track.album.name; // le join permet de regrouper si plusieurs artistes
        elementid.appendChild(listItem);
        const imgItem = document.createElement('img');
        imgItem.src = track.track.album.images[0].url;
        elementid.appendChild(imgItem);
    });

}

/**
 * Exporte les données des titres likés en csv
 */
async function exportAllLikedTracks() {
    // recup les données voulus des titres likés
    const extractedData = await extractTrackColumns();

    // recup la clé des données
    const titleKeys = Object.keys(extractedData[0]);

    // regroupe les données en un tableau
    const refinedData =[];
    refinedData.push(titleKeys);
    extractedData.forEach(item => {
        refinedData.push(Object.values(item));
    });

    // converti les données en csv
    let csvContent = ''

    refinedData.forEach(row => {
    csvContent += row.join(',') + '\n'
    })

    // télécharge le fichier csv
    const blob = new Blob([csvContent], { encoding: 'UTF-8', type: 'text/csv;charset=UTF-8;',  });
    const objUrl = URL.createObjectURL(blob)
    const link = document.createElement('a');
    link.id = 'exportallLikedTrack';
    link.href = objUrl;
    link.download = 'allLikedTrack.csv';
    link.textContent ='Exporter tous mes titres likés';
    const exportDiv= document.getElementById('export');
    exportDiv.appendChild(link);
}


/**
 * Récupère les données utiles des titres likés
 * @returns données extraites des titres likés
 */
async function extractTrackColumns() {
    const likedTracks = await getArrayLikedTracks();

    const extractedData = likedTracks.map(item => {
        return {
            track_id : item.track.id,
            track_name : item.track.name,
            track_popularity : item.track.popularity,
            duration_ms : item.track.duration_ms,
            artist_name : item.track.artists.map(artist => artist.name).join(', '),
            album_name : item.track.album.name,
            album_type : item.track.album.album_type,
            album_total_tracks : item.track.album.total_tracks
        };
    });
    return extractedData;
}



