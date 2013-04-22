Oskari.registerLocalization({
  "lang": "sv",
  "key": "DigiroadMyPlaces2",
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
        "edit": "Flytta på punkten genom att klicka och dra.",
        "save": "Lagra läge"
      },
      "line": {
        "tooltip": "Tillägg linje",
        "new": "Tillägg en brytningspunkt på linjen genom att klicka på kartan. Sluta rita genom att dubbelklicka eller klicka på 'Sluta rita'.",
        "edit": "Editera linjen genom att klicka och dra brytningspunkterna.",
        "save": "Lagra form"
      },
      "area": {
        "tooltip": "Tillägg område",
        "new": "Tillägg områdets hörnpunkter genom att klicka på kartan. Sluta rita genom att dubbelklicka eller klicka på 'Sluta rita'.",
        "edit": "Editera områdets form genom att klicka och dra brytningspunkterna på omkretslinjen.",
        "save": "Lagra form"
      },
      "restriction": {
          "title": "Uusi kääntymismääräys",
          "firstElemLabel": "Alkuelementti",
          "lastElemLabel": "Loppuelementti",
          "typeLabel": "Tyyppi",
          "tooltip": "Lisää uusi kääntymismääräys",
          "new": "Klikkaa kartalta kääntymismääräyksen alku- ja loppuelementti",
          "save": "Tallenna kääntymismääräys",
          "success": "Kääntymismääräys tallennettu.",
          "failure": "Tallentaminen epäonnistui."
        }
    },
    "buttons": {
      "ok": "OK",
      "cancel": "Tillbaka",
      "finish": "Sluta rita",
      "finishRestriction": "Tallenna",
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
      "placedesc": {
        "placeholder": "Beskriv objektet"
      },
      "placedyntype": {
	      "label": "Tietolaji",
	      "values": {
	        "Ajoneuvo sallittu": 1,
	        "Avattava puomi": 3,
	        "Kelirikko": 6,
	        "Tien leveys": 8,
	        "Nopeusrajoitus": 11,
	        "Suljettu yhteys": 16,
	        "Ajoneuvon suurin sallittu korkeus": 18,
	        "Ajoneuvon tai -yhdistelmän suurin sallittu pituus": 19,
	        "Ajoneuvoyhdistelmän suurin sallittu massa": 20,
	        "Ajoneuvon suurin sallittu akselimassa": 21,
	        "Ajoneuvon suurin sallittu massa": 22,
	        "Ajoneuvon suurin sallittu leveys": 23,
	        "Ajoneuvon suurin sallittu telimassa": 24,
	        "Rautatieaseman tasoristeys": 25,
	        "Päällystetty tie": 26,
	        "Valaistu tie": 27,
	        "Ajoneuvo kielletty": 29,
	        "Taajama": 30,
	        "Talvinopeusrajoitus": 31,
	        "Liikennemäärä": 33
	      }
	  },
	  "placedynvalue": {
	    "placeholder": "Dynaaminen arvo"
	  },
      "category": {
        "label": "Kartlager",
        "new": "Ny nivå..."
      }
    },
    "feedbackform": {
        "title": "Feedback data",
        "tooltip": "Draw a polygon shaped area for free feedback. You can give the drawn area a name and a description.",
        "feedbackname": {
          "placeholder": "Give the place a name"
        },
        "feedbackdesc": {
          "placeholder": "Describe the place"
        },
        "category": {
          "label": "Map level",
          "new": "New layer..."
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
      "placeDescription": "Palauteteksti puuttuu.",
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