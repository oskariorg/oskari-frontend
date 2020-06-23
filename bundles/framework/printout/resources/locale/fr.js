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
                "options": {
                    "A4": "A4 portrait",
                    "A4_Landscape": "A4 paysage",
                    "A3": "A3 portrait",
                    "A3_Landscape": "A3 paysage"
                }
            },
            "preview": {
                "label": "Aperçu",
                "pending": "L'aperçu va être mis a jour sous peu.",
                "notes": {
                    "extent": "Vérifiez l'emprise de la carte sur l'aperçu."
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
                "options": {
                    "png": "Image PNG",
                    "pdf": "Document PDF"
                }
            },
            "mapTitle": {
                "label": "Titre de la carte",
                "tooltip": "Ajoutez un titre à la carte."
            },
            "content": {
                "pageLogo" : {
                    "label": "Afficher le logo du géoportail finlandais Paikkatietoikkuna sur l'impression.",
                    "tooltip": "Vous pouvez cacher le logo du géoportail finlandais Paikkatietoikkuna si nécessaire."
                },
                "pageScale": {                    
                    "label": "Ajoutez une échelle à l'impression.",
                    "tooltip": "Ajoutez une échelle à la carte, si vous le voulez."
                },
                "pageDate": {
                    "label": "Afficher une date sur l'impression.",
                    "tooltip": "Vous pouvez afficher une date sur l'impression."
                }
            },
            "help": "Aide",
            "error": {
                "title": "Erreur",
                "size": "Erreur dans les définitions de tailles",
                "name": "Le nom est requis",
                "nohelp": "Aucune aide disponible",
                "saveFailed": "Échec de l'impression de la vue de la carte. Réessayez plus tard.",
                "nameIllegalCharacters": "Le nom contient des caractères non-autorisés. Les caractères autorisés sont les lettres de a à z ainsi que å, ä et ö, les nombres, backspaces, et les traits d'union."
            },
            "scale": {
                "label": "Échelle",
                "tooltip": "Préciser l'échelle à utiliser pour l'impression",
                "map": "Utiliser l'échelle de carte",
                "defined": "Sélectionner une échelle",
                "unsupportedLayersMessage": "Les couches cartographiques suivantes n'apparaissent pas dans l'impression",
                "unsupportedLayersTitle": "L'impression n'affiche pas toutes les couches"
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
