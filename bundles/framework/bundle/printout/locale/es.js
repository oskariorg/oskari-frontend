Oskari.registerLocalization({
    "lang" : "es",
    "key" : "Printout",
    "value" : {
        "title" : "Imprimir vista",
        "flyouttitle" : "Imprimir vista",
        "desc" : "",
        "btnTooltip" : "Imprimir",
        "BasicView" : {
            "title" : "Imprimir vista",
            "name" : {
                "label" : "The name of the map",
                "placeholder" : "required",
                "tooltip" : "Give your map a descriptive name. Please note the language of the user interface."
            },
            "language" : {
                "label" : "Idioma",
                "options" : {
                    "fi": "Finlandés",
                    "sv": "Sueco",
                    "en": "Inglés",
                    "de" : "Alemán",
                    "es" : "Español",
                    "cs" : "Checo"
                },
                "tooltip" : "Select the language of the map interface and map data."
            },
            "size" : {
                "label" : "Tamaño",
                "tooltip" : "Seleccione el modelo de impresión| La previsualización del mapa está actualizada correctamente.",
                "options" : [{
                    "id" : "A4",
                    "label" : "A4 vertical",
                    "classForPreview" : "preview-portrait",
                    "selected" : true
                }, {
                    "id" : "A4_Landscape",
                    "label" : "A4 apaisado",
                    "classForPreview" : "preview-landscape"
                }, {
                    "id" : "A3",
                    "label" : "A3 vertical",
                    "classForPreview" : "preview-portrait"
                }, {
                    "id" : "A3_Landscape",
                    "label" : "A3 apaisado",
                    "classForPreview" : "preview-landscape"
                }]
            },
            "preview" : {
                "label" : "Previsualización",
                "tooltip" : "Pulse la previsualización pequeña para abrir una agrandada",
                "pending" : "La previsualización se actualizará en breve",
                "notes" : {
                    "extent" : "La previsualización puede usarse para calcular la extensión del mapa para la impresión",
                    "restriction" : "No se muestran todas las capas en la previsualización"
                }

            },

            "buttons" : {
                "save" : "Imprimir",
                "ok" : "Hecho",
                "cancel" : "Cancelar"
            },
            "location" : {
                "label" : "Localización y nivel de zoom",
                "tooltip" : "La escala de impresión coincide con la escala del mapa en el navegador .",
                "zoomlevel" : "Nivel de zoom"
            },
            "settings" : {
                "label" : "Más configuraciones",
                "tooltip" : "Realizar configuraciones adicionales como el formato, el título y la escala"
            },
            "format" : {
                "label" : "Formato",
                "tooltip" : "Seleccionar el formato del fichero",
                "options" : [{
                    "id" : "png",
                    "format" : "image/png",
                    "label" : "Imagen PNG"
                }, {
                    "id" : "pdf",
                    "format" : "application/pdf",
                    "selected" : true,
                    "label" : "Documento PDF"
                }]
            },
            "mapTitle" : {
                "label" : "Añadir título",
                "tooltip" : "añadir un título para el mapa"
            },
            "content" : {
                "options" : [{
                    "id" : "pageLogo",
                    "label" : "Añadir el logo de Paikkatietoikkuna",
                    "tooltip" : "Si es necesario, puede ocultar el logo",
                        "checked" : "checked"
                }, {
                    "id" : "pageScale",
                    "label" : "Añadir la escala al mapa",
                    "tooltip" : "Añadir la escala al mapa",
                        "checked" : "checked"
                }, {
                    "id" : "pageDate",
                    "label" : "Añadir fecha",
                    "tooltip" : "Puede añadir la fecha a la impresión",
                        "checked" : "checked"
                }]
            },
                "legend" : {
                "label" : "Legend",
                "tooltip" : "Select legend position",
                "options" : [{
                        "id" : "oskari_legend_NO",
                        "loca" : "NO",
                        "label" : "No legend ",
                        "tooltip" : "No legend plot",
                        "selected" : true
                       
                    },{
                        "id" : "oskari_legend_LL",
                        "loca" : "LL",
                        "label" : "Left lower corner ",
                        "tooltip" : "Legend position in left lower corner of print area"
                       
                    },{
                        "id" : "oskari_legend_LU",
                         "loca" : "LU",
                        "label" : "Left upper corner ",
                        "tooltip" : "Legend position in left upper corner of print area"
                       
                    },{
                        "id" : "oskari_legend_RU",
                         "loca" : "RU",
                        "label" : "Right upper corner ",
                        "tooltip" : "Legend position in right upper corner of print area"
                       
                    },{
                        "id" : "oskari_legend_RL",
                         "loca" : "RL",
                        "label" : "Right lower corner ",
                        "tooltip" : "Legend position in right lower corner of print area"
                       
                    }
                ]
            },
            "help" : "Ayuda",
            "error" : {
                "title" : "Error",
                "size" : "Error in size definitions",
                "name" : "Name is required information",
                "nohelp" : "No hay ayuda disponible",
                "saveFailed" : "La impresión del mapa ha fallado. Inténtelo más tarde.",
                "nameIllegalCharacters" : "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "StartView" : {
            "text" : "Puede imprimir la vista que has creado.",
            "info" : {
                "maxLayers" : "Puede imprimir un máximo de ocho capas de una vez.",
                "printoutProcessingTime" : "El proceso de impresión tarda cuando se seleccionan varias capas."
            },
            "buttons" : {
                "continue" : "Continuar",
                "cancel" : "Cancelar"
            }
        }
    }
});
