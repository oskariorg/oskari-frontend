Oskari.registerLocalization(
{
    "lang": "fr",
    "key": "Printout",
    "value": {
        "title": "Imprimer la vue de la carte",
        "flyouttitle": "Imprimer la vue de la carte",
        "desc": "",
        "btnTooltip": "Imprimer la vue de la carte actuelle vers une image PNG ou un fichier PDF.",
        "BasicView": {
            "title": "Imprimer la vue de la carte",
            "name": {
                "label": "Nom de la carte",
                "placeholder": "requis",
                "tooltip": "Entrez un nom pour votre impression. Attention à la langue utilisée dans les couches cartographiques."
            },
            "language": {
                "label": "Lague",
                "options": {
                    "fi": "Finnois",
                    "sv": "Suédois",
                    "en": "Anglais"
                },
                "tooltip": "Sélectionnez un nom pour votre impression. Attention à la langue utilisée dans les couches cartographiques et l'interface utilisateur."
            },
            "size": {
                "label": "Taille et direction.",
                "tooltip": "Sélectionnez une taille d'impression et une direction. Vous pouvez voir les changements dans l'aperçu de l'image.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 portrait",
                        "classForPreview": "aperçu-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_Paysage",
                        "label": "A4 paysage",
                        "classForPreview": "aperçu-paysage"
                    },
                    {
                        "id": "A3",
                        "label": "A3 portrait",
                        "classForPreview": "aperçu-portrait"
                    },
                    {
                        "id": "A3_Paysage",
                        "label": "A3 paysage",
                        "classForPreview": "aperçu-paysage"
                    }
                ]
            },
            "preview": {
                "label": "Aperçu",
                "tooltip": "Cliquez sur l'aperçu pour ouvrir une image plus grande dans une nouvelle fenêtre.",
                "pending": "L'aperçu va être mis a jour sous peu.",
                "notes": {
                    "extent": "Vérifiez l'emprise de la carte sur l'aperçu.",
                    "restriction": "L'aperçu ne montre qu'un fond de carte."
                }
            },
            "buttons": {
                "save": "Imprimer",
                "ok": "OK",
                "back": "Précédent",
                "cancel": "Annuler"
            },
            "location": {
                "label": "Emplacement et échelle",
                "tooltip": "L'échelle d'impression correspond à l'échelle utilisée pour la carte précédente.",
                "zoomlevel": "Échelle"
            },
            "settings": {
                "label": "Paramètres avancés",
                "tooltip": "Sélectionnez les paramètres de votre impression."
            },
            "format": {
                "label": "Format du fichier",
                "tooltip": "Sélectionnez le format du fichier de votre impression.",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "Image PNG"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "Document PDF"
                    }
                ]
            },
            "mapTitle": {
                "label": "Titre de la carte",
                "tooltip": "Ajoutez un titre à la carte."
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Afficher le logo du géoportail finlandais Paikkatietoikkuna sur l'impression.",
                        "tooltip": "Vous pouvez cacher le logo du géoportail finlandais Paikkatietoikkuna si nécessaire.",
                        "checked": "vérifié"
                    },
                    {
                        "id": "échellePage",
                        "label": "Ajoutez une échelle à l'impression.",
                        "tooltip": "Ajoutez une échelle à la carte, si vous le voulez.",
                        "checked": "vérifié"
                    },
                    {
                        "id": "pageDate",
                        "label": "Afficher une date sur l'impression.",
                        "tooltip": "Vous pouvez afficher une date sur l'impression.",
                        "checked": "vérifié"
                    }
                ]
            },
            "help": "Aide",
            "error": {
                "title": "Erreur",
                "size": "Erreur dans les définitions de tailles",
                "name": "Le nom est requis",
                "nohelp": "Aucune aide disponible",
                "saveFailed": "Échec de l'impression de la vue de la carte. Réessayez plus tard.",
                "nameIllegalCharacters": "Le nom contient des caractères non-autorisés. Les caractères autorisés sont les lettres de a à z ainsi que å, ä et ö, les nombres, backspaces, et les traits d'union."
            }
        },
        "StartView": {
            "text": "Vous pouvez imprimer la vue de la carte que vous venez de créer en tant qu'image PNG ou que document PDF.",
            "info": {
                "maxLayers": "Vous pouvez utiliser au plus huit couches cartographiques pour l'impression.",
                "printoutProcessingTime": "L'impression peut prendre un certain temps si de nombreuses couches sont sélectionnées."
            },
            "buttons": {
                "continue": "Continuer",
                "cancel": "Annuler"
            }
        }
    }
});
