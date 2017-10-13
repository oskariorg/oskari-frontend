Oskari.registerLocalization(
{
    "lang": "fr",
    "key": "MyPlacesImport",
    "value": {
        "title": "Importation de jeux de données",
        "desc": "Vous pouvez importer votre propres jeux de données en fichier au format shp, gpx ou mif/mid sous forme de fichier zip ou bien au format de fichier kmz (kml compressé).",
        "tool": {
            "tooltip": "Importer votre propre jeu de données"
        },
        "flyout": {
            "title": "Importation de jeux de données",
            "description": "Vous pouvez importer votre propres jeux de données en fichier au format shp, gpx ou mif/mid sous forme de fichier zip ou bien au format de fichier kmz (kml compressé). Vous pouvez importer des fichiers contenant au maximum 5000 entités.",
            "help": "Select a file from your computer or give a link to the file that contains your dataset. The file can be in the shp, zip or kml/kmz format. You can create zip files from shapefiles by zipping the files with suffix shp, shx, dbf and prj to the same zip file. \r\nAlso kml/kmz files from Google maps can be zipped same way.\r\nMif/mid data must be in current map CRS - look current CRS under zoombar",
            "actions": {
                "cancel": "Annuler",
                "next": "Suivant"
            },
            "file": {
                "submit": "Envoyer",
                "fileOverSizeError": {
                    "title": "Error",
                    "message": "Le fichier sélectionné est trop lourd. Taille maximum autorisée : <xx> Mb.",
                    "close": "Fermer"
                }
            },
            "layer": {
                "title": "Enregistrer les informations relatives au jeu de données :",
                "name": "Nom",
                "desc": "Description",
                "source": "Source des données",
                "style": "Définitions du style de jeu de données :"
            },
            "validations": {
                "error": {
                    "title": "Erreur",
                    "message": "Le fichier n’a pas été sélectionné et la couche cartographique est manquante."
                }
            },
            "finish": {
                "success": {
                    "title": "L’importation du jeu de données s’est déroulée avec succès.",
                    "message": "Vous pouvez trouver la couche cartographique dans le menu « Mes données »."
                },
                "failure": {
                    "title": "L’importation du jeu de données a échoué. Veuillez réessayer plus tard."
                }
            }
        },
        "tab": {
            "title": "Jeux de données",
            "grid": {
                "name": "Nom",
                "description": "Description",
                "source": "Source des données",
                "remove": "Supprimer",
                "removeButton": "Supprimer"
            },
            "confirmDeleteMsg": "Souhaitez-vous supprimer le jeu de données \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Annuler",
                "delete": "Supprimer"
            },
            "notification": {
                "deletedTitle": "Suppression du jeu de données",
                "deletedMsg": "Ce jeu de données a été supprimé."
            },
            "error": {
                "title": "Erreur !",
                "generic": "Une erreur système s’est produite. Veuillez réessayer plus tard."
            }
        },
        "layer": {
            "organization": "Jeux de données personnels",
            "inspire": "Jeux de données personnels"
        }
    }
});
