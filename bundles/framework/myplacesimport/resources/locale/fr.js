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
            "help": "Sélectionnez un fichier de votre ordinateur ou entrez un lien vers le fichier qui contient votre jeu de données. Le fichier peut être en format shp, zip ou kml/kmz. Vous pouvez créer des fichiers zip à partir de fichiers de formes en comprimant les fichiers avec les suffixes shp, shx, dbf et prj au même fichier zip. \r\nDe plus, on peut comprimer les fichiers kml/kmz de cartes Google de la même façon.\r\nLes données Mif/mid doivent être conformes au SRC cartographique actuel - voir le SRC actuel dans la barre de zoom",
            "actions": {
                "cancel": "Annuler",
                "next": "Suivant",
                "close": "Fermer"
            },
            "file": {
                "submit": "Envoyer",
                "fileOverSizeError": {
                    "title": "Erreur",
                    "message": "Le fichier sélectionné est trop lourd. Taille maximum autorisée : <xx> Mo.",
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
            },
            "error": {
                "title": "Impossible d'importer le jeu de données.",
                "unknown_projection": "Données de projection inconnues dans le fichier d'importation d'origine. Veuillez vous assurer que tous les fichiers soient dans le système de référence des coordonnées des cartes ou vous assurer que les fichiers contiennent les renseignements nécessaires à la transformation.",
                "invalid_file": "Impossible de trouver un fichier d'importation valide dans le fichier zip. Veuillez vérifier que le format du fichier est pris en charge et qu'il s'agit d'un fichier comprimé.",
                "unable_to_store_data": "Il est impossible de stocker les données de l'utilisateur ou il n'y a pas de fonctionnalité dans les données d'entrée.",
                "short_file_prefix": "Impossible d'obtenir le jeu de fichiers d'importation - le préfixe est trop court",
                "file_over_size": "Le fichier sélectionné est trop volumineux. Il doit être d'un maximum de <xx> Mo.",
                "no_features": "Impossible de trouver les fonctionnalités dans les données d'entrée",
                "malformed": "Veuillez vous assurer que les noms de fichier sont du bon format (pas d'alphabet scandinave).",
                "kml": "Impossible de créer de jeu de données à partir du fichier KML.",
                "shp": "Impossible de créer de jeu de données à partir du fichier de formes.",
                "mif": "Impossible de créer de jeu de données à partir du fichier MIF.",
                "gpx": "Impossible de créer de jeu de données à partir du fichier GPX.",
                "timeout": "Impossible de terminer l'importation du jeu de données en raison d'une erreur de temporisation.",
                "abort": "L'importation du jeu de données a été interrompue.",
                "parsererror": "Impossible de traiter le jeu de données.",
                "generic": "L'importation du jeu de données a échoué."
            },
            "warning": {
                "features_skipped": "Attention! Pendant l'importation, <xx> fonctionnalités ont été refusées en raison de coordonnées ou de géométrie manquantes"
            }
        },
        "tab": {
            "title": "Jeux de données",
            "editLayer": "Modifier la couche cartographique",
            "deleteLayer": "Supprimer la couche cartographique",
            "grid": {
                "name": "Nom",
                "description": "Description",
                "source": "Source des données",
                "edit": "Modifier",
                "editButton": "Modifier",
                "remove": "Supprimer",
                "removeButton": "Supprimer"
            },
            "confirmDeleteMsg": "Souhaitez-vous supprimer le jeu de données \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "save": "Enregistrer",
                "cancel": "Annuler",
                "delete": "Supprimer",
                "close": "Fermer"
            },
            "notification": {
                "deletedTitle": "Suppression du jeu de données",
                "deletedMsg": "Ce jeu de données a été supprimé.",
                "editedMsg": "Le jeu de données a été actualisé."
            },
            "error": {
                "title": "Erreur !",
                "generic": "Une erreur système s’est produite. Veuillez réessayer plus tard.",
                "deleteMsg": "Échec de la suppression du jeu de données en raison d'une erreur avec le système. Veuillez réessayer plus tard.",
                "editMsg": "Échec de l'actualisation du jeu de données en raison d'une erreur avec le système. Veuillez réessayer plus tard.",
                "getStyle": "Impossible de trouver le style défini pour le jeu de données. Les valeurs par défaut sont indiquées sur le formulaire. Modifiez les définitions du style avant d'enregistrer les changements.",
                "styleName": "Donnez un nom à la couche cartographique et essayez de nouveau."
            }
        },
        "layer": {
            "organization": "Jeux de données personnels",
            "inspire": "Jeux de données personnels"
        }
    }
});
