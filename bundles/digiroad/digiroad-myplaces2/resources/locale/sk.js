Oskari.registerLocalization(
{
    "lang": "sk",
    "key": "DigiroadMyPlaces2",
    "value": {
        "title": "Places",
        "desc": "",
        "category": {
            "defaultName": "Created segments",
            "organization": "My places",
            "inspire": "Places"
        },
        "guest": {
            "loginShort": "Log in to use"
        },
        "tools": {
            "point": {
                "tooltip": "Add point",
                "new": "Add point by clicking the map.",
                "edit": "Move point by clicking and dragging.",
                "save": "Save location"
            },
            "line": {
                "tooltip": "Add line",
                "new": "Add a break point on the line by clicking the map. Stop drawing by double clicking or by clicking 'Finish drawing'.",
                "edit": "Edit the line by clicking and dragging its break points.",
                "save": "Save shape"
            },
            "area": {
                "tooltip": "Add area",
                "new": "Add break points to your area polygon by clicking the map. Stop drawing by double clicking or by clicking 'Finish drawing'.",
                "edit": "Edit the shape of the area by clicking and dragging the break points on its edge line.",
                "save": "Save shape"
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
            "cancel": "Cancel",
            "finish": "Finish drawing",
            "finishRestriction": "Tallenna",
            "save": "Save",
            "movePlaces": "Move places and delete",
            "deleteCategory": "Delete",
            "deleteCategoryAndPlaces": "Delete category and places",
            "changeToPublic": "Make public",
            "changeToPrivate": "Make private"
        },
        "placeform": {
            "title": "Place data",
            "tooltip": "A place put on the map will be saved in My places. Give the place a name and describe it. You can select the map layer where the place will be stored, or choose a new map layer by selecting 'New layer' in the map layer drop-down menu.",
            "placename": {
                "placeholder": "Give the place a name"
            },
            "placedesc": {
                "placeholder": "Describe the place"
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
                "placeholder": "Gimme da DYN_VALUE"
            },
            "category": {
                "label": "Map level",
                "new": "New layer..."
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
                "label": "Name",
                "placeholder": "Give the map layer a name"
            },
            "drawing": {
                "label": "Style",
                "point": {
                    "label": "Point",
                    "color": "Colour",
                    "size": "Size"
                },
                "line": {
                    "label": "Line",
                    "color": "Colour",
                    "size": "Thickness"
                },
                "area": {
                    "label": "Area",
                    "fillcolor": "Fill-in colour",
                    "linecolor": "Line colour",
                    "size": "Line thickness"
                }
            },
            "edit": {
                "title": "Edit map layer",
                "save": "Save",
                "cancel": "Back"
            }
        },
        "notification": {
            "placeAdded": {
                "title": "The place has been saved",
                "message": "The place can be found in the My data menu"
            },
            "categorySaved": {
                "title": "Map layer saved",
                "message": "Map layer edits saved"
            },
            "categoryDelete": {
                "title": "Delete map layer",
                "deleteConfirmMove": "Map layer {0} contains {1} objects. Do you want to delete the map layer and move the places on it to the default map layer {2} ?",
                "deleteConfirm": "Delete map layer {0}?",
                "deleted": "Map layer deleted"
            },
            "categoryToPublic": {
                "title": "Make map layer public",
                "message": "You are making the map layer \"{0}\" public. You can share links to a public map layer with other internet users or embed the map layer as a map window on another website. Other users can also view the map layer in Paikkatietoikkuna."
            },
            "categoryToPrivate": {
                "title": "Make map layer private",
                "message": "You are making the map layer \"{0}\" private. After this it will no longer be possible to share it with other users or embed it on another website. Other users can no longer view the map layer in Paikkatietoikkuna."
            },
            "error": {
                "addCategory": "The map layer could not be saved. The place has not been saved.",
                "editCategory": "The map layer could not be saved.",
                "savePlace": "The place could not be saved.",
                "title": "Error!",
                "generic": "System error. Please try again later.",
                "deleteCategory": "Error occurred while deleting!",
                "deleteDefault": "The default map layer cannot be deleted."
            }
        },
        "validation": {
            "title": "Data contains errors:",
            "dynType": "DYN_TYYPPI wrooong!!!",
            "dynValue": "DYN_ARVO wrooong!!!",
            "placeName": "Place name missing.",
            "placeDescription": "Feedback text is missing!",
            "categoryName": "Map layer name missing.",
            "placeNameIllegal": "The object name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens.",
            "descIllegal": "The object description contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens.",
            "categoryNameIllegal": "The layer description contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens.",
            "dotSize": "The dot size does not fit the size limits (1-50).",
            "dotColor": "Wrong dot colour.",
            "lineSize": "The line size does not fit the size limits (1-50).",
            "lineColor": "Wrong line colour.",
            "areaLineSize": "The area edge size does not fit the limits (0-50).",
            "areaLineColor": "Wrong area edge line colour.",
            "areaFillColor": "Wrong fill-in colour."
        }
    }
});
