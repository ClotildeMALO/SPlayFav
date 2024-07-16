/**
 * Récupération des informations de l'utilisateur
 * @returns informations de l'utilisateur
 */
async function getUserProfile() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/me`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    return data;
}

/**
 * Affichage des infos de base de l'utilisateur
 */
async function affichageBasicProfile(){
    const userProfile = await getUserProfile();

    const profileNameElement = document.getElementById('profilname');
    profileNameElement.textContent = `Bonjour ${userProfile.display_name}`;
    const profilePicElement = document.getElementById('profilpic');
    if (userProfile.images && userProfile.images.length > 0) {
        profilePicElement.src = userProfile.images[0].url;
    } 
    else {
        profilePicElement.style.display = 'none'; 
    }
    const profileLinkElement = document.getElementById('profillink');
    profileLinkElement.href = userProfile.external_urls.spotify;

}

        

