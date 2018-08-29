Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "coordinatetransformation",
    "value": {
        "title": "Koordinaattimuunnos",
        "tile": {
            "title": "Koordinaattimuunnos"
        },
        "flyout": {
            "title":"Koordinaattimuunnos",
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
                "noFilter": "Mikä tahansa",
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
                    "choose": "Valitse",
                    "kkj": "KKJ kaista {zone, number}",
                    "ykj": "KKJ kaista 3 / YKJ"
                },
                "heightSystem":{
                    "label": "Korkeusjärjestelmä",
                    "none": "Ei mitään"
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
                    "2DTo3D": "Valitsemissasi lähtötiedoissa ei ole korkeusarvoja, mutta tulostiedoissa on. Lähtöaineiston korkeusarvoiksi lisätään 0 ja korkeusjärjestelmäksi N2000. Haluatko jatkaa?"
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
                    "noFileSettings": "Tiedosto asetuksia ei ole annettu.",
                    "noCoordinateSeparator": "Koordinaattierotin pitää olla valittuna.",
                    "noDecimalSeparator":"Desimaalierotin pitää olla valittuna."

                },
                "responseErrors": {
                    "title": "Virhe muunnoksessa!",
                    "generic": "Koordinaattimuunnos epäonnistui...",
                    "invalid_coord": "Koordinaatti virheellinen. Tarkasta, että muunnettavat koordinaatit on oikeassa muodossa sekä geodeettinen koordinaatti- ja kokeusjärjestelmä ovat oikein.",
                    "invalid_number": "Koordinaatti virheellinen. Tarkasta..", //can we get row number from file
                    "no_coordinates": "Ei koordinaatteja (pitäisi tulla käytännössä vain tiedostojen kanssa).",
                    "invalid_file_settings": "Tiedoston asetukset virheelliset.", //can't be user's fault
                    "no_file": "Lähetetystä pyynnöstä ei löytynyt tiedostoa.", //can't be user's fault
                    "invalid_coord_length": "Tiedostosta ei saatu muodostettua koordinaattia annetuilla asetuksilla. Tarkasta, että koordinaatti erotin, otsakerivien määrä, käytä tunnistetta sekä geoodeettinen koordinaatti- ja korkeusjärjestelmä (dimensio) valinnat vastaavat tiedoston sisältöä.",
                    "invalid_coord_in_row": "Tiedostossa on rivillä: {rowIndex, number} virheellinen koordinaattirivi: {coordinate} <br> Tarkasta, että koordinaattierotin ja otsakerivien määrä valinnat vastaavat tiedoston sisältöä."
                },
                "responseFile": {
                    "title": "Huomio!",
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
                "info": "Syötä lähtötiedot Muunnettavat koordinaatit -taulukkoon.",
                "action": ""
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
                "info": "Tarkastele muunnettuja koordinaatteja kartalla.",
                "errorTitle": "Virhe sijaintien näyttämisessä",
                "transformError": "Muunna koordinaatit ennen sijaintien näyttämistä kartalla.",
                "lon": "Lon",
                "lat": "Lat",
                "north": "N",
                "east": "E"
            },
            "select":{
                "title": "Valitse sijainnit kartalta",
                "info": "Valitse yksi tai useampia pisteitä kartalta klikkaamalla."
            }
        },
        "actions": {
            "convert": "Muunna",
            "clearTable": "Tyhjennä taulukot",
            "showMarkers": "Näytä sijainnit kartalla",
            "export": "Muunna tiedostoon",
            "select": "Valitse",
            "selectFromMap": "Siirry valitsemaan.",
            "cancel": "Peruuta",
            "done": "Valmis",
            "ok": "Ok",
            "close": "Sulje"
        },
        "fileSettings": {
            "options": {
                "decimalSeparator": "Desimaalierotin",
                "coordinateSeparator": "Koordinaattierotin",
                "headerCount": "Otsakerivien määrä",
                "decimalCount": "Desimaalien tarkkuus",
                "reverseCoords": "Koordinaatit käänteisesti",
                "useId": "Käytä tunnistetta",
                "writeHeader": "Kirjoita otsakerivi tiedostoon",
                "useCardinals": "Käytä kardinaaleja (N,E,W,S)",
                "lineEnds": "Tulosteeseen rivin loput",
                "choose": "Valitse",
                "degreeFormat":{
                    "label": "Kulman muoto/yksikkö",
                    "degree": "Aste",
                    "gradian": "Gooni (graadi)",
                    "radian": "Radiaani"
                },
                "lineSeparator": {
                    "label": "Rivin erotin",
                    "win": "Windows / DOS",
                    "unix": "Unix",
                    "mac": "MacOS"
                },
                "delimeters":{
                    "point": "Piste",
                    "comma": "Pilkku",
                    "tab": "Tabulaattori",
                    "space": "Välilyönti",
                    "semicolon": "Puolipiste"
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
                "info": "Datumi, joka kuvaa kaksi- tai kolmiulotteisen koordinaatiston suhdetta Maahan.",
                "listItems" : [
                    "Datumi: parametri tai parametrijoukko, joka määrittelee koordinaatiston origon, mittakaavan ja orientaation.",
                    "Esimerkkejä geodeettisesta datumista ovat mm. EUREF-FIN ja kartastokoordinaattijärjestelmä."
                ]
            },
            "coordinateSystem":{
                "title": "Koordinaatisto",
                "info": "Matemaattisten sääntöjen joukko, jolla määritellään se, miten pisteille annetaan koordinaatit.",
                "listItems" : [
                    "Erityyppisiä koordinaatistoja ovat esimerkiksi suorakulmainen koordinaatisto, tasokoordinaatisto, napakoordinaatisto, geodeettinen koordinaatisto, pallokoordinaatisto ja lieriökoordinaatisto."
                ]
            },
            "mapProjection":{
                "title": "Karttaprojektiojärjestelmä",
                "info": "Joukko sääntöjä, joiden avulla määrätään, kuinka haluttu alue kuvataan joukolla karttaprojektioita",
                "listItems" : [
                    "Karttaprojektio: menetelmä, jolla maapallon kolmiulotteinen pinta kuvataan kaksiulotteiselle karttatasolle.",
                    "Säännöillä voidaan esimerkiksi sitoa käytettävät karttaprojektiot ja projektiokaistat. Projektiokaistojen osalta järjestelmä voi määrittää kaistoille esimerkiksi tunnisteet, keskimeridiaanien tai -paralleelien mittakaavan, leveyden, pituuden ja päällekkäisyyden."
                ]
            },
            "geodeticCoordinateSystem":{
                "title": "Geodeettinen koordinaattijärjestelmä",
                "info": "Koordinaattijärjestelmä, joka perustuu geodeettiseen datumiin.",
                "listItems" : [
                    "Koordinaattijärjestelmä: järjestelmä, joka muodostuu datumin avulla reaalimaailmaan kiinnitetystä koordinaatistosta.",
                    "Suomen valtakunnallinen tasokoordinaattijärjestelmä on ETRS-TM35FIN."
                ]
            },
            "heightSystem":{
                "title":"Korkeusjärjestelmä",
                "info": "Yksiulotteinen koordinaattijärjestelmä, joka perustuu korkeusdatumiin.",
                "listItems" : [
                    "Korkeusdatumi: datumi, joka määrittelee painovoimaan liittyvien korkeuksien tai syvyyksien suhteen Maahan.",
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
