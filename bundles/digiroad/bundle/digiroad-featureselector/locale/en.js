Oskari.registerLocalization({
	"lang" : "en",
	"key" : "FeatureSelector",
	"value" : {
		"title" : "Selected features",
		"desc" : "",
        "success" : "Succesfully sent the data to Digiroad maintenance. You can view the edited feature in 'My data -> edited features'",
		"errors" : {
            "title": "Error!",
            "generic": "System error. Please try again later.",
			"loadFailed" : "Error loading features. Reload the page in your browser.",
            "noResults": "The search returned no results.",
            "dataSendFailed": "Error sending data to Digiroad maintenance. This incident has been logged."
		},
		"notification": {
            "featureEdited": {
                "title": "Data sent succesfully",
                "message": "You can find the edited feature in My data."
            },
            "uneditable": {
                "title": "Ei muokattavissa",
                "message": "Et voi muokata maanteiden ominaisuustietoja!"
            }
        },
        "loading" : "Loading...",
        "gridheaders": {
            "objectId": "Tunnus",
            "vaylatyyppi": {
                "h2": "Väylätyyppi",
                "columns": [
                    {"id": "vaylatyyppi", "name": "Väylätyyppi", "field": "VAYLATYYPP", "editor": "select"},
                    {"id": "toiminnallinen_luokka", "name": "Toiminnallinen luokka", "field": "TOIMINNALL", "editor": "select"},
                    {"id": "nimi1_fi", "name": "Nimi (suomi)", "field": "NIMI1_SU", "editor": "text"},
                    {"id": "nimi1_sv", "name": "Nimi (ruotsi)", "field": "NIMI1_RU", "editor": "text"}
                ]
            },
            "toiminnallinen_luokka": {
                "h2": "Toiminnallinen luokka",
                "columns": [
                    {"id": "toiminnallinen_luokka", "name": "Toiminnallinen luokka", "field": "TOIMINNALL", "editor": "select"},
                    {"id": "vaylatyyppi", "name": "Väylätyyppi", "field": "VAYLATYYPP", "editor": "select"},
                    {"id": "nimi1_fi", "name": "Nimi (suomi)", "field": "NIMI1_SU", "editor": "text"},
                    {"id": "nimi1_sv", "name": "Nimi (ruotsi)", "field": "NIMI1_RU", "editor": "text"}
                ]
            },
            "tie-elementin_tyyppi": {
                "h2": "Tie-elementin tyyppi",
                "columns": [
                    {"id": "tie-elementin_tyyppi", "name": "Tie-elementin tyyppi", "field": "TYYPPI", "editor": "select"},
                    {"id": "nimi1_fi", "name": "Nimi (suomi)", "field": "NIMI1_SU", "editor": "text"},
                    {"id": "nimi1_sv", "name": "Nimi (ruotsi)", "field": "NIMI1_RU", "editor": "text"}
                ]
            },
            "liikennevirran_suunta": {
                "h2": "Liikennevirran suunta",
                "columns": [
                    {"id": "liikennevirran_suunta", "name": "Liikennevirran suunta", "field": "LIIKENNEVI", "editor": "select"}
                ]
            },
            "nopeusrajoitus": {
                "h2": "Nopeusrajoitus",
                "columns": [
                    {"id": "nopeusrajoitus", "name": "Km/h", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ass_korkeus": {
                "h2": "Ajoneuvon suurin sallittu korkeus",
                "columns": [
                    {"id": "ass_korkeus", "name": "Senttimetriä", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ass_pituus": {
                "h2": "Ajoneuvon tai -yhdistelmän suurin sallittu pituus",
                "columns": [
                {"id": "ass_pituus", "name": "Senttimetriä", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ass_yhdistelma_massa": {
                "h2": "Ajoneuvoyhdistelmän suurin sallittu massa",
                "columns": [
                    {"id": "ass_yhdistelma_massa", "name": "Senttimetriä", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ass_akselimassa": {
                "h2": "Ajoneuvon suurin sallittu akselimassa",
                "columns": [
                    {"id": "ass_yhdistelma_akselimassa", "name": "Senttimetriä", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ass_massa": {
                "h2": "Ajoneuvon suurin sallittu massa",
                "columns": [
                    {"id": "ass_massa", "name": "Senttimetriä", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ass_leveys": {
                "h2": "Ajoneuvon suurin sallittu leveys",
                "columns": [
                    {"id": "ass_leveys", "name": "Senttimetriä", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ass_telimassa": {
                "h2": "Ajoneuvon suurin sallittu telimassa",
                "columns": [
                    {"id": "ass_telimassa", "name": "Senttimetriä", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ajoneuvo_sallittu": {
                "h2": "Ajoneuvo sallittu",
                "columns": [
                    {"id": "ajoneuvo_tyyppi", "name": "Tyyppi", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "ajoneuvo_kielletty": {
                "h2": "Ajoneuvo kielletty",
                "columns": [
                    {"id": "ajoneuvo_tyyppi", "name": "Tyyppi", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "joukkoliikenteen_pysakki": {
                "h2": "Joukkoliikenteen pysäkki",
                "columns": [
                    {"id": "pysakki_va", "name": "Valtak. tunnus", "field": "PYSAKKI_VA", "editor": "integer"},
                    {"id": "pysakki_ty", "name": "Tyyppi", "field": "PYSAKKI_TY", "editor": "select"},
                    {"id": "pysakki_ka", "name": "Katos", "field": "PYSAKKI_KA", "editor": "select"},
                    {"id": "pysakki_su", "name": "Suunta", "field": "PYSAKKI_SU", "editor": "select"}                ]
            },
            "paikannusnimistopiste": {
                "h2": "Paikannusnimistöpiste",
                "columns": [
                    {"id": "paikannusnimistopiste", "name": "Paikannusnimistöpiste", "field": "TYYPPI", "editor": "integer"}
                ]
            },
            "palvelu": {
                "h2": "Palvelupisteet",
                "columns": [
                    {"id": "palvelu_tyyppi", "name": "Tyyppi", "field": "TYYPPI", "editor": "select"},
                    {"id": "lisatieto", "name": "Lisätieto", "field": "LISATIETO", "editor": "text"},
                    {"id": "rautatieasema_tyyppi", "name": "Rautatieas. tyyppi", "field": "RAUTATIEAS", "editor": "select"},
                    {"id": "pyspaikkojen_lkm", "name": "Pys. paikkojen lkm", "field": "PAIKKOJEN_", "editor": "integer"},
                    {"id": "lepoalue_tyyppi", "name": "Lepoalueen tyyppi", "field": "LEPOALUE_T", "editor": "select"},
                    {"id": "nimi1_fi", "name": "Nimi (suomi)", "field": "NIMI1_SU", "editor": "text"},
                    {"id": "nimi1_sv", "name": "Nimi (ruotsi)", "field": "NIMI1_RU", "editor": "text"},
                    {"id": "palvelu_paasy", "name": "Pääsy", "field": "PALVELU_PA", "editor": "integer"},
                ]
            },
            "kaantymismaarays": {
                "h2": "Kääntymismääräykset",
                "columns": [
                    {"id": "firstElementId", "name": "Alkuelementti", "field": "firstElementId"},
                    {"id": "lastElementId", "name": "Loppuelementti", "field": "lastElementId"},
                    {"id": "kaantymismaarays_tyyppi", "name": "Tyyppi", "field": "TYYPPI"}
                ]
            },
            "rautatien_tasoristeys": {
                "h2": "Rautatien tasoristeys",
                "columns": [
                    {"id": "tasoristeys_tyyppi", "name": "Tyyppi", "field": "DYN_ARVO", "editor": "select"}
                ]
            },
            "suljettu_yhteys": {
                "h2": "Suljettu yhteys",
                "columns": [
                    {"id": "binary", "name": "Suljettu", "field": "DYN_ARVO", "editor": "select"}
                ]
            },
            "avattava_puomi": {
                "h2": "Avattava puomi",
                "columns": [
                    {"id": "binary", "name": "Puomi", "field": "DYN_ARVO", "editor": "select"}
                ]
            },
            "tunneli": {
                "h2": "Silta, alikulku tai tunneli",
                "columns": [
                    {"id": "tunneli_tyyppi", "name": "Tyyppi", "field": "SILTATAITU", "editor": "select"},
                    {"id": "nimi1_fi", "name": "Nimi (suomi)", "field": "NIMI1_SU", "editor": "text"},
                    {"id": "nimi1_sv", "name": "Nimi (ruotsi)", "field": "NIMI1_RU", "editor": "text"}
                ]
            },
            "paallystetty_tie": {
                "h2": "Päällystetty tie",
                "columns": [
                    {"id": "binary", "name": "Päällystetty", "field": "DYN_ARVO", "editor": "select"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "taajama": {
                "h2": "Taajama",
                "columns": [
                    {"id": "binary", "name": "Taajamassa", "field": "DYN_ARVO", "editor": "select"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "kelirikko": {
                "h2": "Kelirikko",
                "columns": [
                    {"id": "binary", "name": "Kelirikko", "field": "DYN_ARVO", "editor": "select"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "valaistu_tie": {
                "h2": "Valaistu tie",
                "columns": [
                    {"id": "binary", "name": "Valaistu", "field": "DYN_ARVO", "editor": "select"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "tien_leveys": {
                "h2": "Tien leveys",
                "columns": [
                    {"id": "tien_leveys", "name": "Cm", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "liikennemaara": {
                "h2": "Liikennemäärä",
                "columns": [
                    {"id": "liikennemaara", "name": "Autoja/vrk", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            },
            "talvinopeusrajoitus": {
                "h2": "Talvinopeusrajoitus",
                "columns": [
                    {"id": "talvinopeusrajoitus", "name": "Km/h", "field": "DYN_ARVO", "editor": "integer"},
                    {"id": "vaikutussuunta", "name": "Vaikutussuunta", "field": "VAIKUTUSSU", "editor": "select"}
                ]
            }
        },
        "mappings": {
            "binary": {
                "int": {
                    1: "Kyllä",
                    0: "Ei"
                },
                "string": {
                    "Kyllä": 1,
                    "Ei": 0
                }
            },
            "vaikutussuunta": {
                "int": {
                    1: "Molempiin suuntiin",
                    2: "Digitointisuuntaan",
                    3: "Digitointisuuntaa vastaan"
                },
                "string": {
                    "Molempiin suuntiin": 1,
                    "Digitointisuuntaan": 2,
                    "Digitointisuuntaa vastaan": 3
                }
            },
            "vaylatyyppi": {
                "int": {
                    1: "Maantie",
                    2: "Katu",
                    3: "Yksityistie",
                    4: "Kevyen liikenteen väylä",
                    5: "Rautatie",
                    6: "Lautta"
                },
                "string": {
                    "Maantie": 1,
                    "Katu": 2,
                    "Yksityistie": 3,
                    "Kevyen liikenteen väylä": 4,
                    "Rautatie": 5,
                    "Lautta": 6
                }
            },
            "toiminnallinen_luokka": {
                "int": {
                    1: "Seudullinen pääkatu / valtatie",
                    2: "Seudullinen pääkatu / kantatie",
                    3: "Alueellinen pääkatu / seututie",
                    4: "Kokoojakatu / yhdystie",
                    5: "Liityntäkatu / tärkeä yksityistie",
                    6: "Muu yksityistie",
                    10: "Kevyen liikenteen väylä"
                },
                "string": {
                    "Seudullinen pääkatu / valtatie": 1,
                    "Seudullinen pääkatu / kantatie": 2,
                    "Alueellinen pääkatu / seututie": 3,
                    "Kokoojakatu / yhdystie": 4,
                    "Liityntäkatu / tärkeä yksityistie": 5,
                    "Muu yksityistie": 6,
                    "Kevyen liikenteen väylä": 10
                }
            },
            "tie-elementin_tyyppi": {
                "int": {
                    1: "Moottoritien osa",
                    2: "Moniajorataisen tien osa (ei moottoritie)",
                    3: "Yksiajorataisen tien osa",
                    4: "Kiertoliittymän osa",
                    6: "Liitännäisliikennealueen osa",
                    8: "Ramppi",
                    10: "Huolto- tai pelastustien osa",
                    13: "Jalankulkualueen osa",
                    14: "Pyörätien osa",
                    17: "Moottoriliikennetien osa",
                    18: "Levähdysalue"
                },
                "string": {
                    "Moottoritien osa": 1,
                    "Moniajorataisen tien osa (ei moottoritie)": 2,
                    "Yksiajorataisen tien osa": 3,
                    "Kiertoliittymän osa": 4,
                    "Liitännäisliikennealueen osa": 6,
                    "Ramppi": 8,
                    "Huolto- tai pelastustien osa": 10,
                    "Jalankulkualueen osa": 13,
                    "Pyörätien osa": 14,
                    "Moottoriliikennetien osa": 17,
                    "Levähdysalue": 18
                }
            },
            "liikennevirran_suunta": {
                "int": {
                    2: "Sallittu molempiin suuntiin",
                    3: "Sallittu digitointisuuntaa vastaan",
                    4: "Sallittu digitointisuuntaan",
                    5: "Suljettu molemmissa suunnissa"
                },
                "string": {
                    "Sallittu molempiin suuntiin": 2,
                    "Sallittu digitointisuuntaa vastaan": 3,
                    "Sallittu digitointisuuntaan": 4,
                    "Suljettu molemmissa suunnissa": 5
                }
            },
            "pysakki_ty": {
                "int": {
                    1: "Raitiovaunu",
                    2: "Linja-auto, paikallisliikenne",
                    3: "Linja-auto, kaukoliikenne",
                    4: "Linja-auto, paikallis- ja kaukoliikenne",
                    5: "Linja-auto, kaukoliikenne ja pikavuoro",
                    6: "Linja-auto, paikallis- ja kaukol. ja pikavuoro",
                    7: "Ei tietoa"
                },
                "string": {
                    "Raitiovaunu": 1,
                    "Linja-auto, paikallisliikenne": 2,
                    "Linja-auto, kaukoliikenne": 3,
                    "Linja-auto, paikallis- ja kaukoliikenne": 4,
                    "Linja-auto, kaukoliikenne ja pikavuoro": 5,
                    "Linja-auto, paikallis- ja kaukol. ja pikavuoro": 6,
                    "Ei tietoa": 7
                }
            },
            "pysakki_ka": {
                "int": {
                    1: "Ei katosta",
                    2: "Kyllä",
                    3: "Ei tietoa"
                },
                "string": {
                    "Ei katosta": 1,
                    "Kyllä": 2,
                    "Ei tietoa": 3
                }
            },
            "pysakki_su": {
                "int": {
                    1: "Digitointisuuntaan",
                    2: "Digitointisuuntaa vastaan"
                },
                "string": {
                    "Digitointisuuntaan": 1,
                    "Digitointisuuntaa vastaan": 2
                }
            },
            "palvelu_tyyppi": {
                "int": {
                    1: "Sairaala / poliklinikka",
                    2: "Ensiapupiste",
                    3: "Tavaraliikennekeskus",
                    4: "Tulli",
                    5: "Rajanylityspaikka",
                    6: "Lepoalue",
                    7: "Kaupungin keskusta",
                    8: "Lentokenttä",
                    9: "Laivaterminaali",
                    10: "Taksiasema",
                    11: "Rautatieasema",
                    12: "Pysäköintialue",
                    13: "Autojen lastausterminaali",
                    14: "Linja- ja kuorma-autojen pysäköintialue",
                    15: "Pysäköintitalo",
                    16: "Linja-autoasema",
                    17: "Maamerkki"
                },
                "string": {
                    "Sairaala / poliklinikka": 1,
                    "Ensiapupiste": 2,
                    "Tavaraliikennekeskus": 3,
                    "Tulli": 4,
                    "Rajanylityspaikka": 5,
                    "Lepoalue": 6,
                    "Kaupungin keskusta": 7,
                    "Lentokenttä": 8,
                    "Laivaterminaali": 9,
                    "Taksiasema": 10,
                    "Rautatieasema": 11,
                    "Pysäköintialue": 12,
                    "Autojen lastausterminaali": 13,
                    "Linja- ja kuorma-autojen pysäköintialue": 14,
                    "Pysäköintitalo": 15,
                    "Linja-autoasema": 16,
                    "Maamerkki": 17
                }
            },
            "rautatieasema_tyyppi": {
                "int": {
                    1: "Merkittävä rautatieasema",
                    2: "Vähäisempi rautatieasema",
                    3: "Maanalainen/metroasema"
                },
                "string": {
                    "Merkittävä rautatieasema": 1,
                    "Vähäisempi rautatieasema": 2,
                    "Maanalainen/metroasema": 3
                }
            },
            "lepoalue_tyyppi": {
                "int": {
                    1: "Levähdysalue, kattava varustelu",
                    2: "Levähdysalue, perusvarustelu",
                    3: "Yksityinen palvelualue",
                    4: "Ei tietoa"
                },
                "string": {
                    "Levähdysalue, kattava varustelu": 1,
                    "Levähdysalue, perusvarustelu": 2,
                    "Yksityinen palvelualue": 3,
                    "Ei tietoa": 4
                }
            },
            "kaantymismaarays_tyyppi": {
                "int": {
                    1: "Pakollinen ajosuunta",
                    2: "Kielletty kääntymissuunta",
                    4: "Fyysinen este"
                },
                "string": {
                    "Pakollinen ajosuunta": 1,
                    "Kielletty kääntymissuunta": 2,
                    "Fyysinen este": 4
                }
            },
            "tasoristeys_tyyppi": {
                "int": {
                    1: "Rautatie ei käytössä",
                    2: "Ei turvalaitteita",
                    3: "Vain valo ja/tai äänimerkki",
                    4: "Puolipuomi sekä mahd. valo ja/tai äänimerkki",
                    5: "Kokopuomi sekä mahd. valo ja/tai äänimerkki"
                },
                "string": {
                    "Rautatie ei käytössä": 1,
                    "Ei turvalaitteita": 2,
                    "Vain valo ja/tai äänimerkki": 3,
                    "Puolipuomi sekä mahd. valo ja/tai äänimerkki": 4,
                    "Kokopuomi sekä mahd. valo ja/tai äänimerkki": 5
                }
            },
            "tunneli_tyyppi": {
                "int": {
                    1: "Silta",
                    2: "Tunneli",
                    3: "Alikulku"
                },
                "string": {
                    "Silta": 1,
                    "Tunneli": 2,
                    "Alikulku": 3
                }
            },
            "ajoneuvo_tyyppi": {
                "int": {
                    1: "Kaikki",
                    2: "Moottoriajoneuvo",
                    3: "Ajoneuvo",
                    4: "Kuorma-auto",
                    5: "Linja-auto",
                    6: "Pakettiauto",
                    7: "Henkilöauto",
                    8: "Taksi",
                    9: "Moottoripyörä",
                    10: "Mopo",
                    11: "Polkupyörä",
                    12: "Jalankulkija",
                    13: "Ajoneuvoyhdistelmä",
                    14: "Traktori tai maatalousajoneuvo",
                    15: "Matkailuajoneuvo",
                    16: "Jakeluauto",
                    17: "Hälytysajoneuvo",
                    18: "Kimppakyytiajoneuvo",
                    19: "Sotilasajoneuvo",
                    20: "Vaarallista lastia kuljettava ajoneuvo",
                    21: "Huoltoajo",
                    22: "Tontille ajo",
                    23: "Läpiajo",
                    24: "A-VAK (lisäkilpi vaaralliselle lastille)",
                    25: "B-VAK (lisäkilpi vaaralliselle lastille)"
                },
                "string": {
                    "Kaikki": 1,
                    "Moottoriajoneuvo": 2,
                    "Ajoneuvo": 3,
                    "Kuorma-auto": 4,
                    "Linja-auto": 5,
                    "Pakettiauto": 6,
                    "Henkilöauto": 7,
                    "Taksi": 8,
                    "Moottoripyörä": 9,
                    "Mopo": 10,
                    "Polkupyörä": 11,
                    "Jalankulkija": 12,
                    "Ajoneuvoyhdistelmä": 13,
                    "Traktori tai maatalousajoneuvo": 14,
                    "Matkailuajoneuvo": 15,
                    "Jakeluauto": 16,
                    "Hälytysajoneuvo": 17,
                    "Kimppakyytiajoneuvo": 18,
                    "Sotilasajoneuvo": 19,
                    "Vaarallista lastia kuljettava ajoneuvo": 20,
                    "Huoltoajo": 21,
                    "Tontille ajo": 22,
                    "Läpiajo": 23,
                    "A-VAK (lisäkilpi vaaralliselle lastille)": 24,
                    "B-VAK (lisäkilpi vaaralliselle lastille)": 25
                }
            }
        }
	}
});