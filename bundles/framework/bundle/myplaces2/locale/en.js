Oskari.registerLocalization({
  "lang": "en",
  "key": "MyPlaces2",
  "value": {
    "title": "Places",
    "desc": "",
    "category": {
      "defaultName": "My map layer",
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
      }
    },
    "buttons": {
      "ok": "OK",
      "cancel": "Cancel",
      "finish": "Finish drawing",
      "save": "Save",
      "movePlaces": "Move places and delete",
      "deleteCategory": "Delete",
      "deleteCategoryAndPlaces": "Delete category and places",
      "changeToPublic": "Change to public",
      "changeToPrivate": "Change to private"
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
        "title": "TBD: Change map layer to public",
        "message": "TBD: Olet muuttamassa karttatasoa \"{0}\" julkiseksi. Voit jakaa julkisen karttatason verkossa tai julkaista sen karttana toiseen verkkopalveluun."
      },
      "categoryToPrivate": {
        "title": "TBD: Change map layer to private",
        "message": "TBD: Olet muuttamassa karttatasoa \"{0}\" yksityiseksi. Tämän jälkeen et voi jakaa tai julkaista sitä karttana."
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
      "placeName": "Place name missing.",
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