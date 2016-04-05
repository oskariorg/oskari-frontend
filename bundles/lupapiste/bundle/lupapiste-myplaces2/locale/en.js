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
        "save": "Save shape",
        "noResult": "0 m"
      },
      "area": {
        "tooltip": "Add area",
        "new": "Add break points to your area polygon by clicking the map. Stop drawing by double clicking or by clicking 'Finish drawing'.",
        "edit": "Edit the shape of the area by clicking and dragging the break points on its edge line.",
        "save": "Save shape",
        "noResult": "0 m²"
      },
      "circle": {
          "tooltip": "Add circle",
          "new": "Draw a circle by clicking the map and dragging. Stop drawing by releasing the mouse button.",
          "edit": "Edit the shape of the circle by clicking and dragging the break points on its edge line.",
          "save": "Save shape",
      },
      "ellipse": {
          "tooltip": "Add ellipse",
          "new": "Draw an ellipse by clicking the map and dragging. Stop drawing by releasing the mouse button.",
          "edit": "Edit the shape of the ellipse by clicking and dragging the break points on its edge line.",
          "save": "Save shape",
      }
    },
    "buttons": {
      "ok": "OK",
      "cancel": "Cancel",
      "finish": "Finish drawing",
      "save": "Save",
      "deleteButton": "Delete",
      "movePlaces": "Move places and delete",
      "deleteCategory": "Delete",
      "deleteCategoryAndPlaces": "Delete category and places",
      "changeToPublic": "Make public",
      "changeToPrivate": "Make private"
    },
    "placeform": {
      "title": "Place data",
      "tooltip": "A place put on the map will be saved in My places. Give the place a name and describe it.",
      "placename": {
        "placeholder": "Give the place a name",
        "label": "Place name"
      },
      "placelink": {
        "placeholder": "Give a URL"
      },
      "placedesc": {
        "placeholder": "Describe the place",
        "label": "Place description"
      },
      "category": {
        "label": "Map layer",
        "new": "New layer..."
      },
      "placeheight": {
    	  "placeholder": "Give a height or depth",
        "label": "Place height / depth in meters"
      },
      "placewidth": {
        "placeholder": "Give a width",
        "label": "Place width (turns feature to area)"
      },
      "area": {
        "label": "Area (m2)"
      },
      "length": {
          "label": "Length (m)"
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
      "placeDelete": {
    	  "title": "Delete place",
    	  "confirm": "Do you want to delete this place?",
    	  "btnDelete": "Delete",
    	  "btnCancel": "Cancel",
    	  "success": "The place has been deleted.",
    	  "cancel": "Cancel"
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
        "deletePlace": "The place could not be deleted. Please try again later.",
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
      "areaFillColor": "Wrong fill-in colour.",
      "heightNotANumber": "The height/depth value must be a number.",
      "lengthNotANumber": "The length value must be a number.",
      "widthNotANumber": "The width value must be a positive number."
    }
  }
});