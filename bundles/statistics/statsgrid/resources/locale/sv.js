Oskari.registerLocalization({
    'lang': 'sv',
    'key': 'StatsGrid',
    'value': {
        'tile': {
            'title': 'Tematiska kartor',
            'search': 'Materialsökning',
            'grid': 'Tabell',
            'diagram': 'Stapeldiagram'
        },
        'flyout': {
            'title': 'Tematiska kartor'
        },
        'dataProviderInfoTitle': 'Indikatorer',
        'layerTool': {
            'tooltip': 'Gå till tematiska kartor',
            'title': 'Tematiska kartor'
        },
        'publisher': {
            "label": "Statistik",
            "tooltip": "Visa kartstatistik",
            "grid": "Visa statistik",
            "allowClassification": "Tillåt klassificering",
            "transparent": "Sätt klassificeringsbakgrund genomskinlig",
            "diagram": "Visa diagram",
            "classification": "Tillåt att gömma klassificering",
            "series": "Tillåt att gömma seriespelare",
            "statistics": "Öppna materialsökning"
        },
        'panels': {
            'newSearch': {
                'title': 'SÖK DATA',
                'seriesTitle': 'Tidsserie',
                'datasourceTitle': 'Datakälla',
                'indicatorTitle': 'Datamängd',
                'regionsetTitle': 'Områdesindelning (frivillig)',
                'seriesLabel': 'Hämta som en tidsserie',
                'selectDatasourcePlaceholder': 'Välj datakälla',
                'selectIndicatorPlaceholder': 'Välj datamängd',
                'selectRegionsetPlaceholder': 'Välj områdesindelning',
                'noResults': 'Inga sökresultat hittades med',
                'refineSearchLabel': 'Precisera innehållet av datamängden du önskar att granska',
                'refineSearchTooltip1': 'Du får mera alternativ när du har först valt dataleverantören och datamängden.',
                'refineSearchTooltip2': '',
                'addButtonTitle': 'Hämta datamängdens uppgifter',
                'clearButtonTitle': 'Töm',
                'defaultPlaceholder': 'Välj värde',
                'selectionValues': {
                    'sex': {
                        'placeholder': 'Välj kön',
                        'male': 'Män',
                        'female': 'Kvinnor',
                        'total': 'Totalt'
                    },
                    'year': {
                        'placeholder': 'Välj år'
                    },
                    'regionset': {
                        'placeholder': 'Välj områdesindelning'
                    }
                },
                'noRegionset': 'Ingen områdesindelning'
            }
        },
        'statsgrid': {
            'title': 'HÄMTADE DATAMÄNGDER',
            'noResults': 'Inga valda datamängder',
            'noValues': 'Inga värden i den valda datamängden',
            'areaSelection': {
                'title': 'OMRÅDESINDELNING'
            },
            'orderBy': 'Sortera',
            'orderByAscending': 'Sortera stigande',
            'orderByDescending': 'Sortera sjunkande',
            'removeSource': 'Radera datamängd',
            'noIndicators': 'Börja användningen av tematiska kartor med att lägga till en indikator på kartan.'
        },
        'series': {
            'speed': {
                'label': 'Animeringshastighet',
                'fast': 'Snabb',
                'normal': 'Normal',
                'slow': 'Långsam'
            }
        },
        'diagram': {
            'title': 'Stapeldiagram',
            'noValue': 'Inte tillgänglig',
            'sort': {
                'desc': 'Sortera',
                'name-ascending': 'Stigande enligt namn',
                'name-descending': 'Sjunkande enligt namn',
                'value-ascending': 'Stigande enligt värde',
                'value-descending': 'Sjunkande enligt värde'
            }
        },
        'parameters': {
            'sex': 'Kön',
            'year': 'År',
            'Vuosi': 'År',
            'regionset': 'Områdesindelning',
            'from': 'från',
            'to': 'tills',
            'value': 'Värde',
            'region': 'Område'
        },
        'classify': {
            'classify': 'Klassificering',
            'labels': {
                'method': 'Klassificeringsmetod',
                'count': 'Klassfördelning',
                'mode': 'Klassgränser',
                'mapStyle': 'Kartans stil',
                'type': 'Fördelning',
                'reverseColors': 'Kasta om färgerna',
                'color': 'Färg',
                'colorset': 'Färg',
                'pointSize': 'Punktens storlek',
                'transparency': 'Opacitet',
                'showValues': 'Visa värden',
                'fractionDigits': 'Decimaltal'
            },
            'methods': {
                'jenks': 'Naturliga brytpunkter',
                'quantile': 'Kvantiler',
                'equal': 'Lika intervall',
                'manual': 'Egen klassificering'
            },
            'manual': 'Klassificering för hand',
            'manualPlaceholder': 'Avgränsa tal med kommatecken.',
            'manualRangeError': 'Klassgränserna är felaktiga. Klassgränserna bör vara mellan {min} - {max}. Avgränsa tal med kommatecken. Använd punkt som decimaltecken. Rätta till klassgränserna och försök igen.',
            'nanError': 'Det givna värdet är ej ett tal. Rätta till värdet och försök igen. Använd punkt som decimaltecken.',
            'infoTitle': 'Klassificering för hand',
            'info': 'Ange klassgränserna som tal avgränsade med kommatecken. Använd punkt som decimaltecken. Till exempel genom att mata in "0, 10.5, 24, 30.2, 57, 73.1" skapas fem klasser med värden mellan "0-10,5", "10,5-24", "24-30,2", "30,2-57" och "57-73,1". Indikatorvärden, som är mindre än den lägsta klassgränsen (0 i exemplet) eller större än den högsta klassgränsen (73,1), visas inte på kartan. Klassgränserna bör vara mellan det minsta och största värdet.',
            'modes': {
                'distinct': 'Kontinuerlig',
                'discontinuous': 'Diskontinuerlig'
            },
            'edit': {
                'title': 'Redigera klassificeringen',
                'open': 'Öppna klassificeringseditoraren',
                'close': 'Stägn klassificeringseditoraren'
            },
            'classifyFieldsTitle': 'Klassificeringsvärden',
            'mapStyles': {
                'choropleth': 'Koropletkarta',
                'points': 'Karta med punktsymboler'
            },
            'pointSizes': {
                'min': 'Minimum',
                'max': 'Maximum',
            },
            'types': {
                'seq': 'Kvantitativ',
                'qual': 'Kvalitativ',
                'div': 'Uppdelad'
            }
        },
        'errors': {
            'title': 'Fel',
            'indicatorListError': 'Ett fel uppstod vid sökningen av dataleverantören.',
            'indicatorListIsEmpty': 'Dataleverantörens lista av datamängder är tom.',
            'indicatorMetadataError': 'Ett fel uppstod vid sökningen av datamängder.',
            'indicatorMetadataIsEmpty': 'Inga datamängder har valts.',
            'regionsetsIsEmpty': 'Områdesindelningarna kunde inte hämtas för den valda datamängden.',
            'regionsDataError': 'Ett fel uppstod vid sökningen av områdets värden.',
            'regionsDataIsEmpty': 'Områdenas värden kunde inte ges till de valda datamängderna.',
            'datasourceIsEmpty': 'Datakällan är tom.',
            'cannotDisplayAsSeries': 'Indikatorn kan inte inspekteras som en serie.',
            'noDataForIndicators': 'Tjänsten returnerade ingen data för {indicators, plural, one {indikatorn} other {indikatorer}}',
            'onlyPartialDataForIndicators': 'Tjänsten returnerade inte alla data för {indicators, plural, one {indikatorn} other {indikatorer}}',
            'noActiveLegend': 'Inga valda datamängder, välj datamängd för att se kartans klassificering.',
            'notAllowedRegionset': 'Ingen data vid den valda områdesindelning.',
            'notAllowedSelection': 'Ingen data vid den valda datamängden.',
            'noEnough': 'Datamängden är för liten för att klassificeras, försök en annan datamängd eller avgränsning.',
            'noData': 'Ingen data vid den valda tidspunkten.',
            'cannotCreateLegend': 'Teckenförklaringen kan inte skapas utgående från de valda värden, vänligen försök andra värden.'
        },
        'missing': {
            'regionsetName': 'Okänd',
            'indicator': 'Okänd indikator'
        },
        'layer': {
            'name': 'Områdesindelning av tematiska kartan',
            'inspireName': 'Tematisk karta',
            'organizationName': 'Tematisk karta'
        },
        'tab': {
            'title': 'Indikatorer',
            'confirmDelete': 'Vill du ta bort indikatorn "{name}"?',
            'grid': {
                'name': 'Namn',
                'actions': 'Handlingar',
                'createDate': 'Skapad',
                'updateDate': 'Uppdaterad',
            }
        },
        'userIndicators': {
            'title': 'Mina indikatorer',
            'add': 'Skapa indikator',
            'edit': 'Redigera indikator',
            'notLoggedInWarning': 'Som utloggad användare kommer de skapade indikatorerna kunna användas endast under denna session. Logga in för att spara indikatorerna.',
            'info': {
                'title': 'Indikatorns uppgifter',
                'name': 'Namn',
                'description': 'Beskrivning',
                'source': 'Källa'
            },
            'datasets': {
                'title': 'Statistisk information',
                'dataset': 'Datamängder',
                'noIndicator': 'Spara indikatorinformation för att lägga till datamängder.',
                'noDatasets': 'Indikatorn har ingen lagrad datamängd.'
            },
            'import': {
                'title': 'Hämta från urklipp',
                'placeholder': 'Ange värden från urklippet här. En rad motsvarar ett område och dess värde. Område betäcknas med namn eller id. Separera värden med semikolon.\n' +
                'Värden kan tilläggas i följande form: \n' +
                'Exempel 1: Helsinki;1234 \n' +
                'Exempel 2: 011;5678'
            },
            'success': {
                'indicatorSave': 'Indikatorns information sparad',
                'indicatorDelete': 'Indikatorn borttagen',
                'datasetSave': 'Datamängder har sparats',
                'datasetDelete': 'Datamängder har tagits bort',
            },
            'error': {
                'indicatorSave': 'Ett fel uppstod vid sparning av egen indikator.',
                'indicatorDelete': 'Borttagning av indikatorn misslyckades',
                'indicatorNotfound': 'Indikator saknas',
                'datasetSave': 'Ett fel uppstod vid sparning av data',
                'datasetDelete': 'Ett fel uppstod vid radering av data.'
            },
            'validate': {
                'name': 'Namnfält kan inte vara tom',
                'year': 'Årsfält kan inte vara tom',
                'regionset': 'Områdesindelning kan inte vara tom',
                'noData': 'Datamängder har inga värden',
                'invalidData': 'Datamängder har ogiltiga värden',
            }
        },
        'indicatorList': {
            'title': 'Indikator',
            'removeAll': 'Ta bort alla',
            'emptyMsg': 'Inga valda indikatorer'
        },
        'metadataPopup': {
            'open': 'Visa {indicators, plural, one {indikator beskrivning} other {indikator beskrivningar}}',
            'title': '{indicators, plural, one {Indikator beskrivning} other {Indikator beskrivningar}}',
            'noMetadata': 'Tjänsten returnerade ingen beskrivning för {indicators, plural, one {indikatorn} other {indikatorer}}.',
            'updated': 'Senast uppdaterad',
            'nextUpdate': 'Nästa uppdatering'
        }
    }
});
