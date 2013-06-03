Oskari.registerLocalization({
    "lang" : "sv",
    "key" : "Printout",
    "value" : {
        "title" : "Skriv ut kartvyn",
        "flyouttitle" : "Skriv ut kartvyn",
        "desc" : "",
        "btnTooltip" : "Skriv ut",
        "BasicView" : {
            "title" : "Skriv ut kartvyn",
            "name" : {
                "label" : "Kartans namn",
                "placeholder" : "obligatorisk uppgift",
                "tooltip" : "Ge kartan ett beskrivande namn. Observera användargränssnittets språk"
            },
            "language" : {
                "label" : "Språk",
                "options" : {
                    "fi" : "Finska",
                    "sv" : "Svenska",
                    "en" : "Engelska"
                },
                "tooltip" : "Välj språk för kartmaterial och användargränssnitt."
            },
            "size" : {
                "label" : "Storlek",
                "tooltip" : "Välj storleken på kartan. Kartan förhandsvisas i den valda storleken.",
                "options" : [{
                    "id" : "A4",
                    "label" : "A4",
                    "classForPreview" : "preview-portrait",
                    "selected" : true
                }, {
                    "id" : "A4_Landscape",
                    "label" : "A4-horisontell",
                    "classForPreview" : "preview-landscape"
                }, {
                    "id" : "A3",
                    "label" : "A3",
                    "classForPreview" : "preview-portrait"
                }, {
                    "id" : "A3_Landscape",
                    "label" : "A3-horisontell",
                    "classForPreview" : "preview-landscape"
                }]
            },
            "preview" : {
                "label" : "Förhandsgransningsvy",
                "tooltip" : "Klicka på den lilla förhandsgransningsvyn för att öppna en större förhandsgransningsvy",
                "pending" : "Förhandsgransningsvyn uppdateras om en stund",
                "notes" : {
                    "extent" : "Förhandsgransningsvy visar kartans läge",
                    "restriction" : "Inte alla maplager visas i förhandsgransningsvyn"
                }
            },
            "buttons" : {
                "save" : "Ladda ned utskriften",
                "ok" : "OK",
                "cancel" : "Avbryt"
            },
            "location" : {
                "label" : "Läge och skalnivå.",
                "tooltip" : "Utskriftens skalnivå motsvarar skalnivån i webbläsaren.",
                "zoomlevel" : "Skalnivå"
            },
            "settings" : {
                "label" : "Övriga inställningar",
                "tooltip" : "Gör övriga inställningar såsom format, rubrik, och skala"
            },
            "format" : {
                "label" : "Format",
                "tooltip" : "Välj fil format",
                "options" : [{
                    "id" : "png",
                    "format" : "image/png",
                    "label" : "PNG bild"
                }, {
                    "id" : "pdf",
                    "format" : "application/pdf",
                    "label" : "PDF dokument",
                    "selected" : true
                }]
            },
            "mapTitle" : {
                "label" : "Lägg till rubrik",
                "tooltip" : "Lägg till rubrik för kartan"
            },
            "content" : {
                "options" : [{
                    "id" : "pageLogo",
                    "label" : "Lägg till Paikkatietoikkunas logo",
                    "tooltip" : "Det är möjligt att gömma logon ifall det behövs",
                        "checked" : "checked"
                }, {
                    "id" : "pageScale",
                    "label" : "Lägg till skala till kartan",
                    "tooltip" : "Lägg till skala till kartan",
                        "checked" : "checked"
                }, {
                    "id" : "pageDate",
                    "label" : "Lägg till datum",
                    "tooltip" : "Det är möjligt att lägga till datumet till utskriften",
                        "checked" : "checked"
                }/*, {
                    "id" : "pageLegend",
                    "label" : "Lägg till Förklaringar",
                    "tooltip" : "Det är möjligt att lägga till förklaringar till utskriften",
                        "checked" : "checked"
                }, {
                    "id" : "pageCopyleft",
                    "label" : "Lägg till copyright information",
                    "tooltip" : "Det är möjligt att lägga till copyright till utskriften",
                        "checked" : "checked"
                }*/]
            },
             "legend" : {
                "label" : "Legend",
                "tooltip" : "Väljä legend position",
                "options" : [{
                        "id" : "oskari_legend_NO",
                        "loca" : "NO",
                        "label" : "Ingen legend ",
                        "tooltip" : "Ingen legend print",
                        "selected" : true
                       
                    },{
                        "id" : "oskari_legend_LL",
                        "loca" : "LL",
                        "label" : "Vänster nere hörn ",
                        "tooltip" : "Legend position i vänster nere hörn"
                       
                    },{
                        "id" : "oskari_legend_LU",
                         "loca" : "LU",
                        "label" : "Vänster uppe hörn ",
                        "tooltip" : "Legend position i vänster uppe hörn"
                       
                    },{
                        "id" : "oskari_legend_RU",
                         "loca" : "RU",
                        "label" : "Höger uppe hörn ",
                        "tooltip" : "Legend position i höger uppe hörn"
                       
                    },{
                        "id" : "oskari_legend_RL",
                         "loca" : "RL",
                        "label" : "Höger nere hörn ",
                        "tooltip" : "Legend position i höger nere hörn"
                       
                    }
                ]
            },
            "help" : "Anvisning",
            "error" : {
                "title" : "Fel",
                "size" : "Fel i storleksdefinitionerna",
                "name" : "Namnet är en nödvändig uppgift",
                "nohelp" : "Ingen anvisning",
                "saveFailed" : "Avskiljandet av kartan misslyckades. Försök på nytt senare.",
                "nameIllegalCharacters" : "I namnet ingår otillåtna tecken. Tillåtna är alla bokstäver i det svenska alfabetet, siffror, mellanslag och bindestreck."
            }
        },
        "StartView" : {
            "text" : "Du kan skriva ut den kartvy som du definierat till PDF-utskrift eller PNG-bildfilen",
            "info" : {
                "maxLayers" : "Högst 8 kartlager kan skrivs ut",
                "printoutProcessingTime" : "Det tar en stund att skriva ut kartvyn med många kartlager."
            },
            "buttons" : {
                "continue" : "Fortsätt",
                "cancel" : "Tillbaka"
            }
        }
    }
});
