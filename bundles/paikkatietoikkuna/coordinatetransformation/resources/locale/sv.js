Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "coordinatetransformation",
    "value": {
        "title": "Koordinatomvandling",
        "tile": {
            "title": "Koordinatomvandling"
        },
        "flyout": {
            "title":"Koordinatomvandling",
            "filterSystems": {
                "title": "Filtrera referenssystem för koordinater",
                "epsg": "Med EPSG-kod",
                "systems": "Med datum och koordinatsystem"
            },
            "coordinateSystem": {
                "title": "Uppgifter om referenssystemet för koordinater",
                "input": {
                    "title": "Utgångsuppgifter om referenssystemet för koordinater"
                },
                "output": {
                    "title": "Resultatuppgifter om referenssystemet för koordinater"
                },
                "noFilter": "Vad som helst",
                "epsgSearch": {
                    "label": "Sök med EPSG-kod"
                },
                "geodeticDatum": {
                    "label": "Geodetiskt datum"
                },
                "coordinateSystem":{
                    "label": "Koordinatsystem",
                    "proj2D": "Projicerat 2D (Plan)",
                    "proj3D": "Projicerat 3D",
                    "geo2D": "Geografiskt 2D",
                    "geo3D": "Geografiskt 3D"
                },
                "mapProjection":{
                    "label": "Kartprojektionssystem"
                },
                "geodeticCoordinateSystem":{
                    "label": "Geodetiskt referenssystem för koordinater", // Geodetiskt koordinatsystem
                    "choose": "Valitse",
                    "kkj": "KKS zon {zone, number}",
                    "ykj": "KKS zon 3 / EKS"
                },
                "heightSystem":{
                    "label": "Höjdsystem",
                    "none": "Ingenting"
                }
            },
            "coordinateTable": {
                "input": "Koordinater som ska omvandlas",
                "output": "Resultatkoordinater",
                "north":"Nord-koordinat [m]",
                "east":"Öst-koordinat [m]",
                "lat":"Latitud",
                "lon":"Longitud",
                "elevation": "Höjd [m]",
                "geoX":"Geocentriskt X [m]",
                "geoY":"Geocentriskt Y [m]",
                "geoZ":"Geocentriskt Z [m]",
                "ellipseElevation":"Höjd över ellipsoiden [m]",
                "rows": "Rader",
                "clearTables": "Töm tabellerna",
                "confirmClear": "Är du säker på att du vill tömma tabellerna?"
            },
            "transform": {
                "warnings": {
                    "title": "Observera!",
                    "3DTo2D": "I de utgångsuppgifter du valt finns höjdvärden, men inte i resultatuppgifterna. Höjvärden ingår alltså inte i resultatkoordinaterna. Vill du fortsätta?",
                    "2DTo3D": "I de resultatuppgifter du valt finns höjdvärden, men inte i utgångsuppgifterna. Utgångsmaterialet ges höjdvärdet 0 och höjdsystemet N2000. Vill du fortsätta?",
                    "xyz": "I valen som berör utgångsreferenssystemet för koordinater finns inget höjdsystem. En omvandling till ett rätvinkligt 3D-system kan inte göras.",
                    "largeFile": "Isojen tiedostojen muuntaminen voi kestää useita minuutteja."
                },
                "validateErrors": {
                    "title": "Fel!",
                    "message": "Det finns brister eller fel i valen. Beakta följande krav och försök på nytt.",
                    "crs": "Ett geodetiskt referenssystem för koordinater ska vara valt både i utgångs- och resultatuppgifterna.",
                    "noInputData": "Det finns inga koordinater som kan omvandlas.",
                    "noInputFile": "Filen som innehåller utgångsmaterial ska vara vald.",
                    "noFileName": "Filen som bildas ska ges ett filnamn.",
                    "decimalCount": "Decimalernas noggrannhet ska vara 0 eller ett positivt heltal.",
                    "headerCount": "Antalet rubrikrader ska vara 0 eller ett positivt heltal.",
                    "doubleComma": "Skiljetecknen för decimaler och koordinater kan inte båda vara kommatecken.",
                    "doubleSpace": "Kulman muoto/yksikkö ei voi sisältää välilyöntejä, jos koordinaattierotin on Välilyönti.",
                    "noFileSettings": "Inga filinställningar har angetts..",
                    "noCoordinateSeparator": "Skiljetecknet för koordinater ska vara valt.",
                    "noDecimalSeparator": "Skiljetecknet för decimaler ska vara valt."
                },
                "responseErrors": {
                    "titleTransform": "Fel i omvandlingen!",
                    "titleRead": "Virhe tiedoston lukemisessa!",
                    "readFileError" : "Tiedostosta ei onnistuttu lukemaan kaikkia rivejä.",
                    "transformFileError": "Tiedoston koordinaatteja ei onnistuttu muuntamaan.",
                    "invalidLine": "I filen finns på rad: {index, number} felaktig koordinatrad: {line} Kontrollera att valen av skiljetecknen för decimaler och koordinater samt antalet rubrikrader motsvarar filens innehåll.",
                    "generic": "Koordinatomvandlingen misslyckades...",
                    //error codes
                    "invalid_coord": "Koordinaatti virheellinen. Tarkasta, että muunnettavat koordinaatit on oikeassa muodossa sekä geodeettinen koordinaatti- ja kokeusjärjestelmä ovat oikein.",
                    "invalid_number": "Koordinaatti virheellinen. Tarkasta..",
                    "invalid_coord_in_array": "Koordinaatti virheellinen. Tarkasta..",
                    "no_coordinates": "Ei koordinaatteja",
                    "invalid_file_settings": "Felaktiga filinställningar.",
                    "no_file": "Det fanns ingen fil för begäran.",
                    "invalid_first_coord": "Det var inte möjligt att bilda en koordinat med de angivna inställningarna. Kontrollera att valen av skiljetecken för koordinater, antalet rubrikrader, huruvida identifierare används eller inte samt geodetiska referenssystem för koordinater och höjdsystem (dimension) motsvarar filens innehåll.",
                    "transformation_error": "Koordinaattimuunnos epäonnistui. Koordinaattimuunnospalvelusta palautui virhe:"
                },
                "responseFile": {
                    "title": "Observera!",
                    "hasMoreCoordinates": "Det är inte möjligt att från utgångsmaterialet omvandla fler än {maxCoordsToArray, number} koordinater i tabellen. Om du vill omvandla alla koordinater, använd funktionen För in resultaten i en fil."
                }
            }
        },
        "dataSource": {
            "title": "Källa för koordinatuppgifter",
            "confirmChange": "Koordinaterna som ska omvandlas töms. Vill du fortsätta?",
            "file": {
                "label": "Från fil",
                "info":  "Välj filen med utgångsmaterialet och dess inställningar.",
                "action": "redigera dina val"
            },
            "keyboard": {
                "label": "Med tangentbordet",
                "info": "Mata in utgångsuppgifter i tabellen Koordinater som ska omvandlas."
            },
            "map": {
                "label": "Välj lägen på kartan",
                "info": "Du kan välja koordinater som ska omvandlas genom att klicka på kartan",
                "confirmSelect": "Lähtökoordinaattijärjestelmän tiedot valitaan automaattisesti kartan käyttämän ETRS-TM35FIN -projektion mukaisiksi. Tekemäsi lähtökoordinaattijärjestelmän valinnat korvataan. Haluatko jatkaa?",
                "action": "välj fler"
            }
        },
        "mapMarkers":{
            "show":{
                "title": "Visa lägen på kartan",
                "info" : "Kartans projektion är ETRS-TM35FIN. Koordinaterna har placerats på kartan med hjälp av detta referenssystem för koordinater. I samband med lägesanteckningen anges koordinaterna enligt utgångs- och/eller resultatreferenssystemet i siffror.",
                "errorTitle": "Virhe sijaintien näyttämisessä",
                "noCoordinates": "Ei koordinaatteja näytettäväksi kartalla",
                "noSrs": "Geodeettinen koordinaattijärjestelmä pitää olla valittuna lähtötiedoissa, jotta pisteet voidaan näyttää kartalla.",
                "lon": "Lon",
                "lat": "Lat",
                "north": "N",
                "east": "E"
            },
            "select":{
                "title": "Välj lägen på kartan",
                "info": "Välj en eller flera punkter på kartan genom att klicka på dem. Kartans projektion är ETRS-TM35FIN. Detta referenssystem för koordinater väljs automatiskt för de koordinater som omvandlas och kan inte ändras. Beakta vid val av koordinater att valet av läge inte är exakt.",
                "add": "Lisää merkintöjä",
                "remove": "Poista merkintöjä"
            }
        },
        "actions": {
            "convert": "Omvandla", //Transformera
            "export": "Omvandla i en fil",
            "select": "Välj",
            "cancel": "Avbryt", //Ångra
            "done": "Färdig",
            "ok": "Ok",
            "close": "Stäng"
        },
        "fileSettings": {
            "options": {
                "decimalSeparator": "Skiljetecken för decimaler",
                "coordinateSeparator": "Skiljetecken för koordinater",
                "headerCount": "Antal rubrikrader",
                "decimalCount": "Decimalernas precision",
                "reverseCoordinates": "Omvända koordinater",
                "useId": { // Använd identifierare
                    "input": "Koordinaatit sisältää tunnisteet",
                    "generate": "Luo tunnisteet",
                    "fromFile": "Lisää lähtötiedoston tunnisteet"
                },
                "writeHeader": "Skriv rubrikraden i filen",
                "useCardinals": "Använd kardinalväderstreck (N,E,W,S)",
                "lineEnds": "Ta med radavslutningarna i resultatet",
                "choose": "Välj",
                "degreeFormat":{
                    "label": "Vinkelns form/enhet",
                    "degree": "Grad",
                    "gradian": "Gon (nygrad)",
                    "radian": "Radian"
                },
                "lineSeparator": {
                    "label": "Radavskiljare",
                    "win": "Windows / DOS",
                    "unix": "Unix",
                    "mac": "MacOS"
                },
                "delimeters":{
                    "point": "Punkt",
                    "comma": "Kommatecken",
                    "tab": "Tabulator",
                    "space": "Mellanslag", //Utslutning
                    "semicolon": "Semikolon"
                }
            },
            "export": {
                "title": "Bildande av datamaterial",
                "fileName": "Filnamn"
            },
            "import": {
                "title": "Utgångsmaterialets egenskaper"
            }
        },
        "infoPopup": {
            "description": "Beskrivning",
            "epsgSearch": {
                "title": "Sök med EPSG-kod",
                "info": "Du kan söka ett geodetiskt referenssystem för koordinater med EPSG-kod. Mata in koden enbart i sifferform, t.ex. 3067.",
                "listItems": []
            },
            "geodeticDatum": {
                "title": "Geodetiskt datum",
                "info": "Ett datum som beskriver förhållandet mellan jorden och ett två- eller tredimensionellt koordinatsystem.",
                "listItems" : [
                    "Datum: en parameter eller parametermängd som definierar koordinatsystemets origo, skala och orientation.",
                    "Exempel på geodetiska datum är bl.a. EUREF-FIN och kartverkskoordinatsystemet."
                ]
            },
            "coordinateSystem":{
                "title": "Koordinatsystem",
                "info": "En mängd matematiska regler som bestämmer hur koordinater för punkter definieras.",
                "listItems" : [
                    "Olika typer av koordinatsystem är bl.a. rätvinkligt koordinatsystem, plankoordinatsystem, polärt koordinatsystem, geodetiskt koordinatsystem, sfäriskt koordinatsystem och cylindriskt koordinatsystem."
                ]
            },
            "mapProjection":{
                "title": "Kartprojektionssystem",
                "info": "En mängd regler som bestämmer hur ett önskat område beskrivs med hjälp av en mängd kartprojektioner.",
                "listItems" : [
                    "Kartprojektion: en metod för att beskriva jordklotets tredimensionella yta på ett tvådimensionellt kartplan.",
                    "Med hjälp av reglerna kan man bestämma kartprojektioner och projektionszoner. För projektionszoner kan systemet bestämma identiferare, medelmeridianernas eller medelparallellernas skala, bredd, längd och överlappning."
                ]
            },
            "geodeticCoordinateSystem":{
                "title": "Geodetiskt koordinatsystem",
                "info": "Ett referenssystem för koordinater som baserar sig på ett geodetiskt datum.",
                "listItems" : [
                    "Referenssystem för koordinater: ett koordinatsystem som har bundits till den verkliga världen med hjälp av ett datum.",
                    "Finlands riksomfattande projicerade koordinatsystem är ETRS-TM35FIN."
                ]
            },
            "heightSystem":{
                "title":"Höjdsystem",
                "info": "Ett endimensionerat koordinatsystem som baserar sig på ett höjddatum.",
                "listItems" : [
                    "Höjddatum: datum som definierar förhållandet mellan höjder och djup i anslutning till tyngdkraften och Jorden.",
                    "I Finland används höjdsystemet N2000 som är förenlig med rekommendationen JHS 163 i riksomfattande arbeten."
                ]
            },
            "fileName":{
                "title":"Filnamn",
                "info": "",
                "paragraphs" : [],
                "listItems" : []
            },
            "decimalPrecision":{
                "title":"Decimalernas precision",
                "info": "Antalet decimaler som visas i resultatet.",
                "paragraphs": [
                    "Med denna egenskap kan man ange med hur många decimalers noggrannhet koordinaterna visas i resultatet. Det förvalda värdet på blanketten motsvarar ett antal decimaler som ger en 1 mm precision. Det förvalda värdet för gradangivelser är det närmaste antalet decimaler som i det metriska sytemet motsvarar 1 mm."
                ],
                "listItems" : [],
                "precisionTable": {
                    "title": "Kulman muodon/yksikön desimaalien määrä metrisenä tarkkuutena",
                    "unit": "Vinkelns form/enhet",
                    "deg": "Grad, gon och DD",
                    "rad": "Radian",
                    "min": "DDMM och DD MM",
                    "sec": "DDMMSS och DD MM SS"
                }
            },
            "coordinateSeparator":{
                "title":"Skiljetecken för koordinater",
                "info": "Skiljetecken för koordinater", // TODO
                "paragraphs": [
                    "Med denna egenskap anges vilket skiljetecken som använts för kolumner i utgångsmaterialet mellan koordinatvärden. I utgångsmaterialet får det finnas endast ett sådant skiljetecken mellan två koordinatvärden.",
                    "Om koordinaterna föregås av en identifierare eller följs av en teckensträng, ska även dessa vara åtskilda med samma skiljetecken."
                ],
                "listItems" : []
            },
            "headerLineCount":{
                "title":"Antal rubrikrader",
                "info": "Antalet rader i början av filen före den första koordinatraden.",
                "paragraphs": [
                    "Med denna egenskap kan man ange hur många rader i början av filen som applikationen kan förbise innan den ska läsa in den första koordinatraden.",
                    "Orsaken till förbiseendet kan vara exempelvis en beskrivning i ord av filens innehåll i början av filen."
                ],
                "listItems" : []
            },
            "unitFormat":{
                "title":"Vinkelns form/enhet",
                "info": "Enhet för geografiska koordinater i gradformat",
                "paragraphs": [
                    "Med denna egenskap anges formatet för gradvärden. Gradenheter som applikationen stöder: Grad, Gon (nygrad) och Radian.",
                    "Dessutom stöds sexagesimalformat som härletts ur grader. Om man i dessa format har avskiljt grader, bågminuter och bågsekunder med mellanslag (DD MM och DD MM SS), kan mellanslaget inte användas som skiljetecken för koordinater."
                ],
                "listItems" : []
            },
            "decimalSeparator":{
                "title":"Skiljetecken för decimaler",
                "info": "Med denna egenskap anges skiljetecknet för decimaler.",
                "paragraphs": [
                    "Skiljetecknet för decimaler får inte vara samma som skiljetecknet för koordinatvärden. Om kommatecken använts som skiljetecken för koordinatvärden, ska skiljetecknet för decimaler vara en punkt."
                ],
                "listItems" : []
            },
            "lineSeparator":{
                "title":"Radavskiljare",
                "info": "Tecken som i filen anger radbyte.",
                "paragraphs": [
                    "Med denna egenskap anges vilket tecken eller vilken teckensträng används för att ange radbyte. Detta tecken eller denna teckensträng läggs alltså till slutet av varje rad."
                ],
                "listItems" : []
            },
            "prefixId":{
                "title":"Använd identifierare",
                "info": "Koordinatraden börjar med identifieraruppgift",
                "paragraphs": [
                    "Med denna egenskap anges att koordinatvärdena för respektive punkt föregås av punktens identifierare (ID) på samma rad",
                    "Punktens identifierare ska vara avskilt från koordinatvärdena med samma teckensträng som skiljer koordinatvärdena från varandra.",
                    "Om den importerade filen saknar punktidentifierare eller punkterna har hämtats från en tabell eller karta, ges resultatfilernas punkter identifierare som börjar från 1 och växer med ett heltal per punkt.",
                    "I utgångsfilen behöver identifierare inte vara numeriska."
                ],
                "listItems" : []
            },
            "reverseCoordinates":{
                "title":"Omvända koordinater",
                "info": "X- och Y-koordinataxlarnas ordning avviker från den definierade ordningen.",
                "paragraphs": [
                    "Med denna egenskap kan man definiera om de två första koordinatvärdena för punkterna i filen är i motsatt ordning jämfört med den ordning som anges i koordinatsystemets beskrivning.",
                    "Exempelvis visas KKS-koordinater så att nordkoordinaten är först och östkoordinaten följer. När man väljer omvänd ordning, ska östkoordinaten vara först i filen och sedan nordkoordinaten."
                ],
                "listItems" : []
            },
            "writeHeader":{
                "title":"Skriv rubrikraden i filen",
                "info": "Inkludera rubrikraderna i början av resultatfilen",
                "paragraphs": [
                    "Med denna egenskap kan användaren ta med metadata om koordinaterna på rubrikraden i resultatfilen. Namnet på referenssystemet för koordinater läggs till på rubrikraden.",
                    "I omvandlingen från en fil till en annan läggs utöver uppgifterna om referenssystemet för koordinater även eventuella rubrikrader i utgångsfilen till i resultatfilen."
                ],
                "listItems" : []
            },
            "lineEnds":{
                "title":"Ta med radavslutningarna i resultatet",
                "info": "Inkludera radsluten i utgångsfilen i resultatfilen",
                "paragraphs": [
                    "Med denna egenskap kan man ange om man vill ha eventuella radslut i utgångsfilen i resultatfilen. Som radslut läser applikationen in alla tecken efter punktens koordinatvärden på raden. Radslutet ska vara avskilt från koordinatvärdena med samma tecken som skiljer koordinatvärdena från varandra.",
                    "Denna egenskap påverkar endast omvandlingar från en fil till en annan."
                    
                ],
                "listItems" : []
            },
            "useCardinals":{
                "title":"Använd kardinalväderstreck",
                "info": "Lägg till väderstrecken (N, E, W eller S) efter koordinatvärdena",
                "paragraphs": [
                    "Med denna egenskap anges om koordinatvärdenas väderstreck skrivs ut efter koordinatvärdena i en utskrift. På värden med förtecknet minus läggs det motsatta väderstrecket till och minustecknen tas bort från koordinatvärdena. Exempel: värdet på östkoordinaten 325418 blir 325418E och på östkoordinaten -325418 blir värdet 325418W.",
                    "Väderstrecken anges genom att skriva N, E, W eller S efter respektive koordinatvärde."
                ],
                "listItems" : []
            }
        }
    }
});
