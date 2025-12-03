Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "Publisher2",
    "value": {
        "tile": {
            "title": "Kartpublicering"
        },
        "flyout": {
            "title": "Publicera en karta på din webbplats"
        },
        "published": {
            "title": "Den inbäddade kartan är klar för publicering",
            "desc": "Publicera kartan genom att infoga HTML-koden nedan på din webbplats:",
            "copy": "Kopiera till klippbordet"
        },
        "snippet": {
            "title": "HTML-kod",
            "desc": "Inbädda kartan genom att lägga till HTML-koden nedan på din webbplats.",
            "params": "Använd kartinbäddning från aktuell läge och skalnivå",
            "paramsTip": "Som standard är mitten av kartfönstret den som finns i kartfönstret vid publiceringstillfället."
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
            "title": "Kartpublicering",
            "titleEdit": "Redigera den inbäddade karta",
            "transfer": {
                "label": "Överföra konfigurationen",
                "PublishTransfer": "Aktivera överföring"
            },
            "generalInfo": {
                "label": "Webbplats",
                "domain": {
                    "label": "Tillåt publicering endast på följande webbadress",
                    "placeholder": "Webbplats adress",
                    "tooltip": "Skriv namnet på webbplatsens hemsida dvs. domainnamn utan prefixerna http och www samt utan undersida. Exempel: minhemsida.com",
                    "inputWarning": "Kontrollera nätverksadressen du angav"
                },
                "name": {
                    "label": "Kartans namn (obligatorisk)",
                    "placeholder": "Obligatorisk uppgift",
                    "tooltip": "Ge namn åt kartan. Välj språket med hänsyn till webbsidans språk."
                },
                "language": {
                    "label": "Språk för användargränssnitt",
                    "options": {
                        "fi": "Finska",
                        "sv": "Svenska",
                        "en": "Engelska"
                    },
                    "tooltip": "Välj ett språk på kartan. Språket användas på användargänsnitt och text på kartan. Obs! Valt språk visas inte på förhandsvisningskartan.",
                    "languageChangedDisclaimer": "Obs! Valt språk visas inte på förhandsvisningskartan."
                }
            },
            "mapPreview": {
                "label": "Kartans storlek",
                "tooltip": "Välj kartans storlek. Vi rekommenderar den skalbara funktionen \"Skalbar / Fyll utrymmet\". Annars skall bredden vara minst {minWidth} och högst {maxWidth} pixel, och bredden mellan {minHeight} och {maxHeight} pixel."
            },
            "tools": {
                "label": "Verktyg",
                "additional": "Ytterligare verktyg",
                "tooltip": "Välj verktygen som visas på kartan. Du kan se deras placering på den förhandsvisade kartan.",
            },
            "toolLayout": {
                "label": "Placering av verktyg",
                "tooltip": "Välj placering för det verktyg som ska visas på kartan.",
                "swapUI": "Byt sida",
                "userlayout": "Egen placering",
                "usereditmodeoff": "Spara placering"
            },
            "statsgrid": {
                "label": "Statistik",
                "tooltip": "Visa kartstatistik"
            },
            "layout": {
                "label": "Grafisk layout",
                "title": {
                    "popup": "Popup-fönster",
                    "buttons": "Knappar",
                    "infobox": "Frågverktyg av objektuppgifter"
                },
                "fields": {
                    "toolStyles": {
                        "rounded-dark": "Avrundad (mörk)",
                        "rounded-light": "Avrundad (ljus)",
                        "sharp-dark": "Kantig (mörk)",
                        "sharp-light": "Kantig (ljus)",
                        "3d-dark": "3D (mörk)",
                        "3d-light": "3D (ljus)"
                    },
                    "font": "Font",
                    "popupHeaderColor": "Titelns bakgrundsfärg",
                    "popupHeaderTextColor": "Titelns fontfärg",
                    "infoboxHeaderColor": "Titelns bakgrundsfärg",
                    "infoboxHeaderTextColor": "Titelns fontfärg",
                    "infoboxPreview": "Förhandsgranskning",
                    "buttonBackgroundColor": "Bakgrundsfärg",
                    "buttonTextColor": "Ikonernas färg",
                    "buttonAccentColor": "Ikonernas effektfärg",
                    "buttonRounding": "Knapparnas avrundning",
                    "effect": "Effekt",
                    "3d": "3D",
                    "presets": "Färdiga stilar"
                },
                "gfiDialog": {
                    "title": "Objektinformation",
                    "featureName": "Förhandsgranskning",
                    "featureDesc": "Utseendeval påverkar objektinformationens och kartlagermenyns utseende."
                }
            },
            "sizes": {
                "small": "Liten",
                "medium": "Medelstor",
                "large": "Stor",
                "fill": "Fyller utrymmet",
                "custom": "Ange egen storlek",
                "width": "bredd",
                "height": "höjd",
                "separator": "x"
            },
            "buttons": {
                "save": "Spara",
                "saveNew": "Spara ny",
                "replace": "Ersätt"
            },
            "confirm": {
                "replace": {
                    "title": "Vill du ersätta den inbäddade kartan?",
                    "msg": "Vill du uppdatera den inbäddade kartan? Förändringarna till den tidigare inbäddade kartan kommer att visas utan dröjsmål på kartan. Du behöver inte ändra html-koden på din webbplats om du inte ändrat kartans storlek."
                }
            },
            "rpc": {
                "label": "Programmatisk användning (RPC API)",
                "info": "Med RPC gränssnittet kan du utnyttja publicerad kartor. Mer information https://oskari.org/documentation/features/rpc/"
            },
            "layers": {
                "label": "Kartlager",
                "tools": "Verktyg",
                "selectAsBaselayer": "Välj bakgrundskartlager",
                "otherLayers": "Valda kartlager",
                "selectLayers": "Välj kartlager",
                "layersDisplay": "Redigera kartlager",
                "baseLayers": "Bakgrundskartor",
                "noBaseLayers": "Inga bakgrundskartor valda",
                "noLayers": "Inga kartlager valda"
            },
            "error": {
                "title": "Fel!",
                "size": "Kartans storlek är ogiltig. Bredden måste vara {minWidth} - {maxWidth} pixlar och höjden {minHeight} - {maxHeight} pixlar.",
                "domain": "Webbplatsen är en nödvändig uppgift.",
                "domainStart": "Skriv webbplatsens adress utan prefixerna http",
                "name": "Kartans namn är en obligatorisk uppgift.",
                "nohelp": "Användarhandledning är inte tillgänglig.",
                "saveFailed": "Inbäddandet av kartan misslyckades. Försök på nytt senare. Fixa kart namn",
                "nameIllegalCharacters": "Namnet på kartan innehåller otillåtna tecken (exempel html-tags). ",
                "domainIllegalCharacters": "Namnet på webbplatsen innehåller otillåtna tecken. Skriv namnet på webbplatsens hemsida dvs. domainnamn utan prefixerna http och www samt utan undersida. Exempel: minhemsida.com. Tillåtna tecken är bokstäverna az samt å, ä och ö, siffror, backsteg och bindestreck."
            },
            "noUI": "Dölj användargränsnittet (Använd via RPC gränssnitt)"
        },
        "NotLoggedView": {
            "text": "Du kan skapa publicerade kartor efter att du har loggat in på tjänsten.",
            "signup": "Logga in",
            "register": "Registrera dig"
        },
        "StartView": {
            "text": "Skapa en inbäddningsbar karta och publicera den på din webbplats.",
            "touLink": "Användarvillkor för kartpublicering",
            "layerlist_title": "Valda kartlager som kan inbäddas",
            "layerlist_empty": "Valda kartlager kan inte publiceras i en inbäddad karta. Kontrollera rätten att publicera i menyn \"Valda Kartlager\" innan du börjar skapa kartan.",
            "layerlist_denied": "Kartlagret kan inte publiceras i en inbäddad karta.",
            "denied_tooltip": "Kartdataproducenterna har inte gett publiceringstillstånd till dessa material i andra webbtjänster eller denna kartlager kan inte visas med den valda kartprojektionen. Kontrollera rätten att publicera i menyn \"Valda Kartlager\" innan du börjar skapa kartan.",
            "userDataLayerDisclaimer": "Obs! Du publicerar ditt eget kartlager.",
            "hasUserDataDisclaimer": "Obs! Du publicerar ditt eget kartlager.",
            "noRights": "inget tillstånd",
            "buttons": {
                "continue": "Fortsätt",
                "continueAndAccept": "Godkänn användningsvillkor och fortsätt"
            },
            "tou": {
                "title": "Användningsvillkoren",
                "notfound": "Användningsvillkoren kunde inte hittas",
                "reject": "Avvisa",
                "accept": "Acceptera"
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
        "guidedTour": {
            "title": "Skapa karta",
            "message": "I \"Skapa Karta\"-menyn kan du skapa din egen karta och publicera den på din hemsida. Du behöver bara välja kartlagret, ge några uppgifter om kartan för publicering, ange kartans storlek, välja lämpliga kartverktyg och utforma layouten. Efter alla dessa val får du en rad html-kod. Lägg den till din kod och nu har du en karta på din webbplats. Kom ihåg att kontrollera att alla valda kartlager är publicerbara.",
            "openLink": "Visa skapa karta",
            "closeLink": "Göm skapa karta",
            "tileText": "Skapa karta"
        }
    }
});
