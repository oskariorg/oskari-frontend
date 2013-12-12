Oskari.registerLocalization({
    "lang": "sv",
    "key": "Publisher",
    "value": {
        "title": "Definiera karta",
        "flyouttitle": "Definiera karta",
        "desc": "",
        "published": {
            "title": "Kartan har avskilts",
            "desc": "Inbädda kartan genom att tillägga HTML-koden nedan på din webbplats."
        },
        "edit": {
            "popup": {
                "title": "Den inbäddade kartan editeras",
                "msg": "Den tidigare inbäddade kartans uppgifter uppdateras"
            }
        },
        "BasicView": {
            "title": "Inbädda kartan",
            "titleEdit": "Editera inbäddad karta",
            "domain": {
                "title": "Webbsidan där kartan inbäddas",
                "label": "Webbplatsen där kartan inbäddas",
                "placeholder": "utan http- eller www-prefix",
                "tooltip": "Skriv namnet på webbplatsens hemsida dvs. domainnamn utan prefixerna http och www samt utan undersida. Exempel: minhemsida.com"
            },
            "name": {
                "label": "Kartans namn",
                "placeholder": "obligatorisk uppgift",
                "tooltip": "Ge kartan ett beskrivande namn. Observera användargränssnittets språk"
            },
            "language": {
                "label": "Språk",
                "options": {
                    "fi": "Finska",
                    "sv": "Svenska",
                    "en": "Engelska"
                },
                "tooltip": "Välj språk för kartmaterial och användargränssnitt."
            },
            "size": {
                "label": "Storlek",
                "tooltip": "Välj eller definiera storleken på kartan som visas på din webbplats. Kartan förhandsvisas i den valda storleken."
            },
            "tools": {
                "label": "Verktyg",
                "tooltip": "Välj verktygen som visas på kartan. Du kan se deras placering på den förhandsvisade kartan.",
                "ScaleBarPlugin": "Skalsträcka",
                "IndexMapPlugin": "Indexkarta",
                "PanButtons": "Panoreringsverktyg",
                "Portti2Zoombar": "Skalans glidreglage",
                "ControlsPlugin": "Panorering på",
                "SearchPlugin": "Adress- och ortnamnssökning",
                "GetInfoPlugin": "Verktyg för förfrågan som gäller uppgifter om objektet",
                "PublisherToolbarPlugin": "Kartverktygen"
            },
            "toolbarToolNames": {
                "history_back": "Gå bakåt",
                "history_forward": "Gå framåt",
                "measureline": "Mäta avstånd",
                "measurearea": "Mäta område"
            },
            "toollayout": {
                "label": "Verktyg applikation",
                "tooltip": "Välj en applikation för de verktyg som visas på kartan",
                "lefthanded": "Vänsterhänt",
                "righthanded": "Högerhänt"
            },
            "data": {
                "label":                "Statistik",
                "tooltip":              "Show the data related to map.",
                "grid":                 "Visa statistik bord",
                "allowClassification":  "Möjliggöra klassificering"
            },
            "layout": {
                "label": "Layout",
                "fields": {
                    "colours": {
                        "label": "Färgschema",
                        "placeholder": "Välj färgschema",
                        "buttonLabel": "Byt",
                        "light_grey": "Ljusgrå",
                        "dark_grey": "Mörkgrå",
                        "blue": "Blå",
                        "red": "Röd",
                        "green": "Grön",
                        "yellow": "Gul",
                        "custom": "Egna färger",
                        "customLabels": {
                            "bgLabel": "Etikettens bakgrundsfärg",
                            "titleLabel": "Etikettext",
                            "headerLabel": "Rubriktext",
                            "iconLabel": "Ikon",
                            "iconCloseLabel": "Mörk",
                            "iconCloseWhiteLabel": "Ljus"
                        }
                    },
                    "fonts": {
                        "label": "Välj typsnitt"
                    },
                    "toolStyles": {
                        "label": "Verktygens stil",
                        "rounded-dark": "Avrundad (mörk)",
                        "rounded-light": "Avrundad (ljus)",
                        "sharp-dark": "Kantig (mörk)",
                        "sharp-light": "Kantig (ljus)",
                        "3d-dark": "3D (mörk)",
                        "3d-light": "3D (ljus)"
                    }
                },
                "popup": {
                    "title": "Välj färgschema",
                    "close": "Stäng",
                    "gfiDialog": {
                        "title": "Förhandsgranskning",
                        "featureName": "Förhandsgranskning",
                        "featureDesc": "Valet av färgschema påverkar endast färgen på faktarutan för kartobjekt"

                    }
                }
            },
            "layers": {
                "label": "Kartlager",
                "defaultLayer": "(Förvald kartlager)",
                "useAsDefaultLayer": "Använd som förvald kartlager"
            },
            "sizes": {
                "small": "Liten",
                "medium": "Medelstor",
                "large": "Stor",
                "custom": "Definiera storlek",
                "width": "bredd",
                "height": "höjd"
            },
            "buttons": {
                "save": "Lagra",
                "saveNew": "Lagra ny",
                "ok": "OK",
                "replace": "Ersätt",
                "cancel": "Avbryt",
                "add": "lägg kartan lager"
            },
            "confirm": {
                "replace": {
                    "title": "Vill du ersätta den inbäddade kartan?",
                    "msg": "Om du ersätter kartan syns ändringarna på den inbäddade kartan genast. Du behöver inte lägga in koden på din webbsida på nytt."
                }
            },
            "layerselection": {
                "label": "Visa kartlagren i menyn",
                "info": "Välj bakgrundskartor. Du kan göra förval i förhandsgranskningsvyn.",
                "tooltip": "Bakgrundskartan syns som kartans nedersta lager. När du väljer kartan som används som bakgrundskarta syns endast ett lager i taget och du kan växla mellan dem. Du kan göra förval i förhandsgranskningsvyn.",
                "promote": "Visa flygbilder?"
            },
            "preview": "Förhandsgranskningsvy för karta som ska avskiljas och inbäddas.",
            "location": "Läge och skalnivå.",
            "zoomlevel": "Skalnivå",
            "help": "Anvisning",
            "error": {
                "title": "Fel!",
                "size": "Fel i storleksdefinitionerna",
                "domain": "Webbplatsen är en nödvändig uppgift",
                "domainStart": "Skriv webbplatsen utan prefixerna http och www",
                "name": "Namnet är en nödvändig uppgift",
                "nohelp": "Ingen anvisning",
                "saveFailed": "Avskiljandet av kartan misslyckades. Försök på nytt senare.",
                "nameIllegalCharacters": "I namnet ingår otillåtna tecken. Tillåtna är alla bokstäver i det svenska alfabetet, siffror, mellanslag och bindestreck.",
                "domainIllegalCharacters": "I webbsidans namnet ingår otillåtna tecken. Tillåtna är alla bokstäver i det svenska alfabetet, siffror, mellanslag och bindestreck."
            }
        },
        "NotLoggedView": {
            "text": "Logga in i tjänsten för att definiera en karta som ska inbäddas.",
            "signup": "Logga in",
            "signupUrl": "/web/sv/login",
            "register": "Registrera dig",
            "registerUrl": "/web/sv/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "StartView": {
            "text": "Du kan inbädda den kartvy som du definierat här på din egen eller din arbetsgivares webbplats.",
            "touLink": "Vis användningsvillkor till kartinbäddningen",
            "layerlist_title": "Kartlager som kan inbäddas",
            "layerlist_empty": "Kartlagren som du valt kan inte avskiljas. Menyn Valda kartlager visar vilka kartlager kan avskiljas.",
            "layerlist_denied": "Kan inte avskiljas",
            "denied_tooltip": "Kartdataproducenterna har inte gett publiceringstillstånd till dessa material i andra webbtjänster. Kontrollera publiceringstillståndet i menyn Valda kartlager innan du avskiljer dem.",
            "myPlacesDisclaimer": "Obs! du ska publicera din egen kartlagret.",
            "buttons": {
                "continue": "Fortsätt",
                "continueAndAccept": "Godkänn användningsvillkor och fortsätt",
                "cancel": "Tillbaka",
                "close": "Avbryt"
            },
            "tou": {
                "notfound": "Användningsvillkor kan inte hittas",
                "reject": "Avvisa",
                "accept": "Acceptera"
            }
        },
        "layer": {
            "show": "Visa",
            "hide": "Göm",
            "hidden": "Kartan är tillfälligt gömd.",
            "rights": {
                "can_be_published_map_user": {
                    "label": "Får publiceras",
                    "tooltip": "Kartlagret får publiceras i ett inbäddat kartfönster. Antalet användare per vecka kan vara begränsat."
                }
            }
        }
    }
});