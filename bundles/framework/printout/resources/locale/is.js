Oskari.registerLocalization(
{
    "lang": "is",
    "key": "Printout",
    "value": {
        "title": "Prenta kortaglugga",
        "flyouttitle": "Prenta kortaglugga",
        "desc": "",
        "btnTooltip": "Prenta núverandi kortaglugga sem PNG mynd eða PDF skrá.",
        "BasicView": {
            "title": "Prenta kortaglugga",
            "name": {
                "label": "Nafn á korti",
                "placeholder": "verður að vera",
                "tooltip": "Sláðu inn nafn á útprentuninni. Vinsamlegast athugaðu tungumálið sem er notað í kortalögunum."
            },
            "language": {
                "label": "Tungumál",
                "options": {
                    "fi": "finnska",
                    "sv": "sænska",
                    "en": "enska"
                },
                "tooltip": "Veldu tungumál fyrir útprentunina. Vinsamlegast athugaðu tungumálið sem er notað í notendaviðmótinu og kortalögunum."
            },
            "size": {
                "label": "Stærð og stefna",
                "tooltip": "Veldu prentstærð og hvernig blaðið snýr. Þú getur séð uppfærslur í forskoðunarglugganum.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 portrait",
                        "classForPreview": "forskoðun-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_landslags",
                        "label": "A4 landslags",
                        "classForPreview": "forskoðun-landslags"
                    },
                    {
                        "id": "A3",
                        "label": "A3 portrait",
                        "classForPreview": "forskoðun-portrait"
                    },
                    {
                        "id": "A3_Landslags",
                        "label": "A3 landslags",
                        "classForPreview": "forskoðun-landslags"
                    }
                ]
            },
            "preview": {
                "label": "Forskoðun",
                "tooltip": "Smelltu á myndina í forskoðunarham til að opna stærri mynd í öðrum glugga.",
                "pending": "Forskoðunarmyndin verður uppfærð fljótlega.",
                "notes": {
                    "extent": "Skoðaðu umfang kortsins í forskoðunarglugganum.",
                    "restriction": "Aðeins er sýnt bakgrunnskort í forskoðunarglugganum."
                }
            },
            "buttons": {
                "save": "Prenta",
                "ok": "Í lagi",
                "back": "Fyrri",
                "cancel": "Hætta við"
            },
            "location": {
                "label": "Staðsetning og mælikvarði",
                "tooltip": "Prentkvarðinn passar við mælikvarðann sem er notaður til að forskoða kortið.",
                "zoomlevel": "Mælikvarði."
            },
            "settings": {
                "label": "Viðbótarstillingar",
                "tooltip": "Veldu stillingar fyrir útprentunina."
            },
            "format": {
                "label": "Skráarsnið",
                "tooltip": "Veldu skráarsnið fyrir útprentunina.",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG mynd"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF skjal"
                    }
                ]
            },
            "mapTitle": {
                "label": "Heiti korts",
                "tooltip": "Bættu við heiti korts"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Sýna merki Landmælinga Íslands í útprentuninni.",
                        "tooltip": "Þú getur falið merki Landmælinga Íslands ef það er nauðsynlegt.",
                        "checked": "yfirfarið"
                    },
                    {
                        "id": "Mælikvarði síðu.",
                        "label": "Bæta mælikvarða við útprentun á korti.",
                        "tooltip": "Ef þú vilt geturðu bætt mælikvarða við útprentun á korti.",
                        "checked": "yfirfarið"
                    },
                    {
                        "id": "pageDate",
                        "label": "Sýna dagsetningu í útprentuninni.",
                        "tooltip": "Þú getur bætt dagsetningu við í útprentuninni.",
                        "checked": "yfirfarið"
                    }
                ]
            },
            "help": "Hjálp",
            "error": {
                "title": "Villa",
                "size": "Villa í stærðarskilgreiningum.",
                "name": "Það verður að vera nafn.",
                "nohelp": "Það er engin hjálp.",
                "saveFailed": "Það tókst ekki að prenta kortið. Reyndu aftur síðar.",
                "nameIllegalCharacters": "Nafnið inniheldur stafi sem eru ekki leyfðir. Það má nota stafi frá a-ö, tölustafi, bandstrik og undirstrik."
            }
        },
        "StartView": {
            "text": "Þú getur prentað út kortið sem þú varst að búa til sem PNG mynd eða PDF skrá.",
            "info": {
                "maxLayers": "Þú getur notað í mesta lagi átta kortalög í útprentuninni.",
                "printoutProcessingTime": "Það getur tekið tíma að prenta út kortið ef mörg lög eru valin."
            },
            "buttons": {
                "continue": "Halda áfram",
                "cancel": "Hætta við"
            }
        }
    }
});
