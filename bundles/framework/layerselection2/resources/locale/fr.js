Oskari.registerLocalization(
{
    "lang": "fr",
    "key": "LayerSelection",
    "value": {
        "title": "Couches sélectionnées",
        "desc": "",
        "layer": {
            "style": "Style",
            "show": "Afficher",
            "hide": "Masquer",
            "hidden": "La couche cartographique est temporairement masquée.",
            "out-of-scale": "La couche cartographique ne peut être affichée à ce niveau d’échelle.",
            "move-to-scale": "Veuillez choisissez un niveau d'échelle adapté.",
            "out-of-content-area": "La couche cartographique ne contient aucune donnée à cet emplacement.",
            "move-to-content-area": "Veuillez vous déplacer sur un emplacement adapté.",
            "description": "Description",
            "object-data": "Données d'entité",
            "rights": {
                "notavailable": "Publication interdite.",
                "guest": "Veuillez vous identifier pour publier la couche cartographique dans une carte intégrée.",
                "loggedin": "Publication autorisée",
                "official": "Publication autorisée uniquement pour une utilisation par les autorités.",
                "need-login": "Vous devez vous identifier pour publier le niveau de carte dans une carte intégrée.",
                "can_be_published_by_provider": {
                    "label": "Publication autorisée en tant que fournisseur de données",
                    "tooltip": "Seul le fournisseur de données peut publier la couche cartographique dans une carte intégrée.  Si vous être fournisseur de données, veuillez contacter le service d’assistance de Paikkatietoikkuna."
                },
                "can_be_published": {
                    "label": "Publication autorisée",
                    "tooltip": "La couche cartographique peut être publiée dans une carte intégrée. La limite de l’utilisation n’est pas limitée."
                },
                "can_be_published_map_user": {
                    "label": "Publication autorisée",
                    "tooltip": "La couche cartographique peut être publiée dans une carte intégrée. La limite de l’utilisation peut être limitée."
                },
                "no_publication_permission": {
                    "label": "Publication interdite.",
                    "tooltip": "Les couches cartographiques ne peuvent pas être publiées dans une carte intégrée. Le fournisseur de données n’a pas autorisé cela."
                },
                "can_be_published_by_authority": {
                    "label": "Publication autorisée",
                    "tooltip": "La couche cartographique peut être publiée dans une carte intégrée. La limite de l’utilisation n’est pas limitée."
                }
            },
            "tooltip": {
                "type-base": "Carte d’arrière-plan",
                "type-wms": "Couche cartographique",
                "type-wfs": "Produit des données"
            },
            "refresh_load": {
                "tooltip": "Rafraichir les données de la couche cartographique. Les données ne sont pas automatiquement mises à jour sur la carte."
            },
            "filter": {
                "title": "Filtre",
                "description": "Sélectionnez les entités depuis la couche cartographique :",
                "cancelButton": "Annuler",
                "clearButton": "Effacer le filtre",
                "refreshButton": "Rafraîchir le filtre",
                "addFilter": "Ajouter un nouveau filtre",
                "removeFilter": "Supprimer le filtre",
                "bbox": {
                    "title": "Filtre de la fenêtre de la carte",
                    "on": "Uniquement l'entité visible sur la fenêtre de la carte.",
                    "off": "Toutes les entités"
                },
                "clickedFeatures": {
                    "title": "Filtre de sélection d'entité",
                    "label": "Uniquement les entités sélectionnées sur la carte."
                },
                "values": {
                    "title": "Filtrer les entités par données attributaires",
                    "placeholders": {
                        "case-sensitive": "Le filtre est sensible à la casse.",
                        "attribute": "Attribut",
                        "boolean": "Opérateur logique",
                        "operator": "Opérateur",
                        "attribute-value": "Valeur"
                    },
                    "equals": "est égal(e) à",
                    "like": "est comme",
                    "notEquals": "n’est pas égal(e) à",
                    "notLike": "est différent(e) de",
                    "greaterThan": "est supérieur(e) à",
                    "lessThan": "est inférieur(e) à",
                    "greaterThanOrEqualTo": "est supérieur(e) ou égal(e) à",
                    "lessThanOrEqualTo": "est inférieur(e) ou égal(e) à"
                },
                "aggregateAnalysisFilter": {
                    "addAggregateFilter": "Sélectionnez la valeur globale",
                    "aggregateValueSelectTitle": "Utilisez la valeur globale dans le filtre",
                    "selectAggregateAnalyse": "Sélectionnez l’analyse globale",
                    "selectIndicator": "Sélectionnez l’indicateur",
                    "selectReadyButton": "Prêt",
                    "getAggregateAnalysisFailed": "Impossible de trouver les données agrégées.",
                    "noAggregateAnalysisPopupTitle": "Valeurs statistiques non trouvées",
                    "noAggregateAnalysisPopupContent": "Vous n’avez réalisé aucune analyse agrégée. Vous pouvez créer vos propres données globales par la fonction d'analyse puis utiliser des valeurs lors du filtrage."
                },
                "validation": {
                    "title": "Le filtre n’a pas pu être rafraîchi en raison des erreurs suivantes :",
                    "attribute_missing": "L’attribut est manquant.",
                    "operator_missing": "L’opérateur est manquant.",
                    "value_missing": "La valeur est manquante.",
                    "boolean_operator_missing": "L’opérateur logique est manquant."
                }
            }
        },
        "guidedTour": {
            "title": "Selected map layers",
            "message": "In the \"Selected map layers\" -menu you can define how the selected map layers are displayed. You can sort map layer by dragging them. You can also define opacity and for some of map layers you can also select the pre-defined style. For data products it is possible to show feature data in a tabular form. The map layer can be shown or hidden.",
            "openLink": "Show Selected map layers",
            "closeLink": "Hide Selected map layers",
            "tileText": "Selected Map Layers"
        }
    }
});