Oskari.registerLocalization({
  "lang": "sv",
  "key": "MyPlaces2",
  "value": {
    "title": "Objekt",
    "desc": "",
    "category": {
      "defaultName": "Mitt kartlager",
      "organization": "Mina objekt",
      "inspire": "Objekt"
    },
    "guest": {
      "loginShort": "Logga in för att använda"
    },
    "tools": {
      "point": {
        "tooltip": "Tillägg punkt",
        "new": "Tillägg punkt genom att klicka på kartan.",
        "next": "Du kan lagra eller tillägga fler punkter till samma området.",
        "edit": "Flytta på punkten genom att klicka och dra.",
        "save": "Lagra läge"
      },
      "line": {
        "tooltip": "Tillägg linje",
        "new": "Tillägg en brytningspunkt på linjen genom att klicka på kartan. Sluta rita genom att dubbelklicka eller klicka på 'Sluta rita'.",
        "next": "Du kan lagra eller tillägga fler linjer till samma området.",
        "edit": "Editera linjen genom att klicka och dra brytningspunkterna.",
        "save": "Lagra form"
      },
      "area": {
        "tooltip": "Tillägg område",
        "new": "Tillägg områdets hörnpunkter genom att klicka på kartan. Sluta rita genom att dubbelklicka eller klicka på 'Sluta rita'. Håll ned Alt-tangenten för att skapa hål i polygonerna.",
        "next": "Du kan lagra eller tillägga fler polygoner till samma området.",
        "edit": "Editera områdets form genom att klicka och dra brytningspunkterna på omkretslinjen.",
        "save": "Lagra form"
      }
    },
    "buttons": {
      "ok": "OK",
      "cancel": "Tillbaka",
      "finish": "Sluta rita",
      "save": "Lagra",
      "movePlaces": "Flytta objekt och ta bort",
      "deleteCategory": "Ta bort",
      "deleteCategoryAndPlaces": "Ta bort kategori inklusive objekt",
      "changeToPublic": "Ändra till offentlig",
      "changeToPrivate": "Ändra till privat"
    },
    "placeform": {
      "title": "Uppgifter om objektet",
      "tooltip": "När du lägger ett objekt på kartan lagras det i dina objekt. Ge objektet ett namn och en beskrivning. Du kan välja vilket kartlager du vill lagra objektet på eller tillägga ett nytt kartlager genom att välja 'Ny nivå' från rullgardinsmenyn för kartlager.",
      "placename": {
        "placeholder": "Namnge objektet"
      },
      "placelink": {
        "placeholder": "Ge URL-address"
      },
      "placedesc": {
        "placeholder": "Beskriv objektet"
      },
      "category": {
        "label": "Kartlager",
        "new": "Ny nivå..."
      }
    },
    "categoryform": {
      "name": {
        "label": "Namn",
        "placeholder": "Namnge kartlagret"
      },
      "drawing": {
        "label": "Stil",
        "point": {
          "label": "Punkt",
          "color": "Färg",
          "size": "Storlek"
        },
        "line": {
          "label": "Linje",
          "color": "Färg",
          "size": "Tjocklek"
        },
        "area": {
          "label": "Område",
          "fillcolor": "Ifyllnadsfärg",
          "linecolor": "Linjens färg",
          "size": "Linjens tjocklek"
        }
      },
      "edit": {
        "title": "Editera kartlagret",
        "save": "Lagra",
        "cancel": "Tillbaka"
      }
    },
    "notification": {
      "placeAdded": {
        "title": "Objektet har lagrats",
        "message": "Objektet finns i menyn Mina uppgifter"
      },
      "categorySaved": {
        "title": "Kartlagret har lagrats",
        "message": "दndringar i kartlagret har lagrats"
      },
      "categoryDelete": {
        "title": "Ta bort kartlager",
        "deleteConfirmMove": "Kartlager: {0} innehåller {1} st. objekt. Vill du ta bort nivån och flytta objekten på den till det förvalda kartlagret {2} ?",
        "deleteConfirm": "Vill du ta bort kartlagret {0}?",
        "deleted": "Kartlagret borttaget"
      },
      "categoryToPublic": {
        "title": "Offentliggör kartlagret",        
        "message": "Du håller på att offentliggöra kartlagret \"{0}\". Du kan skicka länkar till ett offentligt kartlager till andra internetanvändare eller inbädda det som en karta i en annan webbtjänst. Andra användare kan även titta på kartlagret i Paikkatietoikkuna."
      },
      "categoryToPrivate": {
        "title": "Gör kartlagret privat",
        "message": "Du håller på att göra kartlagret \"{0}\" privat. Efter detta kan du inte längre skicka länkar från kart-lagret eller inbädda det som en karta, andra användare kan inte heller titta på det i Paikkatietoikkuna."
      },
      "error": {
        "addCategory": "Kartlagret kunde inte lagras. Objektet har inte lagrats.",
        "editCategory": "Kartlagret kunde inte lagras.",
        "savePlace": "Objektet kunde inte lagras.",
        "title": "Fel!",
        "generic": "Systemfel. Försök på nytt senare.",
        "deleteCategory": "Fel i borttagningen!",
        "deleteDefault": "Den förvalda kartlagret kan inte tas bort."
      }
    },
    "validation": {
      "title": "Brister i uppgifterna:",
      "placeName": "Objektets namn saknas.",
      "categoryName": "kartlagrets namn saknas.",
      "placeNameIllegal": "I objekts namnet ingår otillåtna tecken. Tillåtna är alla bokstäver i det svenska alfabetet, siffror, mellanslag och bindestreck.",
      "descIllegal": "I objekts beskrivning ingår otillåtna tecken. Tillåtna är alla bokstäver i det svenska alfabetet, siffror, mellanslag och bindestreck.",
      "categoryNameIllegal": "I kartlagers beskrivning ingår otillåtna tecken. Tillåtna är alla bokstäver i det svenska alfabetet, siffror, mellanslag och bindestreck.",
      "dotSize": "Punkternas storlek är utanför de tillåtna gränserna (1-50).",
      "dotColor": "Punktens färg är felaktig.",
      "lineSize": "Linjens storlek är utanför de tillåtna gränserna (1-50).",
      "lineColor": "Linjens färg är felaktig.",
      "areaLineSize": "Områdets konturlinje är utanför de tillåtna gränserna (0-50).",
      "areaLineColor": "Färgen på områdets omkretslinje är felaktig.",
      "areaFillColor": "Områdets ifyllnadsfärg är felaktig."
    }
  }
});