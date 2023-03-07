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
            "content": {
                "pageScale": {                    
                    "label": "Ajoutez une échelle à l'impression.",
                    "tooltip": "Ajoutez une échelle à la carte, si vous le voulez."
                },
                "pageDate": {
                    "label": "Afficher une date sur l'impression.",
                    "tooltip": "Vous pouvez afficher une date sur l'impression."
                }
            },
            "error": {
                "saveFailed": "Échec de l'impression de la vue de la carte. Réessayez plus tard."
            },
            "scale": {
                "label": "Échelle",
                "tooltip": "Préciser l'échelle à utiliser pour l'impression",
                "map": "Utiliser l'échelle de carte",
                "defined": "Sélectionner une échelle",
                "unsupportedLayersMessage": "Les couches cartographiques suivantes n'apparaissent pas dans l'impression"
            }
        },
        "StartView": {
            "info": {
                "maxLayers": "Vous pouvez utiliser au plus huit couches cartographiques pour l'impression.",
                "printoutProcessingTime": "L'impression peut prendre un certain temps si de nombreuses couches sont sélectionnées."
            }
        }
    }
});
