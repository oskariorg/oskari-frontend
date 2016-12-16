Oskari.registerLocalization(
{
    "lang": "nb",
    "key": "Publisher",
    "value": {
        "title": "Publisering av kart",
        "flyouttitle": "Lag 'embedded' kart",
        "desc": "",
        "published": {
            "title": "Kart for 'embedding' er laget",
            "desc": "Kartet er laget. 'Embed' kartet ved å legge inn HTML-koden under i din nettsted, og du har kartet på nettstedet"
        },
        "edit": {
            "popup": {
                "title": "Åpner 'embedded' kart for redigering",
                "msg": "Oppdaterer data for kart som er 'embedded' tidligere"
            }
        },
        "BasicView": {
            "title": "Legg til kartet",
            "titleEdit": "Tilpass det 'embedded' kartet",
            "domain": {
                "title": "Nettsted",
                "label": "Nettsted for 'embedded' kart",
                "placeholder": "Nettadresse uten http eller www",
                "tooltip": "Oppgi domenenavn for nettstedet (url uten http, www eller underadresse), for eksempel: homepage.com."
            },
            "name": {
                "label": "Kartnavn",
                "placeholder": "påkrevd",
                "tooltip": "Gi kartet et beskrivende navn. Merk at navnet skal være på samme språk som brukergrensesnittet."
            },
            "language": {
                "label": "Språk",
                "options": {
                    "fi": "Finsk",
                    "sv": "Svensk",
                    "en": "Engelsk"
                },
                "tooltip": "Velg språk for grensesnitt og data på kartet"
            },
            "size": {
                "label": "Størrelse",
                "tooltip": "Velg eller angi størrelsen på kartet som skal bygges inne på ditt nettsted. Du kan se endringer i vinduet for forhåndsvisning."
            },
            "tools": {
                "label": "Verktøy",
                "tooltip": "Velg verktøy som skal vises på kartet. Du kan se plasseringen av verktøy i vinduet for forhåndsvisning.",
                "ScaleBarPlugin": "Målestokk",
                "IndexMapPlugin": "Indekskart",
                "PanButtons": "Panoreringsverktøy",
                "Portti2Zoombar": "Zoom",
                "MyLocationPlugin": "Sentrer på brukerposisjon",
                "ControlsPlugin": "Panorér kartet",
                "SearchPlugin": "Adresse- og stedsnavnssøk",
                "FeaturedataPlugin": "Forekomstdata",
                "GetInfoPlugin": "Spørreverktøy for forekomster",
                "PublisherToolbarPlugin": "Kartverktøy",
                "selectDrawLayer": "Velg lag for nye forekomster"
            },
            "toolbarToolNames": {
                "history_back": "Flytt tilbake",
                "history_forward": "Flytt fremover",
                "measureline": "Mål avstand",
                "measurearea": "Mål areal",
                "drawTools": "Tegneverktøy",
                "point": "Tillat brukere å legge til punktforekomster",
                "line": "Tillat brukere å legge til linjeforekomster",
                "area": "Tillat brukere å legge til arealforekomster"
            },
            "toollayout": {
                "label": "Verktøyplassering",
                "tooltip": "Velg plassering av verktøyet på kartet",
                "lefthanded": "Venstrehånds",
                "righthanded": "Høyrehånds",
                "userlayout": "Egendefinert layout",
                "usereditmode": "Start redigering",
                "usereditmodeoff": "Avslutt editering"
            },
            "data": {
                "label": "Statistikk",
                "tooltip": "Vis kartstatistikk",
                "grid": "Vis statistikk",
                "allowClassification": "Tillat klassifisering"
            },
            "layout": {
                "label": "Grafisk layout",
                "fields": {
                    "colours": {
                        "label": "Fargetabell",
                        "placeholder": "Velg fargetabell",
                        "buttonLabel": "Velg",
                        "light_grey": "Lys grå",
                        "dark_grey": "Mørk grå",
                        "blue": "Blå",
                        "red": "Rød",
                        "green": "Grønn",
                        "yellow": "Gul",
                        "custom": "Egen fargetabell",
                        "customLabels": {
                            "bgLabel": "Bakgrunnsidentifikator",
                            "titleLabel": "Tekstidentifikator",
                            "headerLabel": "Overskrift",
                            "iconLabel": "Ikon",
                            "iconCloseLabel": "Mørk",
                            "iconCloseWhiteLabel": "Lys"
                        }
                    },
                    "fonts": {
                        "label": "Font"
                    },
                    "toolStyles": {
                        "label": "Verktøystil",
                        "default": "Standard stil",
                        "rounded-dark": "Avrundet (mørk)",
                        "rounded-light": "Avrundet (lys)",
                        "sharp-dark": "Vinklet (mørk)",
                        "sharp-light": "Vinklet (lys)",
                        "3d-dark": "Tredimensjonal (mørk)",
                        "3d-light": "Tredimensjonal (lys)"
                    }
                },
                "popup": {
                    "title": "Velg fargetabell",
                    "close": "Lukk",
                    "gfiDialog": {
                        "title": "Forekomstinformasjon",
                        "featureName": "Forhåndsvisning",
                        "featureDesc": "Fargetabellen gjelder bare farge på popup-vindu for forekomstinformasjon og valg av kartlag"
                    }
                }
            },
            "layers": {
                "add": "Lag nytt lag for nye forekomster",
                "label": "Kartlag",
                "addselect": "Legg til tegning til kartet",
                "defaultLayer": "(Standard kartlag)",
                "useAsDefaultLayer": "Bruk som standard lag"
            },
            "myplaces": {
                "label": "Mitt kartlag"
            },
            "sizes": {
                "small": "Liten",
                "medium": "Medium",
                "large": "Stor",
                "fill": "Fyll område",
                "custom": "Spesialstørrelse",
                "width": "bredde",
                "height": "høyde",
                "separator": "x"
            },
            "buttons": {
                "save": "Lagre",
                "saveNew": "Lagre ny",
                "ok": "OK",
                "replace": "Bytt ut",
                "cancel": "Avbryt",
                "add": "Legg til kartlag"
            },
            "confirm": {
                "replace": {
                    "title": "Vil du bytte ut det 'embeddede' kartet?",
                    "msg": "Endringene i kartet som er 'embedded' tidligere vil vises umiddelbart på kartet. Du trenger ikke angi HTML-koden til nettstedet på ny"
                }
            },
            "layerselection": {
                "label": "Vis kartlag i menyen",
                "info": "Velg kartlag som bakgrunn.Du kan velge standard bakgrunnslag i vinduet for forhåndsvisning",
                "tooltip": "Bakgrunnen er vist i det nederste kartlaget. Kun ett kartlag kan bli vises om gangen.  Brukeren kan skifte bakgrunn dersom det er valgt flere lag. Standard kartlag kan velges i forhåndsvisningen."
            },
            "preview": "Forhåndsvisning av 'embedded' kart",
            "location": "Posisjon og zoomnivå",
            "zoomlevel": "Zoomnivå",
            "help": "Hjelp",
            "error": {
                "title": "Feil",
                "size": "Feil i definisjon av størrelser",
                "domain": "Nettsted er påkrevd",
                "domainStart": "Angi nettsted uten http og www",
                "name": "Kartvnavn er påkrevd",
                "nohelp": "Brukerveiledning er ikke tilgjengelig",
                "saveFailed": "'Embedding' av kart feilet. Vennligst prøv igjen seinere",
                "nameIllegalCharacters": "Kartnavn inneholder ugyldige tegn. Tillatte tegn er bokstavene a-z samt å, ä og ö, tall og bindestreker.",
                "domainIllegalCharacters": "Navn på nettsted inneholder ugyldige tegn. Tillatte tegn er bokstavene a-z samt å, ä og ö, tall og bindestreker."
            }
        },
        "NotLoggedView": {
            "text": "Du kan opprette 'embeddede' kart etter at du har logget inn",
            "signup": "Logg inn",
            "register": "Registrer"
        },
        "StartView": {
            "text": "Du kan lage kartet og 'embedde' det inn i ditt eget nettsted",
            "touLink": "Vis vilkår for bruk av 'embeddede' kart",
            "layerlist_title": "Kartlag som kan 'embeddes'",
            "layerlist_empty": "De valgte kartlagene kan ikke publiseres i et 'embedded' kart. Kontrollér rettighetene for publisering i menyen \"Valgte kartlag\" før du lager kartet",
            "layerlist_denied": "Kartlaget kan ikke publiseres i et 'embedded' kart",
            "denied_tooltip": "Dataprodusentene har ikke gitt tillatelse til å publisere de valgte kartlagene i et 'embedded' kart. Kontrollér rettighetene for publisering i menyen \"Valgte kartlag\" før du lager kartet",
            "myPlacesDisclaimer": "NB. Du publiserer ditt eget kartlag",
            "buttons": {
                "continue": "Fortsett",
                "continueAndAccept": "Akseptér vilkår for bruk og fortsett",
                "cancel": "Avbryt",
                "close": "Lukk"
            },
            "tou": {
                "notfound": "Vilkår for bruk ble ikke funnet",
                "reject": "Avslå",
                "accept": "Aksepter"
            }
        },
        "layer": {
            "show": "Vis",
            "hide": "Skjul",
            "hidden": "Kartlaget er midlertidig skjult",
            "selectAsBaselayer": "Bakgrunnskartlag"
        },
        "layerFilter": {
            "buttons": {
                "publishable": "Kan publiseres"
            },
            "tooltips": {
                "publishable": "Vis kun kartlag som kan publiseres"
            }
        }
    }
});
