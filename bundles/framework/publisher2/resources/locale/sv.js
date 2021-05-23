Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "Publisher2",
    "value": {
        "tile": {
            "title": "Kartpublicering"
        },
        "flyout": {
            "title": "Kartpublicering"
        },
        "published": {
            "title": "Kartan har skapats för att kunna bäddas in",
            "desc": "Karta har skapats. Bädda in kartan genom att lägga till HTML-koden nedan till din webbplats och du har kartan på din webbplats:",
            "copy": "Kopiera till klippbordet"
        },
        "edit": {
            "popup": {
                "title": "Öppna den inbäddade kartan för redigering",
                "msg": "Den tidigare inbäddade kartans uppgifter uppdateras",
                "published": {
                    "msg": "Öppnar tidigare inbäddade kartan för redigering. Var god vänta!",
                    "error": {
                        "title": "Fel",
                        "common": "Öppnande av inbäddad kartan misslyckades.",
                        "login": "Logga in för att redigera inbäddade kartan."
                    }
                }
            }
        },
        "BasicView": {
            "title": "Skapa inbäddad karta",
            "titleEdit": "Redigera den inbäddade karta",
            "transfer": {
                "label": "Överföra konfigurationen",
                "PublishTransfer": "Aktivera överföring"
            },
            "domain": {
                "title": "Webbplats",
                "label": "Begränsa inbäddning endast till följande <br>webbadress:",
                "placeholder": "Webbplats adress",
                "tooltip": "Skriv namnet på webbplatsens hemsida dvs. domainnamn utan prefixerna http och www samt utan undersida. Exempel: minhemsida.com",
                "inputWarning": "Kontrollera nätverksadressen du angav"
            },
            "name": {
                "label": "Kartans namn",
                "placeholder": "Obligatorisk uppgift",
                "tooltip": "Ge namn åt kartan. Välj språket med hänsyn till webbsidans språk."
            },
            "language": {
                "label": "Språk",
                "options": {
                    "fi": "Finska",
                    "sv": "Svenska",
                    "en": "Engelska"
                },
                "tooltip": "Välj ett språk på kartan. Språket användas på användargänsnitt och text på kartan. Obs! Valt språk visas inte på förhandsvisningskartan.",
                "languageChangedDisclaimer": "Obs! Valt språk visas inte på förhandsvisningskartan."
            },
            "size": {
                "label": "Kartstorlek",
                "tooltip": "Välj kartans storlek. Vi rekommenderar den skalbara funktionen \"Skalbar / Fyll utrymmet\". Annars skall bredden vara minst {minWidth} och högst {maxWidth} pixel, och bredden mellan {minHeight} och {maxHeight} pixel."
            },
            "maptools": {
                "label": "Verktyg",
                "tooltip": "Välj verktygen som visas på kartan. Du kan se deras placering på den förhandsvisade kartan.",
                "AnnouncementsPlugin": "Aviseringar",
                "ScaleBarPlugin": "Skalstock",
                "TimeseriesControlPlugin": "Tidseriespelare",
                "IndexMapPlugin": "Indexkarta",
                "PanButtons": "Panoreringsverktyg",
                "Portti2Zoombar": "Skalans glidreglage",
                "MyLocationPlugin": "Centrera kartan på användarens position",
                "ControlsPlugin": "Flytta kartvyn med musen",
                "SearchPlugin": "Adress- och ortnamnssökning",
                "FeaturedataPlugin": "Objektuppgifter",
                "GetInfoPlugin": "Frågverktyg för visande av objektuppgifter",
                "PublisherToolbarPlugin": "Kartverktyg",
                "selectDrawLayer": "Välj lager för nya funktioner",
                "LayerSelectionPlugin": "Kartlagermeny",
                "CoordinateToolPlugin": "Koordinatverktyg",
                "FeedbackServiceTool": "Responsverktyg (Open311)",
                "MapLegend": "Visa kartförklaringen",
                "MapRotator": "Tillåt kartrotation",
                "CrosshairTool": "Visa kartans mittpunkt",
                "CameraControls3d": "Kameraverktyg",
                "TimeControl3d": "Tidskontroll",
                "toolbarToolNames": {
                    "history": "Gå bakåt eller framåt",
                    "history_back": "Gå bakåt",
                    "history_forward": "Gå framåt",
                    "measureline": "Mät avstånd",
                    "measurearea": "Mät område",
                    "drawTools": "Ritningsverktyg",
                    "point": "Tillåt användare att lägga till punkter.",
                    "line": "Tillåt användare att lägga till linjer.",
                    "area": "Tillåt användare att lägga till områden."
                },
                "layers": {
                    "add": "Lägg till nytt lager för nya funktioner.",
                    "label": "Kartlager",
                    "addselect": "Lägg till ritningslager till kartan",
                    "defaultLayer": "(Förvalt kartlager)",
                    "useAsDefaultLayer": "Använd som förvalt kartlager."
                },
                "myplaces": {
                    "label": "Mina kartlager"
                },
                "layerselection": {
                    "info": "Välj bakgrundskartlager. Du kan göra förval i förhandsgranskningsvyn.",
                    "selectAsBaselayer": "Välj bakgrundskartlager",
                    "allowStyleChange": "Tillåta stiländring"
                },
                "mylocation": {
                    "modes": {
                        "single": "Enskild",
                        "continuous": "Fortsatt"
                    },
                    "titles": {
                        "mode": "Funktion",
                        "mobileOnly": "Tillåt funktionen endast för mobilapparater",
                        "centerMapAutomatically": "Centrera kartan till användarens plats vid start"
                    }
                }
            },
            "toollayout": {
                "label": "Verktygsplacering",
                "tooltip": "Välj placering för det verktyg som ska visas på kartan.",
                "lefthanded": "Vänsterhänt",
                "righthanded": "Högerhänt",
                "userlayout": "Anpassad layout",
                "usereditmode": "Starta redigering",
                "usereditmodeoff": "Sluta redigering"
            },
            "data": {
                "label": "Statistik",
                "tooltip": "Visa kartstatistik",
                "grid": "Visa statistik",
                "allowClassification": "Tillåt klassificering",
                "transparent": "Sätt klassificeringsbakgrund genomskinlig",
                "displayDiagram" : "Visa diagram",
                "allowHidingClassification" : "Tillåt att gömma klassificering",
                "allowHidingSeriesControl" : "Tillåt att gömma seriespelare"
            },
            "layout": {
                "label": "Grafisk layout",
                "fields": {
                    "colours": {
                        "label": "Färgschema",
                        "placeholder": "Välj färgschemat",
                        "buttonLabel": "Välj",
                        "light_grey": "Ljusgrå",
                        "dark_grey": "Mörkgrå",
                        "blue": "Blå",
                        "red": "Röd",
                        "green": "Grön",
                        "yellow": "Gul",
                        "custom": "Eget färgschema",
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
                        "label": "Typsnitt"
                    },
                    "toolStyles": {
                        "label": "Verktygens stil",
                        "default": "Förvalt utseende",
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
                        "title": "Funktionsinfo",
                        "featureName": "Förhandsgranskning",
                        "featureDesc": "Färgschemat påverkar bara färgen på popup-fönstret för faktarutan för kartobjektet och kartlagret."
                    }
                }
            },
            "sizes": {
                "small": "Liten",
                "medium": "Medelstor",
                "large": "Stor",
                "fill": "Skalbar / Fyll utrymmet",
                "custom": "Anpassad storlek",
                "width": "bredd",
                "height": "höjd",
                "separator": "x"
            },
            "buttons": {
                "save": "Spara",
                "saveNew": "Spara ny",
                "ok": "OK",
                "replace": "Ersätt",
                "cancel": "Avbryt",
                "add": "Lägg till kartlagret"
            },
            "confirm": {
                "replace": {
                    "title": "Vill du ersätta den inbäddade kartan?",
                    "msg": "Vill du uppdatera den inbäddade kartan? Förändringarna till den tidigare inbäddade kartan kommer att visas utan dröjsmål på kartan. Du behöver inte ändra html-koden på din webbplats om du inte ändrat kartans storlek."
                }
            },
            "layerselection": {
                "label": "Kartlager",
                "info": "Välj bakgrundskartlager. Du kan göra förval i förhandsgranskningsvyn.",
                "tooltip": "Bakgrundskartlagret syns som kartans nedersta lager. När du väljer kartan som används som bakgrundskarta syns endast ett lager i taget och du kan växla mellan dem. Du kan göra förval i förhandsgranskningsvyn.",
                "promote": "Vill du också visa flygbilder?"
            },
            "preview": "Den inbäddade kartans förhandsgranskningsvy",
            "location": "Läge och skalnivå.",
            "zoomlevel": "Skalnivå",
            "help": "Hjälp",
            "error": {
                "title": "Fel!",
                "size": "Fel i storleksdefinitionerna. Skall bredden vara minst {minWidth} och högst {maxWidth} pixel, och bredden mellan {minHeight} och {maxHeight} pixel.",
                "domain": "Webbplatsen är en nödvändig uppgift.",
                "domainStart": "Skriv webbplatsens adress utan prefixerna http och www",
                "name": "Kartans namn krävs",
                "nohelp": "Användarhandledning är inte tillgänglig.",
                "saveFailed": "Inbäddandet av kartan misslyckades. Försök på nytt senare. Fixa kart namn",
                "nameIllegalCharacters": "Namnet på kartan innehåller otillåtna tecken (exempel html-tags). ",
                "domainIllegalCharacters": "Namnet på webbplatsen innehåller otillåtna tecken. Skriv namnet på webbplatsens hemsida dvs. domainnamn utan prefixerna http och www samt utan undersida. Exempel: minhemsida.com. Tillåtna tecken är bokstäverna az samt å, ä och ö, siffror, backsteg och bindestreck."
            }
        },
        "NotLoggedView": {
            "text": "Du kan skapa inbäddade kartor efter att du har loggat in på tjänsten.",
            "signup": "Logga in",
            "register": "Registrera dig"
        },
        "StartView": {
            "text": "Skapa kartvy som du kan inbädda på din egen webbplats.",
            "touLink": "Visa användningsvillkoren till kartpublicering",
            "layerlist_title": "Valda kartlager som kan inbäddas",
            "layerlist_empty": "Valda kartlager kan inte publiceras i en inbäddad karta. Kontrollera rätten att publicera i menyn \"Valda Kartlager\" innan du börjar skapa kartan.",
            "layerlist_denied": "Kartlagret kan inte publiceras i en inbäddad karta.",
            "denied_tooltip": "Kartdataproducenterna har inte gett publiceringstillstånd till dessa material i andra webbtjänster eller denna kartlager kan inte visas med den valda kartprojektionen. Kontrollera rätten att publicera i menyn \"Valda Kartlager\" innan du börjar skapa kartan.",
            "myPlacesDisclaimer": "Obs! Du publicerar ditt eget kartlager.",
            "noRights": "inget tillstånd",
            "unsupportedProjection": "ostödd kartprojektion",
            "buttons": {
                "continue": "Fortsätt",
                "continueAndAccept": "Godkänn användningsvillkor och fortsätt",
                "cancel": "Avbryt",
                "close": "Stäng"
            },
            "tou": {
                "notfound": "Användningsvillkoren kunde inte hittas",
                "reject": "Avvisa",
                "accept": "Acceptera"
            }
        },
        "layer": {
            "show": "Visa",
            "hide": "Göm",
            "hidden": "Kartlagret är tillfälligt gömt.",
            "rights": {
                "can_be_published_map_user": {
                    "label": "Kartlagret kan publiceras i en inbäddad karta.",
                    "tooltip": "Kartlagret kan publiceras i en inbäddad karta. Antalet användare per vecka kan vara begränsat."
                }
            }
        },
        "layerFilter": {
            "buttons": {
                "publishable": "Publicerbar"
            },
            "tooltips": {
                "publishable": "Visa endast kartlager som kan publiceras med kart publicering funktion"
            }
        },
        "announcementsTool": {
            "buttonLabel": "Välja aviseringar",
            "popup": {
                "title": "Aviseringar",
                "close": "Stäng"
            },
        },
        "guidedTour": {
            "title": "Skapa karta",
            "message": "I \"Skapa Karta\"-menyn kan du skapa din egen karta och publicera den på din hemsida. Du behöver bara välja kartlagret, ge några uppgifter om kartan för publicering, ange kartans storlek, välja lämpliga kartverktyg och utforma layouten. Efter alla dessa val får du en rad html-kod. Lägg den till din kod och nu har du en karta på din webbplats. Kom ihåg att kontrollera att alla valda kartlager är publicerbara.",
            "openLink": "Visa skapa karta",
            "closeLink": "Göm skapa karta",
            "tileText": "Skapa karta"
        }
    }
});