Oskari.registerLocalization(
    {
        "lang": "sv",
        "key": "Printout",
        "value": {
            "title": "Skriv ut kartvyn",
            "flyouttitle": "Skriv ut kartvyn",
            "desc": "",
            "BasicView": {
                "title": "Skriv ut kartvyn",
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
                    "tooltip": "Välj storleken på kartan. Kartan förhandsvisas i den valda storleken."
                },     
				"preview": {
                    "label": "Förhandsgransningsvy",
                    "tooltip": "Klicka på den lilla förhandsgransningsvyn för att öppna en större förhandsgransningsvy"
                },
               "sizes": {
                    "A4": "A4",
                    "A4_Landscape": "A4-horisontell",
                    "A3": "A3",
                    "A3_Landscape": "A3-horisontell"
                },
                "buttons": {
                    "save": "Ladda ned PDF-utskriften",
                    "ok": "OK",
                    "cancel": "Avbryt"
                },                
                "location": { 
                	"label" : "Läge och skalnivå.",
                	"tooltip" : "Utskriftens skalnivå motsvarar skalnivån i webbläsaren.",
                	"zoomlevel": "Skalnivå"
                },
                "inställningar": { 
                    "label" : "Mera inställningar", 
                    "tooltip" : "Gör flera inställningar såsom format, rubrik, och skala" 
                }, 
                "format": { 
                    "label" : "Format", 
                    "tooltip" : "Välj fil format" 
                }, 
                "formats": { 
                    "png": "PNG build", 
                    "pdf": "PDF dokument" 
                }, 
                "mapTitle": { 
                    "label" : "Lägg till rubrik", 
                    "tooltip" : "Lägg till rubrik för kartan" 
                }, 
                "mapLogo": { 
                    "label" : "Lägg till Paikkatietoikkunas logo", 
                    "tooltip" : "Det är möjligt att gömma logon ifall det behövs" 
                }, 
                "mapScale": { 
                    "label" : "Lägg till skala till kartan", 
                    "tooltip" : "Lägg till skala till kartan" 
                }, 
                "mapDate": { 
                    "label" : "Lägg till datum", 
                    "tooltip" : "Det är möjligt att lägga till datumet till utskriften" 
                },
                "help": "Anvisning",
                "error": {
                    "title": "Fel",
                    "size": "Fel i storleksdefinitionerna",
                    "name": "Namnet är en nödvändig uppgift",
                    "nohelp": "Ingen anvisning",
                    "saveFailed": "Avskiljandet av kartan misslyckades. Försök på nytt senare.",
                    "nameIllegalCharacters": "I namnet ingår otillåtna tecken. Tillåtna är alla bokstäver i det svenska alfabetet, siffror, mellanslag och bindestreck."
                }
            },
            "StartView": {
                "text": "Du kan skriva ut den kartvy som du definierat till PDF-utskrift eller PNG-bildfilen???",
                "buttons": {
                    "continue": "Fortsätt",
                    "cancel": "Tillbaka"
                }
            }
        }
    });