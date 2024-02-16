Oskari.registerLocalization({
    lang: 'fr',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Ajouter',
            cancel: 'Annuler',
            close: 'Fermer',
            delete: 'Supprimer',
            edit: 'Modifier',
            save: 'Enregistrer',
            submit: 'Envoyer',
            yes: 'Oui',
            no: 'Non',
            next: 'Suivant',
            previous: 'Précédent',
            print: 'Imprimer',
            search: 'Recherche',
            reset: 'Effacer',
            copy: 'Copier dans le presse-papier',
            clear: 'Effacer',
            accept: 'Accepter',
            reject: 'Refuser',
            info: 'Afficher plus d\'informations'
        },
        table: {
            sort: {
                desc: 'Trier en ordre décroissant',
                asc: 'Trier en ordre croissant'
            }
        },
        StyleEditor: {
            subheaders: {
                pointTab: 'Ponctuelle',
                lineTab: 'Linéaire',
                areaTab: 'Surfacique'
            },
            fill: {
                color: 'Couleur de remplissage',
                area: {
                    pattern: 'Motif de remplissage'
                }
            },
            image: {
                shape: 'Icône',
                size: 'Taille',
                fill: {
                    color: 'Couleur'
                }
            },
            stroke: {
                color: 'Couleur',
                lineCap: 'Extrémités de ligne',
                lineDash: 'Tiret',
                lineJoin: 'Coins',
                width: 'Largeur',
                area: {
                    color: 'Couleur de ligne',
                    lineDash: 'Trait pointillé',
                    lineJoin: 'Coins de ligne',
                    width: 'Largeur de ligne'
                }
            }
        },
        FileInput: {
            drag: 'Faites glisser {files, plural, one {un fichier} other {fichiers}} ici ou sélectionnez en naviguant.',
            noFiles: 'Aucun fichier sélectionné.',
            error: {
                invalidType: 'Le format de fichier n\'est pas autorisé.',
                allowedExtensions: 'Extensions de fichier autorisées: {allowedExtensions}.',
                multipleNotAllowed: 'On autorise uniquement un fichier unique pour le téléchargement.',
                fileSize: 'Le fichier sélectionné est trop volumineux. Sa taille maximale doit être de {size, number} Mo.'
            }
        },
        Spin: {
            loading: 'Chargement en cours...'
        },
        coordinates: {
            lon: "Lon",
            lat: "Lat",
            n: "N",
            e: "E",
            p: "N",
            i: "E", 
            crs: {
              'EPSG:3067': "Coordonnées ETRS89-TM35FIN",
              'EPSG:3575': "Coordonnées de la projection équivalente de Lambert de l'Europe centrée sur le pôle Nord",
              'EPSG:3857': "Coordonnées WGS 84 / Pseudo-Mercator",
              default: "Coordonnées {crs}"
          },
        }
    }
});
