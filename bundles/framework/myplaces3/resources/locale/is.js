Oskari.registerLocalization(
{
    "lang": "is",
    "key": "MyPlaces3",
    "value": {
        "title": "Staðir",
        "desc": "",
        "guest": {
            "loginShort": "Skráðu þig inn til að bæta þínum stöðum á kort."
        },
        "tab": {
            "title": "Staðir",
            "nocategories": "Þú hefur ekki vistað staði.", // PersonalData removal
            "maxFeaturesExceeded": "Hámarksfjölda staðarmerkinga náð. Það er ekki hægt að hlaða öllum stöðunum inn.", // PersonalData removal
            "publishCategory": {
                "privateTooltip": "Þetta kortalag er lokað. Smelltu hér til að birta það.",
                "publicTooltip": "Þetta kortalag er opið. Smelltu hér til að afturkalla birtingu."
            },
            "addCategoryFormButton": "Nýtt kortalag", // PersonalData removal
            "addCategory": "Bæta kortalaginu við",
            "editCategory": "Breyta kortalaginu",
            "deleteCategory": "Eyða kortalagi",
            "deleteDefault": "Ekki er hægt að eyða sjálfgefnu korti.",
            "grid": {
                "name": "Örnefni",
                "desc": "Staðarlýsing",
                "createDate": "Búið til",
                "updateDate": "Uppfært",
                "measurement": "Stærð",
                "edit": "Breyta",
                "delete": "Eyða"
            },
            "confirm": {
                "deleteConfirm": "Eyða kortalagi {name}?",
                "categoryToPrivate": "Þú ert að gera kortalag {name} að einkakortalagi. Eftir þetta mun ekki lengur vera mögulegt að deila því með öðrum notendum eða fella það inn í aðra vefsíðu. Aðrir notendur geta ekki lengur skoðað kortalagið.",
                "categoryToPublic": "Þú ert að gera kortalag {name} opinbert. Þú getur deilt hlekkjum á opinbert kortalag með öðrum netnotendum eða fellt kortalagið inn í eins og kortasjá á annarri vefsíðu. Aðrir notendur geta líka séð kortalagið.",
                "deletePlace": "Viltu eyða þessum stað \"{name}\"?"
            },
            "deleteWithMove": {
                "name": "Eyða kortalagi:",
                "count": "Kortalag inniheldur {count} hluti. Viltu:",
                "delete": "1. eyða kortalaginu og stöðunum á því",
                "move": "2. færa staðina á því í kortalagið:"
            }
        },
        "tools": {
            "point": {
                "title": "Bæta við punkti",
                "tooltip": "Bæta punkti við \"Staðirnir mínir\"",
                "add": "Teiknaðu punkt með því að smella á kortið.",
                "next": "Einn staður getur innihaldið einn eða fleiri punkta.",
                "edit": "Færðu þig að punktinum með því að smella og draga."
            },
            "line": {
                "title": "Bæta við línu",
                "tooltip": "Bæta línu við \"Staðirnir mínir\".",
                "add": "Teiknaðu línu með því að bæta rofstöðum á kortið. Þú getur bætt við rofstöðum með því að smella á kortið. Hættu að teikna með því að tvísmella eða með því að smella á \"Vista sem staðinn minn\".",
                "next": "Einn staður getur innihaldið eina eða fleiri línur.",
                "edit": "Breyttu línunni með því að smella á rofstaðina og draga þá til.",
                "noResult": "0 m"
            },
            "area": {
                "title": "Bæta við svæði",
                "tooltip": "Bæta svæði við \"Staðirnir mínir\".",
                "add": "Teiknaðu svæði með því að bæta rofstöðum á brún línanna á kortið. Þú getur bætt rofstöðum við með því að smella á kortið. Til að hætta að teikna tvísmellirðu eða smellir á \"Vista sem Staðurinn minn\".",
                "next": "Einn staður getur innihaldið eitt eða fleiri svæði.",
                "edit": "Breyttu svæðinu með því að smella á rofstaðina á brún línunnar og draga þá til.",
                "noResult": "0 m²"
            }
        },
        "buttons": {
            "savePlace": "Vista sem \"staðurinn minn\"",
            "movePlaces": "Færðu staðina og eyddu laginu",
            "deleteCategoryAndPlaces": "Eyddu kortalaginu og stöðunum á því",
            "changeToPublic": "Gera opinbert",
            "changeToPrivate": "Gera óopinbert"
        },
        "placeform": {
            "title": "Staðsetja gögn",
            "tooltip": "Staðurinn er vistaður í \"Staðirnir mínir\". Þú getur skoðað hann í \"Gögnin mín\" valmyndinni. Please give the data for the place. Skylt er að skrá örnefni og lýsingu. Þú getur einnig gefið upp textann sem á að sjást á kortinu við hlið taðarins, hlekk á heimasíðuna til frekari upplýsinga um staðinn og hlekkinn á myndina um staðinn. Að lokum, til að bæta staðnum við, skaltu búa til nýtt kortalag eða velja eitt af tiltækum kortalögum.",
            "previewLabel": "Forskoðun myndar",
            "fields": {
                "name": "Örnefni",
                "description": "Staðarlýsing",
                "attentionText": "Texti á kortinu um staðinn",
                "link": "Hlekkur að upplýsingum um staðinn",
                "imagelink": "Hlekkur á myndina"
            },
            "category": {
                "label": "Kortalag",
                "newLayer": "Búa til nýtt kortalag",
                "choose": "eða velja eitt af tiltækum kortalögum:"
            },
            "validation": {
                "mandatoryName": "Örnefni vantar.",
                "invalidName": "Nafn viðfangs inniheldur stafi sem ekki eru leyfðir. Bókstafir frá a-z eru leyfðir, einnig tölustafir, bandstrik og undirstrik. Ekki eru leyfðir séríslenskir stafir fyrir utan ö.",
                "invalidDesc": "Lýsing viðfangs inniheldur stafi sem ekki eru leyfðir. Bókstafir frá a-z eru leyfðir, einnig tölustafir, bandstrik og undirstrik. Ekki eru leyfðir séríslenskir stafir fyrir utan ö."
            }
        },
        "categoryform": {
            "layerName": "Nafn á kortalagi",
            "styleTitle": "Staðsetningarmát",
            "validation": {
                "mandatoryName": "Nafn á kortalagi vantar.",
                "invalidName": "Lýsing á lögum inniheldur stafi sem ekki eru leyfðir. Bókstafir frá a-z eru leyfðir, einnig tölustafir, bandstrik og undirstrik. Ekki eru leyfðir séríslenskir stafir fyrir utan ö."
            }
        },
        "notification": {
            "place": {
                "saved": "Staðurinn hefur verið vistaður.",
                "deleted": "Staðnum var eytt.",
                "info": "Það er hægt að finna staðinn í 'Gögnin mín' valmyndinni."
            },
            "category": {
                "saved": "Kortalag vistað.",
                "updated": "Breytingar á kortalögum vistaðar.",
                "deleted": "Kortalagi eytt."
            }
        },
        "error": {
            "generic": "Kerfisvilla. Vinsamlegast reyndu aftur síðar.",
            "saveCategory": "Ekki var hægt að vista kortalagið. Vinsamlegast reyndu aftur síðar.",
            "deleteCategory": "Það kom fram villa þegar verið var að eyða.",
            "savePlace": "Ekki var hægt að vista staðinn. Vinsamlegast reyndu aftur síðar.",
            "deletePlace": "Ekki var hægt að eyða þessum stað. Vinsamlegast reyndu aftur síðar."
        }
    }
});
