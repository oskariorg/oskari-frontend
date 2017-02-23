Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Tematiska kartor"
        },
        "flyout": {
            "title": "Tematiska kartor"
        },
        "layertools": {
            "table_icon": {
                "tooltip": "Gå till temakartor",
                "title": "Temakartor"
            },
            "diagram_icon": {
                "tooltip": "Visa diagram",
                "title": "Diagram"
            },
            "statistics": {
                "tooltip": "går till temakartor",
                "title": "Statistik"
            }
        },
        "panels": {
            "newSearch": {
                "title": "DATASÖKNING",
                "datasourceTitle": "Dataproducent",
                "indicatorTitle": "Datamängd",
                "selectDatasourcePlaceholder": "Välj datakälla",
                "selectIndicatorPlaceholder": "Välj datamängd",
                "noResults": "Inga sökresultat hittades med sökorden",
                "refineSearchLabel": "Förfina innehållet av den valda datamängen",
                "refineSearchTooltip1": "Du får fram fler alternativ efter att du har valt datakällan och datamändgen.",
                "refineSearchTooltip2": "",
                "addButtonTitle": "Hämta datamängdens uppgifter",
                "defaultPlaceholder": "Välj värde",
                "selectionValues": {
                    "sex": {
                        "placeholder": "Välj kön",
                        "male": "Män",
                        "female": "Kvinnor",
                        "total": "Totalt"
                    },
                    "year": {
                        "placeholder": "Välj år"
                    },
                    "regionset": {
                        "placeholder": "Välj regionindelning"
                    }
                },
                "noRegionset": "Ingen vald regionindelning"
            },
            "extraFeatures": {
                "title": "YTTERLIGA VILLKOR OCH FUNKTIONER",
                "showMapLayers": "Visa kartlager"
            }
        },
        "statsgrid": {
            "title": "SÖKTA DATAMÄNGDER",
            "noResults": "Inga valda datamändger",
            "areaSelection": {
                "title": "REGIONINDELNING",
                "info": "Omdefiniera de områden där du vill granska datamängder genom att välja från rullgardinsmenyn"
            },
            "source": "Datamängd",
            "orderBy": "Sortera",
            "orderByAscending": "Sortera stigande",
            "orderByDescending": "Sortera fallande",
            "removeSource": "Avlägsna datamängd"
        },
        "legend": {
            "title": "Klassificering",
            "noActive": "Ingen vald datamängd, välj en datamängd för att visa kartans klassificering.",
            "noEnough": "Dataset is too small for classification. Try another dataset or edit search options.",
            "cannotCreateLegend": "Cannot create legend. Try another classification options."
        },
        "parameters": {
            "sex": "Kön",
            "year": "År",
            "regionset": "Regionindelning"
        },
        "datatable": "Tabell",
        "published": {
            "showMap": "Visa karta",
            "showTable": "Show tabell"
        },
        "classify": {
            "classify": "Klassificering",
            "classifymethod": "Klassificeringsmetod",
            "classes": "Klasser",
            "methods" : {
                "jenks": "Jenks intervall",
                "quantile": "Kvantiler",
                "equal": "Lika intervall"
            },
            "manual": "Egna klasser",
            "manualPlaceholder": "Ange siffrorna, separerade med kommatecken.",
            "manualRangeError": "Klass intervallen bör vara nummer mellan {min} och {max}. Ingångs siffror separerade med kommatecken. Decimal separeras med en punkt.",
            "nanError": "Det angivna värdet är inte ett nummer. Ange ingångsklass intervall igen som siffror separerade med kommatecken. Decimal separeras med en punkt.",
            "infoTitle": "Egna klasser",
            "info": "Ange siffrorna igen separerade med kommatecken. Decimal separeras med en punkt. Till exempel genom att mata in \"\" 0, 10,5, 24, 30,2, 57, 73,1 \" får du fem klasser som har värden mellan\" 0-10,5 \",\" 10,5-24 \",\" 24-30,2 \", \"30,2-57\" ja \"57-73,1\". Om indikatorns värde är mindre än minimivärdet (0) eller större än det maximala värdet (73,1) visas det inte på kartan. Klass intervallen bör vara nummer mellan {min} och {max}.",
            "mode": "Klass intervall",
            "modes": {
                "distinct": "Kontinuerlig",
                "discontinuous": "Separat"
            },
            "editClassifyTitle": "Edit classification",
            "classifyFieldsTitle": "Classification values"
        },
        "colorset": {
            "button": "Färger",
            "flipButton": "Vänd färger",
            "themeselection": "Färgvalstema",
            "setselection": "Färgset urval",
            "seq": "Kvantitativ",
            "qual": "Kvalitativ",
            "div": "Delbar",
            "info2": "Välj färgerna genom att klicka på färggruppen",
            "cancel": "Avbryt"
        }
    }
});
