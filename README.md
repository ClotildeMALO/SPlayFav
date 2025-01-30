Création d'un site qui récupère les données utilisateurs de Spotify (connexion via Spotify) et permet d'afficher ses données et générer une playlist à partir d'un top musique.

# Fonctionnalités 
- Récupération des 3 derniers titres likés
- Récupération de tous les titres likés
    - Directement affichés sur le site avec le nombre de titres
    - Export en csv
- Affichage des playlists : nom, lien et image de la playlist
- Affichage du top artiste
   - Choix du nombre d'artistes à afficher (entre 1 et 50)
   - Choix de l'intervalle de temps que l'on prend en compte pour le top (court terme = 4 semaines, moyen terme = 6 mois, long terme = 1 an)
- Affichage du top musique
   - Choix du nombre de musiques à afficher (entre 1 et 50)
   - Choix de l'intervalle de temps que l'on prend en compte pour le top (court terme = 4 semaines, moyen terme = 6 mois, long terme = 1 an)
- Génération d'une playlist Spotify à partir du top musique
   - Choix du nombre de musiques (entre 1 et 50)
   - Choix de l'intervalle de temps que l'on prend en compte pour le top (court terme = 4 semaines, moyen terme = 6 mois, long terme = 1 an)
   - Choix du nom de la playlist avec nom par défaut si l'on ne choisit rien = Top {nombre musique} musiques ({intervalle de temps})
   - Choix de la confidentialité de la playlist : publique ou privée
