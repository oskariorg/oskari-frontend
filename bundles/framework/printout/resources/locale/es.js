Oskari.registerLocalization(
{
    "lang": "es",
    "key": "Printout",
    "value": {
        "title": "Imprimir vista",
        "flyouttitle": "Imprimir vista",
        "desc": "",
        "btnTooltip": "Imprimir",
        "BasicView": {
            "title": "Imprimir vista",
            "name": {
                "label": "El nombre del mapa",
                "placeholder": "requerido",
                "tooltip": "Pon a tu mapa un nombre descriptivo. Por favor, tenga en cuenta el idioma de la interfaz de usuario"
            },
            "language": {
                "label": "Idioma",
                "options": {
                    "fi": "Finlandés",
                    "sv": "Sueco",
                    "en": "Inglés"
                },
                "tooltip": "Seleccione el idioma a usar en la impresión. Por favor, tenga en cuenta el idioma de la interfaz de usuario y del conjunto de datos"
            },
            "size": {
                "label": "Tamaño",
                "tooltip": "Seleccione el tamaño de impresión. La previsualización del mapa muestra las actualizaciones",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 vertical",
                        "classForPreview": "Previsualización vertical",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 apaisado",
                        "classForPreview": "Previsualización apaisada"
                    },
                    {
                        "id": "A3",
                        "label": "A3 vertical",
                        "classForPreview": "Previsualización vertical"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 apaisado",
                        "classForPreview": "Previsualización apaisada"
                    }
                ]
            },
            "preview": {
                "label": "Previsualización",
                "tooltip": "Haga clic en la previsualización para agrandarla",
                "pending": "La previsualización se actualizará en breve",
                "notes": {
                    "extent": "La previsualización puede usarse para calcular la extensión del mapa para impresión",
                    "restriction": "No se muestran todas las capas en la previsualización"
                }
            },
            "buttons": {
                "save": "Imprimir",
                "ok": "Hecho",
                "back": "Previo",
                "cancel": "Cancelar"
            },
            "location": {
                "label": "Localización y nivel de zoom",
                "tooltip": "La escala de impresión coincide con la escala del mapa en el navegador",
                "zoomlevel": "Escala de impresión"
            },
            "settings": {
                "label": "Más configuraciones",
                "tooltip": "Elija un formato de fichero, un título, una escala y una fecha para el mapa impreso"
            },
            "format": {
                "label": "Formato",
                "tooltip": "Seleccionar el formato del fichero",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "Imagen PNG"
                    },
                    {
                        "id": "pdf",
                        "format": "aplicación/pdf",
                        "selected": true,
                        "label": "documento PDF"
                    }
                ]
            },
            "mapTitle": {
                "label": "Título del mapa",
                "tooltip": "Añadir un título para el mapa impreso"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Añadir el logo de Oskari en la impresión",
                        "tooltip": "Si es necesario, puede ocultar el logo",
                        "checked": "comprobado"
                    },
                    {
                        "id": "pageScale",
                        "label": "Añadir una escala al mapa impreso",
                        "tooltip": "Añadir una escala al mapa impreso",
                        "checked": "comprobado"
                    },
                    {
                        "id": "pageDate",
                        "label": "Añadir una fecha al mapa impreso",
                        "tooltip": "Puede añadir una fecha a la impresión",
                        "checked": "comprobado"
                    }
                ]
            },
            "help": "Ayuda",
            "error": {
                "title": "Error",
                "size": "Error en las definiciones de tamaños",
                "name": "Se requiere la información del nombre",
                "nohelp": "No hay ayuda disponible",
                "saveFailed": "La impresión del mapa ha fallado. Por favor, inténtelo más tarde",
                "nameIllegalCharacters": "El nombre contiene caracteres no válidos. Son válidos las letras a-z, además de å, ä y ö, números (0-9), retornos y guiones (-)"
            }
        },
        "StartView": {
            "text": "Puede imprimir la vista que ha creado como imagen PNG o fichero PDF",
            "info": {
                "maxLayers": "Puede imprimir un máximo de ocho capas a la vez",
                "printoutProcessingTime": "El proceso de impresión tarda cierto tiempo cuando se seleccionan varias capas"
            },
            "buttons": {
                "continue": "Continuar",
                "cancel": "Cancelar"
            }
        }
    }
});
