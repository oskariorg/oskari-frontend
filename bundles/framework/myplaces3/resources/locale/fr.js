Oskari.registerLocalization(
{
    "lang": "fr",
    "key": "MyPlaces3",
    "value": {
        "title": "Lieux",
        "desc": "",
        "guest": {
            "loginShort": "Identifiez-vous pour ajouter des lieux à votre carte"
        },
        "tab": {
            "title": "Lieux",
            "nocategories": "Vous n’avez pas encore de lieux sauvegardés", // PersonalData removal
            "maxFeaturesExceeded": "Vous avez dépassé le nombre maximum de lieux. Tous les lieux n’ont pas été chargés", // PersonalData removal
            "publishCategory": {
                "privateTooltip": "Cette couche cartographique est privée. Cliquez ici pour la publier.",
                "publicTooltip": "Cette couche cartographique est publique. Cliquez ici pour la dépublier."
            },
            "addCategoryFormButton": "Nouvelle couche cartographique", // PersonalData removal
            "addCategory": "Ajouter la couche cartographique",
            "editCategory": "Modifier la couche cartographique",
            "deleteCategory": "Supprimer la couche cartographique",
            "deleteDefault": "Impossible de supprimer la couche cartographique par défaut.",
            "grid": {
                "name": "Nom du lieu",
                "desc": "Description du lieu",
                "createDate": "Créé",
                "updateDate": "Mis à jour",
                "measurement": "Taille",
                "edit": "Modifier",
                "delete": "Supprimer"
            },
            "confirm": {
                "deleteConfirm": "Souhaitez-vous supprimer la couche cartographique {name}?",
                "deleteConfirmMove": "La couche cartographique « {0} » contient {1} lieu(x). Souhaitez-vous supprimer la couche cartographique et déplacer ses lieux vers la couche cartographique par défaut « {2} » ou souhaitez-vous supprimer la couche cartographique et ses lieux.", // PersonalData removal
                "categoryToPrivate": "Vous êtes en train de dépublier la couche cartographique « {name} ». Vous ne pourrez plus partager la couche cartographique sur internet ni l’intégrer sur un autre site internet. Les autres utilisateurs de Paikkatietoikkuna ne peuvent plus visualiser la couche cartographique.",
                "categoryToPublic": "Vous êtes en train de publier la couche cartographique {name}. Puis, vous pouvez partager la couche cartographique sur internet ou l’intégrer sous la forme d’une couche cartographique sur un autre service web. De plus, d’autres utilisateurs de Paikkatietoikkuna peuvent visualiser la couche cartographique.",
                "deletePlace": "Souhaitez-vous supprimer ce lieu \"{name}\"?"
            },
            "deleteWithMove": {
                "name": "Souhaitez-vous supprimer la couche cartographique:",
                "count": "La couche cartographique contient {count} lieu(x)",
                "delete": "1. souhaitez-vous supprimer la couche cartographique et ses lieux",
                "move": "2. déplacer ses lieux vers la couche cartographique:"
            }
        },
        "tools": {
            "point": {
                "title": "Ajouter un point",
                "tooltip": "Ajouter un point à « Mes lieux ».",
                "add": "Dessiner un point en cliquant sur la carte.",
                "next": "Un lieu peut contenir un ou plusieurs points.",
                "edit": "Déplacer le point en cliquant sur celui-ci et en le faisant glisser."
            },
            "line": {
                "title": "Ajouter une ligne",
                "tooltip": "Ajouter une ligne à « Mes lieux ».",
                "add": "Dessiner une ligne en ajoutant les points d'interruption à la carte. Vous pouvez ajouter les points d'interruption en cliquant sur la carte. Arrêtez de dessiner en double-cliquant ou en cliquant sur « Enregistrer sous mes lieux ».",
                "next": "Un lieu peut contenir une ou plusieurs lignes.",
                "edit": "Modifiez la ligne en cliquant et faisant glisser ses points d'interruption.",
                "noResult": "0 m"
            },
            "area": {
                "title": "Ajouter la zone",
                "tooltip": "Ajouter une zone à « Mes lieux ».",
                "add": "Dessinez une zone en ajoutant les points d'interruption de la ligne de bordure à la carte. Vous pouvez ajouter les points de rupture en cliquant sur la carte. Arrêtez de dessiner en double-cliquant ou en cliquant sur « Enregistrer sous mes lieux ».",
                "next": "Un lieu peut contenir une ou plusieurs zones.",
                "edit": "Modifiez la zone en cliquant et faisant glisser ses points d'interruption sur sa ligne de bordure.",
                "noResult": "0 m²"
            }
        },
        "buttons": {
            "savePlace": "Enregistrer sous « mes lieux »",
            "movePlaces": "Déplacer les lieux et supprimer la couche",
            "deleteCategoryAndPlaces": "Supprimer la couche cartographique et ses lieux",
            "changeToPublic": "Publier",
            "changeToPrivate": "Dépublier"
        },
        "placeform": {
            "title": "Données de lieu",
            "tooltip": "Le lieu est enregistré dans « Mes lieux ». Vous pouvez les visualiser dans le menu « Mes données ». Veuillez fournir les données pour ce lieu. Le nom du lieu et sa description sont obligatoires. Vous pouvez également donner le texte à afficher sur la carte en plus du lieu, le lien vers le site internet pour obtenir plus d’informations sur le lieu et le lien vers l’image du lieu. Pour finir, créez une nouvelle couche cartographique ou sélectionnez en une parmi les couches cartographiques existantes sur lesquelles le lieu va être ajouté.",
            "previewLabel": "Aperçu de l’image",
            "fields": {
                "name": "Nom du lieu",
                "description": "Description du lieu",
                "attentionText": "Placer du texte sur la carte",
                "link": "Lien vers des informations relatives au lieu",
                "imagelink": "Lien vers l’image"
            },
            "category": {
                "label": "Couche cartographique",
                "newLayer": "Créez une nouvelle couche cartographique",
                "choose": "ou sélectionnez l’une de vos couches cartographiques existantes."
            },
            "validation": {
                "mandatoryName": "Le nom du lieu est manquant.",
                "invalidName": "Le nom de lieu contient des caractères non autorisés. Les caractères autorisés sont les lettres (a-z, A-Z et å, ä, ö, Å, Ä, Ö), les chiffres (0-9), la touche effacement et le tiret (-).",
                "invalidDesc": "La description du lieu contient des caractères non autorisés. Les caractères autorisés sont les lettres (a-z, A-Z et å, ä, ö, Å, Ä, Ö), les chiffres (0-9), la touche effacement et le tiret (-)."
            }
        },
        "categoryform": {
            "title": "Données de la couche cartographique",
            "layerName": "Nom de la couche cartographique",
            "styleTitle": "Style du lieu",
            "validation": {
                "mandatoryName": "Le nom de la couche cartographique est manquant.",
                "invalidName": "Le nom de la couche cartographique contient des caractères non autorisés. Les caractères autorisés sont les lettres (a-z, A-Z et å, ä, ö, Å, Ä, Ö), les chiffres (0-9), la touche effacement et le tiret (-)."
            }
        },
        "notification": {
            "place": {
                "saved": "Le lieu a été enregistré.",
                "deleted": "Le lieu a été supprimé",
                "info": "Vous trouverez le lieu dans le menu « Mes données »."
            },
            "category": {
                "saved": "La couche cartographique a été enregistrée.",
                "updated": "Les modifications sur la couche cartographique ont été enregistrées.",
                "deleted": "La couche cartographique a été supprimée."
            }
        },
        "error": {
            "generic": "Une erreur système s’est produite. Veuillez réessayer plus tard.",
            "saveCategory": "Impossible d’enregistrer la couche cartographique. Veuillez réessayer plus tard.",
            "deleteCategory": "Une erreur est survenue lors de la suppression. Veuillez réessayer plus tard.",
            "savePlace": "Impossible d’enregistrer le lieu. Veuillez réessayer plus tard.",
            "deletePlace": "Impossible de supprimer le lieu. Veuillez réessayer plus tard."
        }
    }
});
