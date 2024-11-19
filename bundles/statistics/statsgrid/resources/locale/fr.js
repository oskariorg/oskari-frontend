Oskari.registerLocalization(
{
    "lang": "fr",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Cartes thématiques",
            "search": "Données de recherche",
            "grid": "Tableau",
            "diagram": "Diagramme à barres"
        },
        "flyout": {
            "title": "Cartes thématiques"
        },
        "dataProviderInfoTitle": "Indicateurs",
        "layertools": {
            "table_icon": {
                "tooltip": "Passer aux cartes thématiques",
                "title": "Cartes thématiques"
            },
            "diagram_icon": {
                "tooltip": "Afficher les données dans le schéma",
                "title": "Schéma"
            },
            "statistics": {
                "tooltip": "Passer aux cartes thématiques",
                "title": "Statistiques"
            }
        },
        'publisher': {
            "label": "Cartes thématiques",
            "tooltip": "Afficher les cartes thématiques sur la carte.",
            "grid": "Afficher les données thématiques dans le tableau",
            "allowClassification": "Permettre la classification",
            "transparent": "Établir l'arrière-plan transparent de la classification",
            "diagram": "Afficher les schémas",
            "statistics": "Données de recherche"
        },
        "panels": {
            "newSearch": {
                "title": "DONNÉES DE RECHERCHE",
                "seriesTitle": "Série chronologique",
                "datasourceTitle": "Source des données",
                "indicatorTitle": "Indicateur",
                "regionsetTitle": "Filtre de division régionale (facultatif)",
                "seriesLabel": "Obtenir des données en tant que série chronologique",
                "selectDatasourcePlaceholder": "Sélectionner la source des données",
                "selectIndicatorPlaceholder": "Sélectionner les données",
                "selectRegionsetPlaceholder": "Sélectionner le jeu de régions",
                "noResults": "Votre recherche n'a donné aucun résultat",
                "refineSearchLabel": "Veuillez préciser le contenu des données examinées",
                "refineSearchTooltip1": "Vous aurez plus d'options après avoir choisi le fournisseur de données et les données.",
                "refineSearchTooltip2": "",
                "addButtonTitle": "Obtenir le contenu des données",
                "clearButtonTitle": "Effacer",
                "defaultPlaceholder": "Sélectionner la valeur",
                "selectionValues": {
                    "sex": {
                        "placeholder": "Sélectionner le sexe",
                        "male": "Homme",
                        "female": "Femme",
                        "total": "En tout"
                    },
                    "year": {
                        "placeholder": "Sélectionner l'année"
                    },
                    "regionset": {
                        "placeholder": "Sélectionner la division de superficie"
                    }
                },
                "noRegionset": "Aucune superficie sélectionnée"
            }
        },
        "statsgrid": {
            "title": "DONNÉES DE RECHERCHE",
            "noResults": "Aucune donnée sélectionnée",
            "noValues": "Aucune valeur pour les données sélectionnées",
            "areaSelection": {
                "title": "DIVISION DE SUPERFICIE"
            },
            "orderBy": "Trier",
            "orderByAscending": "Trier en ordre croissant",
            "orderByDescending": "Trier en ordre décroissant",
            "removeSource": "Supprimer les données"
        },
        "series": {
            "speed": {
                "label": "Vitesse d'animation",
                "fast": "Rapide",
                "normal": "Normal",
                "slow": "Lent"
            }
        },
        "diagram": {
            "title": "Schéma",
            "noValue": "S/O"
        },
        "parameters": {
            "sex": "Sexe",
            "year": "Année",
            "regionset": "Superficie",
            "from": "de",
            "to": "à",
            "value": "Valeur",
            "region": "Région"
        },
        "datatable": "Tableau",
        "published": {
            "showMap": "Afficher la carte",
            "showTable": "Afficher le tableau"
        },
        "classify": {
            "classify": "Classification",
            "labels": {
                "method": "Méthode de classification",
                "count": "Division de catégories",
                "mode": "Séparations de catégories",
                "mapStyle": "Style de carte",
                "type": "Distribution",
                "reverseColors": "Passer d'une couleur à l'autre",
                "color": "Couleur",
                "colorset": "Couleurs",
                "pointSize": "Force du corps",
                "transparency": "Transparence",
                "showValues": "Afficher les valeurs",
                "fractionDigits": "Décimales"
            },
            "methods": {
                "jenks": "Intervalles naturels",
                "quantile": "Quantiles",
                "equal": "Untervalles égaux"
            },
            "manual": "Classification manuelle des intervalles",
            "manualPlaceholder": "Séparer les valeurs avec des virgules.",
            "manualRangeError": "Les séparations de catégories sont erronées. Elles doivent être entre {min} et {max}. Séparer les valeurs avec des virgules. Utiliser le signe décimal comme délimiteur. Corriger les séparations de catégories et réessayer.",
            "nanError": "La valeur saisie n'est pas un chiffre. Corriger la valeur et recommencer. Utiliser le signe décimal comme délimiteur.",
            "infoTitle": "Classification manuelle des intervalles",
            "info": "Saisir les séparations de catégories en tant que chiffres séparés par une virgule. Utiliser le signe décimal comme délimiteur. Par exemple, en saisissant \"0, 10.5, 24, 30.2, 57, 73.1\", on  obtient cinq catégories dont les valeurs se trouvent entre \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" et \"57-73,1\". Les valeurs d'indicateur qui sont plus petites que la séparation de catégorie la plus basse (dans l'exemple précédent 0) ou plus grandes que la séparation de catégorie la plus élevée (73,1) ne sont pas affichées dans la carte. Les séparations de catégories doivent être entre la valeur la plus basse et la plus élevée de l'indicateur.",
            "modes": {
                "distinct": "En continu",
                "discontinuous": "En discontinu"
            },
            'edit': {
                'title': 'Modifier la classification',
                'open': 'Ferme l\'éditeur de classification',
                'close': 'Ouvrir l\'éditeur de classification'
            },
            "classifyFieldsTitle": "Valeurs de classification",
            "mapStyles": {
                "choropleth": "Carte choroplèthe",
                "points": "Carte par symboles"
            },
            "pointSizes": {
                "min": "Minimum",
                "max": "Maximum"
            },
            "types": {
                "seq": "Quantitative",
                "qual": "Qualitative",
                "div": "Divergente"
            }
        },
        "errors": {
            "title": "Erreur",
            "indicatorListError": "Une erreur est survenue lors de la recherche du fournisseur de données.",
            "indicatorListIsEmpty": "La liste de données du fournisseur de données est vide.",
            "indicatorMetadataError": "Une erreur est survenue lors de la recherche des sélections de données.",
            "indicatorMetadataIsEmpty": "Il n'y a pas de sélection pour les données.",
            "regionsetsIsEmpty": "Impossible d'aller chercher les sélections de superficie pour les données choisies.",
            "regionsDataError": "Une erreur est survenue lors de la recherche des valeurs de superficie.",
            "regionsDataIsEmpty": "Impossible d'aller chercher les valeurs de superficie pour les données choisies.",
            "datasourceIsEmpty": "Le champ Source de données est vide.",
            "cannotDisplayAsSeries": "Impossible d'analyser l'indicateur en tant que série.",
            "noActiveLegend": "Aucune donnée sélectionnée. Veuillez sélectionner les données pour voir la classification de la carte.",
            "noEnough": "Les données sont trop petites pour être classifiées. Veuillez essayer des données différentes ou modifier les limites.",
            "noData": "Les données ne sont pas accessibles pour le moment précis sélectionné.",
            "cannotCreateLegend": "Impossible de créer la légende à l'aide des  valeurs choisies. Veuillez essayer des valeurs différentes."
        },
        "datacharts": {
            "flyout": "Données recherchées",
            "barchart": "Diagramme à barres",
            "linechart": "Diagramme à ligne brisée",
            "table": "Tableau",
            "desc": "Tableau et graphiques",
            "nodata": "Les indicateurs n'ont pas été choisis",
            "indicatorVar": "La variable sera affichée dans le graphique",
            "descColor": "Couleur du graphique",
            "selectClr": "Couleur sélectionnée",
            "clrFromMap": "Couleurs par classification dans la carte",
            "chooseColor": "Sélectionner la couleur",
            "sorting": {
                "desc": "Ordre",
                "name-ascending": "Nom en ordre croissant",
                "name-descending": "Nom en ordre décroissant",
                "value-ascending": "Valeur en ordre croissant",
                "value-descending": "Valeur en ordre décroissant"
            }
        },
        "filter": {
            "title": "Filtrage",
            "indicatorToFilter": "Variable à filtrer",
            "condition": "Condition",
            "value": "Valeur",
            "variable": "Variable",
            "conditionPlaceholder": "Sélectionner la condition",
            "greater": "est supérieur(e) à (>)",
            "greaterEqual": "est supérieur(e) ou égal(e) à (>=)",
            "equal": "est égal(e) à (=)",
            "lessEqual": "est inférieur(e) ou égal(e) à (<=)",
            "lessThan": "est inférieur(e) à (<)",
            "between": "Entre (exclusif)",
            "filter": "Filtrer les valeurs",
            "desc": "Filtrer par valeur",
            "filtered": "Valeurs filtrées",
            "area": "Filtrer par superficie"
        },
        "layer": {
            "name": "Division par superficie de la carte thématique",
            "inspireName": "Carte thématique",
            "organizationName": "Carte thématique"
        },
        "tab": {
            "title": "Indicateurs",
            "edit": "Modifier",
            "delete": "Supprimer",
            "grid": {
                "name": "Nom",
                "edit": "Modifier",
                "delete": "Supprimer"
            },
            "popup": {
                "deletetitle": "Supprimer l'indicateur",
                "deletemsg": "Vous supprimez l'indicateur \"{name}\". Souhaitez-vous supprimer l'indicateur?",
            }
        },
        "userIndicators": {
            "title": "Mes indicateurs",
            "add": "Ajouter un nouvel indicateur",
            "edit": "Indicateur de modification",
            "notLoggedInWarning": "Sans ouverture de session, impossible d'enregistrer les données, qui seront uniquement accessibles jusqu'à ce que la page soit rechargée. Ouvrir une session avant d'ajouter l'indicateur pour conserver les données.",
            "info": {
                "title": "Données de l'indicateur",
                "name": "Nom",
                "description": "Description",
                "source": "Source de données"
            },
            "datasets": {
                "title": "Données statistiques"
            },
            "import": {
                "title": "Importation à partir du presse-papiers",
                "placeholder": "Saisir les données de l'indicateur ici. Chaque rangée doit contenir une région et sa valeur. Saisir le nom ou l'identifiant de la région. Utiliser le point-virgule en tant que délimiteur. On peut importer les données dans les formats suivants : \nExemple 1 : Helsinki;1234 \nExample 2 : 011;5678"
            },
            "success": {
                "indicatorSave": "Les données ont été enregistrées",
                "indicatorDelete": "Indicateur supprimé",
                "datasetSave": "Les données ont été enregistrées"
            },
            "error": {
                "indicatorSave": "Erreur lors de l'enregistrement de l'indicateur",
                "indicatorDelete": "L'indicateur n'a pas été supprimé",
                "indicatorNotfound": "Impossible de trouver l'indicateur",
                "datasetSave": "Erreur lors de l'enregistrement du jeu de données",
                "datasetDelete": "Erreur lors de la suppression du jeu de données"
            },
            'validate': {
                "year": "Le champ Année ne peut pas être vide.",
                "regionset": "Le champ Sélection de la région ne peut pas être vide."
            }
        }
    }
});
