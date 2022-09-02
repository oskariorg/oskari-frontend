Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "MyPlaces3",
    "value": {
        "title": "Platser",
        "desc": "",
        "guest": {
            "loginShort": "Logga in för att lägga till dina egna platser på en karta."
        },
        "tab": {
            "title": "Platser",
            "categoryTitle": "Kartlager",
            "nocategories": "Du har inte några sparade platser ännu.", // PersonalData removal
            "maxFeaturesExceeded": "Du har överskridit det maximala beloppet för de egna platserna. Alla platser har inte laddats.", // PersonalData removal
            "publishCategory": {
                "privateTooltip": "Detta kartlager är privat. Klicka här för att publicera den.",
                "publicTooltip": "Detta kartlager är offentlig. Klicka här för att avpublicera det."
            },
            "export": {
                "title":"Exportera objekt",
                "tooltip": "Ladda kartlagets objekt som GeoJSON."
            },
            "addCategoryFormButton": "Nytt kartlager", // PersonalData removal
            "addCategory": "Lägg till kartlagret",
            "editCategory": "Redigera kartlagret",
            "deleteCategory": "Ta bort kartlagret",
            "deleteDefault": "Det förvalda kartlagret kan inte tas bprt-",
            "grid": {
                "name": "Ortnamn",
                "desc": "Ortnamnsbeskrivning",
                "createDate": "Skapad",
                "updateDate": "Uppdaterad",
                "measurement": "Storlek",
                "edit": "Redigera",
                "delete": "Ta bort",
                "actions": "Handlingar"
            },
            "confirm": {
                "deleteConfirm": "Vill du ta bort kartlagret \"{name}\"?",
                "deleteConfirmMove": "Kartlager \"{0}\" innehåller {1} st. objekt. Vill du ta bort nivån och flytta objekten på den till det förvalda kartlagret \"{2}\" eller vill du ta bort kartlagret och dess platser?", // PersonalData removal
                "categoryToPrivate": "Du håller på att avpublicera kartlagret \"{name}\". Efter detta kan du inte längre dela kart-lagret eller inbädda det som en karta. Andra användare kan inte heller titta på det i Paikkatietoikkuna.",
                "categoryToPublic": "Du publicerar kartlagret \"{name}\". Du kan dela ett offentligt kartlager till andra internetanvändare eller inbädda det som en karta i en annan webbtjänst. Andra användare kan även titta på kartlagret i Paikkatietoikkuna.",
                "deletePlace": "Vill du ta bort denna plats \"{name}\"?"
            },
            "deleteWithMove": {
                "name": "Vill du ta bort kartlagret:",
                "count": "Kartlager innehåller {count} st. objekt. Vill du:",
                "delete": "1. ta bort kartlagret och dess platser",
                "move": "2. flytta objekten på den till det kartlagret:"
            }
        },
        "tools": {
            "point": {
                "title": "Lägg till punkt",
                "tooltip": "Lägg till en punkt till \"Mina platser\"",
                "add": "Rita en punkt genom att klicka på kartan.",
                "next": "En plats kan innehålla en eller flera punkter.",
                "edit": "Flytta på punkten genom att klicka och dra."
            },
            "line": {
                "title": "Lägg till linje",
                "tooltip": "Lägg till en linje till \"Mina platser\".",
                "add": "Rita en linje genom att lägga till brytpunkter till kartan. Du kan lägga till brytpunkter genom att klicka på kartan. Sluta rita genom att dubbelklicka eller genom att klicka på \"Spara som min plats\".",
                "next": "En plats kan innehålla en eller flera linjer.",
                "edit": "Redigera linjen genom att klicka och dra i brytningspunkterna.",
                "noResult": "0 m"
            },
            "area": {
                "title": "Lägg till område",
                "tooltip": "Lägg till ett område till \"Mina platser\".",
                "add": "Rita ett område genom att lägga till kantlinjens brytpunkter till kartan. Du kan lägga till brytpunkter genom att klicka på kartan. Sluta dra genom att dubbelklicka eller genom att klicka på \"Spara som min plats\".",
                "next": "En plats kan innehålla en eller flera områden.",
                "edit": "Redigera området genom att klicka och dra i brytningspunkterna.",
                "noResult": "0 m²"
            }
        },
        "buttons": {
            "savePlace": "Spara som min plats",
            "movePlaces": "Flytta platserna och ta bort lagret",
            "deleteCategoryAndPlaces": "Ta bort kartlagret och dess platser",
            "changeToPublic": "Publicera",
            "changeToPrivate": "Avpublicera"
        },
        "placeform": {
            "title": "Uppgifter om objektet",
            "tooltip": "Platsen sparas till \"Mina platser\". Du kan se dem på menyn \"Mina uppgifter\". Vänligen ge platsen ett namn och beskrivning. Platsens namn och beskrivning är obligatoriska. Du kan också skriva texten som ska visas på kartan förutom platsen, länken till webbplatsen för att få mer information om platsen och länken till bilden om platsen. Skapa slutligen ett ny kartlager eller välj en av de befintliga kartlager där platsen kommer att läggas till.",
            "previewLabel": "Förhandsvisning av bilden",
            "fields": {
                "name": "Platsnamn",
                "description": "Platsbeskrivning",
                "attentionText": "Placera text på kartan",
                "link": "Länk till information om platsen",
                "imagelink": "Länk till bilden"
            },
            "category": {
                "label": "Kartlager",
                "newLayer": "Skapa ett nytt kartlager",
                "choose": "Välja ett av dina befintliga kartlager:"
            },
            "validation": {
                "mandatoryName": "Platsnamnet saknas",
                "invalidName": "Platsnamnet innehåller otillåtna tecken",
                "invalidDesc": "Platsens beskrivning innehåller otillåtna tecken"
            }
        },
        "categoryform": {
            "title": "Uppgifter om kartlagret",
            "layerName": "Namn på kartlagret",
            "styleTitle": "Stil",
            "validation": {
                "mandatoryName": "Kartlagrets namn saknas",
                "invalidName": "Kartlagrets namn innehåller otillåtna tecken"
            }
        },
        "notification": {
            "place": {
                "saved": "Platsen har sparats.",
                "deleted": "Platsen har tagits bort.",
                "info": "Du kan hitta platsen i menyn \"Mina uppgifter\"."
            },
            "category": {
                "saved": "Kartlagret har sparats.",
                "updated": "Ändringar i kartlagret har sparats.",
                "deleted": "Kartlagret har tagtits bort."
            }
        },
        "error": {
            "generic": "Ett systemfel inträffade. Försök på nytt senare.",
            "saveCategory": "Kartlagret kunde inte sparas. Försök på nytt senare.",
            "deleteCategory": "Fel i borttagningen. Försök på nytt senare.",
            "savePlace": "Platsen kunde inte sparas. Försök på nytt senare.",
            "deletePlace": "Platsen kunde inte tas bort. Prova på nytt senare."
        }
    }
});
