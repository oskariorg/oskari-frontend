Oskari.registerLocalization(
{
    "lang": "en",
    "key": "coordinatetransformation",
    "value": {
        "title": "Coordinate Transformation",
        "tile": {
            "title": "Coordinate Transformation"
        },
        "flyout": {
            "title":"Coordinate Transformation",
            "filterSystems": {
                "title": "Suodata koordinaattijärjestelmiä",
                "epsg": "EPSG-koodilla",
                "systems": "Datumilla ja koordinaatistolla"
            },
            "coordinateSystem": {
                "title": "Koordinaattijärjestelmän tiedot",
                "input": {
                    "title": "Lähtö koordinaattijärjestelmän tiedot"
                },
                "output": {
                    "title": "Tulos koordinaattijärjestelmän tiedot"
                },
                "noFilter": "Any option",
                "epsgSearch": {
                    "label": "Hae EPSG-koodilla"
                },
                "geodeticDatum": {
                    "label": "Geodeettinen datumi"
                },
                "coordinateSystem":{
                    "label": "Koordinaatisto",
                    "proj2D": "Suorakulmainen 2D (Taso)",
                    "proj3D": "Suorakulmainen 3D",
                    "geo2D": "Maantieteellinen 2D",
                    "geo3D": "Maantieteellinen 3D"
                },
                "mapProjection":{
                    "label": "Karttaprojektiojärjestelmä"
                },
                "geodeticCoordinateSystem":{
                    "label": "Geodeettinen koordinaattijärjestelmä",
                    "choose": "Choose",
                    "kkj": "KKJ zone {zone, number}",
                    "ykj": "KKJ zone 3 / YKJ"
                },
                "heightSystem":{
                    "label": "Korkeusjärjestelmä",
                    "none": "None"
                }
            },
            "coordinateTable": {
                "input": "Muunnettavat koordinaatit",
                "output": "Tuloskoordinaatit",
                "north":"Pohjois-koordinaatti [m]",
                "east":"Itä-koordinaatti [m]",
                "lat":"Leveysaste",
                "lon":"Pituusaste",
                "elevation": "Korkeus [m]",
                "geoX":"Geosentrinen X [m]",
                "geoY":"Geosentrinen Y [m]",
                "geoZ":"Geosentrinen Z [m]",
                "ellipseElevation":"Ellipsoidinen korkeus [m]",
                "rows": "Riviä",
                "clearTables": "Tyhjennä taulukot",
                "confirmClear": "Haluatko tyhjentää taulukot?"
            },
            "transform": {
                "warnings": {
                    "title": "Huomio!",
                    "3DTo2D": "Valitsemissasi lähtötiedoissa on mukana korkeusarvoja, mutta tulostiedoissa ei. Tuloskoordinaatteihin ei siis tule korkeusarvoja mukaan. Haluatko jatkaa?",
                    "2DTo3D": "Valitsemissasi lähtötiedoissa ei ole korkeusarvoja, mutta tulostiedoissa on. Lähtöaineiston korkeusarvoiksi lisätään 0 ja korkeusjärjestelmäksi N2000. Haluatko jatkaa?",
                    "xyz": "Lähtökoordinaattijärjestelmän valinnoissa ei ole korkeusjärjestelmää. Muunnos suorakulmaiseen 3D -järjestelmään ei ole mahdollinen."
                },
                "validateErrors": {
                    "title": "Virhe!",
                    "message": "Valinnoissa on puutteita tai virheitä. Ota huomioon seuraavat vaatimukset ja yritä uudelleen.",
                    "crs": "Geodeettinen koordinaattijärjestelmä pitää olla valittuna sekä lähtö- että tulostiedoissa.",
                    "sourceHeight": "Lähtötietojen korkeusjärjestelmää ei ole valittu.",
                    "targetHeight": "Tulostietojen korkeusjärjestelmää ei ole valittu.",
                    "noInputData": "Ei muunnettavia koordinaatteja.",
                    "noInputFile": "Lähtöaineiston sisältävä tiedosto pitää olla valittuna.",
                    "noFileName": "Muodostettavalle tiedostolle pitää antaa tiedostonimi.",
                    "decimalCount": "Desimaalien tarkkuus pitää olla 0 tai positiivnen kokonaisluku.",
                    "headerCount": "Otsakerivien määrä pitää olla 0 tai positiivinen kokonaisluku.",
                    "doubleComma": "Desimaali- ja koordinaattierotin eivät voi molemmat olla pilkkuja.",
                    "doubleSpace": "Kulman muoto/yksikkö ei voi sisältää välilyöntejä, jos koordinaattierotin on Välilyönti.",
                    "noFileSettings": "Tiedosto asetuksia ei ole annettu.",
                    "noCoordinateSeparator": "Koordinaattierotin pitää olla valittuna.",
                    "noDecimalSeparator":"Desimaalierotin pitää olla valittuna."
                },
                "responseErrors": {
                    "title": "Virhe muunnoksessa!",
                    "generic": "Koordinaattimuunnos epäonnistui...",
                    "invalid_coord": "Koordinaatti virheellinen. Tarkasta, että muunnettavat koordinaatit on oikeassa muodossa sekä geodeettinen koordinaatti- ja kokeusjärjestelmä ovat oikein.",
                    "invalid_number": "Koordinaatti virheellinen. Tarkasta..",
                    "invalid_coord_in_array": "Koordinaatti virheellinen. Tarkasta..",
                    "no_coordinates": "Ei koordinaatteja",
                    "invalid_file_settings": "Invalid file settings",
                    "no_file": "No file entry",
                    "invalid_first_coord": "Tiedostossa virheellinen koordinaatti. Tarkasta, että otsakerivit, käytä tunnistetta sekä geoodeettinen koordinaatti- ja korkeusjärjestelmä ovat määritetty oikein.",
                    "invalid_coord_in_line": "Tiedostossa virheellinen koordinaatti {line} rivillä {index, number}."
                },
                "responseFile": {
                    "title": "Attention!",
                    "hasMoreCoordinates": "Lähtöaineistosta ei voida muuntaa taulukkoon yli {maxCoordsToArray, number} koordinaattia. Jos haluat muuntaa kaikki koordinaatit, käytä Vie tulokset tiedostoon -toimintoa."
                }
            }
        },
        "dataSource": {
            "title": "Koordinaattitietojen lähde",
            "confirmChange": "Muunnettavat koordinaatit tyhjennetään ja koordinaattijärjestelmän tiedot poistetaan. Haluatko jatkaa?",
            "file": {
                "label": "Tiedostosta",
                "info":  "Valitse lähtöaineiston sisältävä tiedosto ja sen asetukset.",
                "action": "Muokkaa"
            },
            "keyboard": {
                "label": "Näppäimistöltä",
                "info": "Syötä lähtötiedot Muunnettavat koordinaatit -taulukkoon."
            },
            "map": {
                "label": "Valitse sijainnit kartalta",
                "info": "Valitse yksi tai useampi piste kartalta klikkaamalla.",
                "action": "Valitse"
            }
        },
        "mapMarkers":{
            "show":{
                "title": "Näytä sijainnit kartalla",
                "info" : "Tarkastele muunnettuja koordinaatteja kartalla.",
                "errorTitle": "Virhe sijaintien näyttämisessä",
                "noCoordinates": "Ei koordinaatteja näytettäväksi kartalla",
                "noSrs": "Geodeettinen koordinaattijärjestelmä pitää olla valittuna lähtötiedoissa, jotta pisteet voidaan näyttää kartalla.",
                "lon": "Lon",
                "lat": "Lat",
                "north": "N",
                "east": "E"
            },
            "select":{
                "title": "Näytä sijainnit kartalla",
                "info": "Valitse yksi tai useampia pisteitä kartalta klikkaamalla.",
                "add": "Add markers",
                "remove": "Remove markers"
            }
        },
        "actions": {
            "convert": "Transform",
            "clearTable": "Clear tables",
            "showMarkers": "Show markers on the map",
            "export": "Transform to file",
            "select": "Select",
            //"selectFromMap": "Siirry valitsemaan.",
            "cancel": "Cancel",
            "done": "Done",
            "ok": "Ok",
            "close": "Close"
        },
        "fileSettings": {
            "options": {
                "decimalSeparator": "Decimal separator",
                "coordinateSeparator": "Coordinate separator",
                "headerCount": "Header line count",
                "decimalCount": "Decimal precision",
                "reverseCoords": "Coordinates reversed",
                "useId": "Use id infront",
                "writeHeader": "Write a header",
                "useCardinals": "Use cardinals (N,E,W,S)",
                "lineEnds": "Line ends to output",
                "choose": "Choose",
                "degreeFormat":{
                    "label": "Angle pattern",
                    "degree": "Degree",
                    "gradian": "Grade",
                    "radian": "Radian"
                },
                "lineSeparator": {
                    "label": "Line separator",
                    "win": "Windows / DOS",
                    "unix": "Unix",
                    "mac": "MacOS"
                },
                "delimeters":{
                    "point": "Point",
                    "comma": "Comma",
                    "tab": "Tabulator",
                    "space": "Space",
                    "semicolon": "Semicolon"
                }
            },
            "export": {
                "title": "Aineiston muodostaminen",
                "fileName": "Tiedoston nimi"
            },
            "import": {
                "title": "Lähtöaineiston ominaisuudet"
            }
        },
        "infoPopup": {
            "description": "Kuvaus",
            "epsgSearch": {
                "title": "Haku EPSG-koodin perusteella",
                "info": "Voit hakea geodeettisen koordinaattijärjestelmän EPSG-koodin avulla. Syötä koodi pelkkänä numerona esim. 3067.",
                "listItems": []
            },
            "geodeticDatum": {
                "title": "Geodeettinen datumi",
                "info": "Geodeettinen datumi: datumi, joka kuvaa kaksi- tai kolmiulotteisen koordinaatiston suhdetta Maahan.",
                "listItems" : [
                    "Suhde voidaan luoda määrittelemällä joukolle pisteitä konventionaaliset koordinaattiarvot",
                    "Esimerkkejä geodeettisesta datumista ovat mm. EUREF-FIN ja kartastokoordinaattijärjestelmä."
                ]
            },
            "coordinateSystem":{
                "title": "Koordinaatisto",
                "info": "Koordinaatisto: matemaattisten sääntöjen joukko, jolla määritellään se, miten pisteille annetaan koordinaatit.",
                "listItems" : [
                    "Koordinaatisto voidaan hahmottaa koordinaattiakselien muodostamaksi mitta-akselistoksi.",
                    "Erityyppisiä koordinaatistoja ovat esimerkiksi suorakulmainen koordinaatisto, tasokoordinaatisto, napakoordinaatisto, geodeettinen koordinaatisto, pallokoordinaatisto ja lieriökoordinaatisto.",
                    "Geodesian alalla termi terrestrinen vertauskehys korvaa aiemmin käytetyn koordinaatisto-termin."
                ]
            },
            "mapProjection":{
                "title": "Karttaprojektiojärjestelmä",
                "info": "Karttaprojektiojärjestelmä: joukko sääntöjä, joiden avulla määrätään, kuinka haluttu alue kuvataan joukolla karttaprojektioita",
                "listItems" : [
                    "Säännöillä voidaan esimerkiksi sitoa käytettävät karttaprojektiot ja projektiokaistat. Projektiokaistojen osalta järjestelmä voi määrittää kaistoille esimerkiksi tunnisteet, keskimeridiaanien tai -paralleelien mittakaavan, leveyden, pituuden ja päällekkäisyyden."
                ]
            },
            "geodeticCoordinateSystem":{
                "title": "Geodeettinen koordinaattijärjestelmä",
                "info": "Geodeettinen koordinaattijärjestelmä: koordinaattijärjestelmä, joka perustuu geodeettiseen datumiin.",
                "listItems" : [
                    "Koordinaattijärjestelmä: järjestelmä, joka muodostuu datumin avulla reaalimaailmaan kiinnitetystä koordinaatistosta.",
                    "Koordinaattijärjestelmän avulla kohteen sijainti voidaan ilmaista yksikäsitteisesti.",
                    "Koordinaattijärjestelmä voi olla globaali, alueellinen (käytössä esim. yhden mantereen alueella) tai paikallinen (käytössä esim. yhden valtion tai kunnan alueella).",
                    "Suomen valtakunnallinen tasokoordinaattijärjestelmä on ETRS-TM35FIN."
                ]
            },
            "heightSystem":{
                "title":"Korkeusjärjestelmä",
                "info": "Korkeusjärjestelmä: yksiulotteinen koordinaattijärjestelmä, joka perustuu korkeusdatumiin.",
                "listItems" : [
                    "Suomessa käytetään valtakunnallisissa töissä JHS 163-suosituksen mukaista N2000-korkeusjärjestelmää."
                ]
            },
            "fileName":{
                "title":"Tiedoston nimi",
                "info": "",
                "paragraphs" : [],
                "listItems" : []
            },
            "decimalCount":{
                "title":"Desimaalien määrä",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla kerrotaan ohjelmalle kuinka monta desimaalia tulosteessa halutaan olevan."
                ],
                "listItems" : []
            },
            "coordinateSeparator":{
                "title":"Sarake-erotin",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla määritetään millainen merkkijono erottaa syötteessä koordinaattiarvot toisistaan.",
                    "Jos koordinaatteja edeltää jokin tunniste tai seuraa jokin merkkijono, tulee nämäkin olla erotettuna samalla erottimella."
                ],
                "listItems" : []
            },
            "headerLineCount":{
                "title":"Otsakerivien määrä",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla pystyy ohjelmalle kertomaan kuinka monta riviä tiedoston alusta ohitetaan.",
                    "Ohittamisen syynä voi olla, että tiedoston alussa on esimerkiksi sanallinen kuvaus tiedoston sisällöstä."
                ],
                "listItems" : []
            },
            "unitFormat":{
                "title":"Kulman muoto/yksikkö",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla kerrotaan ohjelmalle missä muodossa kulma-arvot ovat. Tuettuja kulmayksikköjä ovat: Aste, Gooni (graadi) ja Radiaani.",
                    "Lisäksi asteesta johdetut sexagesimaalimuodot ovat tuettuja. Jos näissä muodoissa esimerkiksi asteet, kaariminuutit ja kaarisekunnit ovat erotettuina, hyväksyy ohjelma erottimena tabulaattorin, pilkun ja puolipisteen, mutta ei välilyöntiä."
                ],
                "listItems" : []
            },
            "decimalSeparator":{
                "title":"Desimaalierotin",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla pystyy kertomaan mikä merkki toimii desimaalierotin.",
                    "Desimaalierottimen tulee poiketa koordinaattiarvot erottavasta merkistä. Kun koordinaattiarvot erottaa esimerkiksi pilkku sekä joukko välilyöntejä, niin desimaalierottimen on oltava piste!"
                ],
                "listItems" : []
            },
            "lineSeparator":{
                "title":"Rivin erotin",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla kerrotaan ohjelmalle mitä merkkiä/merkkijonoa käytetään erottamaan toisistaan rivit (pisteet)."
                ],
                "listItems" : []
            },
            "prefixId":{
                "title":"Koordinaattiarvoja edeltää pisteen tunniste",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla pystyy ohjelmalle kertomaan, että jokaisen pisteen koordinaattiarvoja edeltää samalla rivillä pisteen tunniste (ID).",
                    "Pisteen tunnisteen tulee olla erotettuna koordinaattiarvoista samalla merkkijonolla kuin koordinaattiarvot ovat erotettuina toisistaan.",
                    "Tunnisteen ei tarvitse olla numeerinen."
                ],
                "listItems" : []
            },
            "reverseCoordinates":{
                "title":"Koordinaatit käänteisesti",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla pystyy määrittämään ovatko tiedoston pisteiden kaksi ensimmäistä koordinaattiarvoa käänteisessä järjestyksessä suhteessa koordinaatiston kuvailussa annettuun järjestykseen.",
                    "Esimerkiksi kkj:n koordinaatit ovat lähtökohtaisesti jäjestyksessä, jossa ensimmäisenä on x-koordinaatti ja sitä seuraa y-koordinaatti. x-akseli osoittaa pohjoiseen ja y-akseli itään. Kun valitsee käänteisen järjestyksen, tulee tiedostossa y-koordinaatin edeltää x-koordinaattia."
                ],
                "listItems" : []
            },
            "writeHeader":{
                "title":"Otsakerivin tulostaminen tiedostoon",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla käyttäjä voi kertoa haluaako tulostiedostoon metatietoa koordinaateista otsakeriville."
                ],
                "listItems" : []
            },
            "lineEnds":{
                "title":"Tulosteeseen rivin loput",
                "info": "",
                "paragraphs": [
                    "Ominaisuuden avulla pystyy kertomaan haluaako tulosteeseen kirjoitettavan myös jokaisella rivillä annetun pisteen koordinaatteja seuraavan merkkijonon."
                ],
                "listItems" : []
            },
            "useCardinals":{
                "title":"Kardinaalien käyttö",
                "info": "",
                "paragraphs": [
                    "Ominaisuudella määritetään kirjoitetaanko tulosteeseen koordinaattiarvojen perään niiden ilmansuunnat. Tällöin miinusmerkit poistetaan koordinaattiarvoista.",
                    "Ilmansuunnat annetaan kirjoittamalla joko N, E, W tai S koordinaattiarvon perään."
                ],
                "listItems" : []
            }
        }
    }
});
