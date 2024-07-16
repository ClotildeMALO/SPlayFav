
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

    await loadLikedTracksPage(1, limit);// Affichage de la première page

    // Création des boutons de pagination
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';



    const button = document.createElement('button');
    button.textContent = "<";// TO DOOOOOOO

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        updateButtonStyles(); // pour 1ere page
        button.onclick = () =>{
            loadLikedTracksPage(i, limit); 
            actualPage = i;
            updateButtonStyles();
        }

        buttons.push(button); // Ajoute le bouton à la liste
        paginationElement.appendChild(button);
    }
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
 */
async function loadLikedTracksPage(page, limit) {
    const offset = (page - 1) * limit;

    const tracks = await getLikedTrack(offset, limit);

    const tracksListElement = document.getElementById('allLikedTracks');
    tracksListElement.innerHTML = ''; // Vide la liste actuelle

    const totalTracksHeader = document.createElement('h3');
    totalTracksHeader.textContent = `Vous avez liké ${totalTracks} titres :`;
    tracksListElement.appendChild(totalTracksHeader);
    
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
        listItem.innerHTML = track.track.name + ' par ' 
                                + track.track.artists.map(artist => artist.name).join(', ')
                                + '<br/>' + 'Album : ' + track.track.album.name ; // le join permet de regrouper si plusieurs artistes
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




