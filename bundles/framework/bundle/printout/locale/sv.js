Oskari.registerLocalization(
    {
        "lang": "sv",
        "key": "Printout",
        "value": {
            "title": "Definiera kartutskrift",
            "flyouttitle": "Definiera karta",
            "desc": "",
            "BasicView": {
                "title": "Kartutskrift",
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
                    "tooltip": "Välj eller definiera storleken på kartan. Kartan förhandsvisas i den valda storleken."
                },     
				"preview": {
                    "label": "Förhandsgransningsvy",
                    "tooltip": "Klicka på den lilla förhandsgransningsvyn för att öppna en större förhandsgransningsvy"
                },
               "sizes": {
                    "A4": "A4-utskrift",
                    "A4_Landscape": "A4-horisontell",
                    "A3": "A3-utskrift",
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