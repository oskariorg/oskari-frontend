Oskari.registerLocalization({
  "lang": "en",
  "key": "Publisher",
  "value": {
    "title": "Create map to be embedded",
    "flyouttitle": "Create map",
    "desc": "",
    "published": {
      "title": "Your map has been created",
      "desc": "Embed the map by adding the HTML code below to your website.",
      "urlPrefix": "http://www.paikkatietoikkuna.fi"
    },
    "BasicView": {
      "title": "Embed map",
      "domain": {
        "title": "Webpage where the map will be embedded",
        "label": "Website where the map will be embedded",
        "placeholder": "without the prefixes http or www",
        "tooltip": "Write the name of your website's index page, e.g. its domain name without the prefixes http or www, or the address of a subpage. Example: myhomepage.com"
      },
      "name": {
        "label": "The name of the map",
        "placeholder": "required",
        "tooltip": "Give your map a descriptive name. Please note the language of the user interface."
      },
      "language": {
        "label": "Language",
        "options": {
          "fi": "Finnish",
          "sv": "Swedish",
          "en": "English"
        },
        "tooltip": "Select the language of the map interface and map data."
      },
      "size": {
        "label": "Size",
        "tooltip": "Select or define the size of the map to be embedded on your website. The map preview is displayed in the selected size."
      },
      "tools": {
        "label": "Tools",
        "tooltip": "Select the tools to be shown on the map. Their placement is displayed in the map preview.",
        "Oskari": {
          "mapframework": {
            "bundle": {
              "mapmodule": {
                "plugin": {
                  "ScaleBarPlugin": "Scale line",
                  "IndexMapPlugin": "Index map",
                  "Portti2Zoombar": "Scale scrollbar",
                  "SearchPlugin": "Address and place name search"
                }
              }
            },
            "mapmodule": {
              "GetInfoPlugin": "Query tool for place data"
            }
          }
        },
        "ScaleBarPlugin": "",
        "IndexMapPlugin": "",
        "Portti2Zoombar": "",
        "SearchPlugin": "",
        "GetInfoPlugin": ""
      },
      "layers": {
        "label": "Map levels",
        "defaultLayer": "(Default layer)",
        "useAsDefaultLayer": "Use as default layer"
      },
      "sizes": {
        "small": "Small",
        "medium": "Medium",
        "large": "Large",
        "custom": "Custom size",
        "width": "width",
        "height": "height"
      },
      "buttons": {
        "save": "Save",
        "ok": "OK",
        "cancel": "Cancel"
      },
      "layerselection": {
        "label": "Show map levels in menu",
        "info": "Select background maps. You can set the default background map in the map preview window.",
        "tooltip": "The background map is shown as the bottom layer of the map. When you select map levels to be used as the bottom layer, only one level is visible at a time and you can switch between them. You can set the default background map in the map preview.",
        "promote": "Show aerial images?"
      },
      "preview": "Preview of map that will be embedded.",
      "location": "Location and zoom level",
      "zoomlevel": "Zoom level",
      "help": "Help",
      "error": {
        "title": "Error!",
        "size": "Error in size definitions",
        "domain": "Website is required information",
        "domainStart": "Omit prefixes http or www from the website name",
        "name": "Name is required information",
        "nohelp": "No help is available",
        "saveFailed": "Map embedding failed. Try again later.",
        "nameIllegalCharacters": "",
        "domainIllegalCharacters": ""
      }
    },
    "NotLoggedView": {
      "text": "You need to log in before using the embedding function.",
      "signup": "Log in",
      "signupUrl": "/web/fi/login",
      "register": "Register",
      "registerUrl": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
    },
    "StartView": {
      "text": "You can embed the map view you just created on your own or your employer's website.",
      "layerlist_title": "Embeddable map levels",
      "layerlist_empty": "The map levels you selected cannot be embedded. The menu Selected map levels shows whether or not a map level can be embedded.",
      "layerlist_denied": "Cannot be embedded",
      "denied_tooltip": "The providers of this map data have not granted permission to publish these materials on other websites. Check rights to publish in the menu Selected map levels before embedding.",
      "buttons": {
        "continue": "Continue",
        "cancel": "Cancel"
      }
    }
  }
});