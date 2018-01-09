Oskari.registerLocalization(
{
    "lang": "es",
    "key": "MyPlacesImport",
    "value": {
        "title": "Importación de conjuntos de datos",
        "desc": "Usted puede importar sus propios datos en formato shp-, gpx- o formatos mif/mid en un formato de fichero zip o en kmz file format (zipped kml).",
        "tool": {
            "tooltip": "Importe su propio conjunto de datos"
        },
        "flyout": {
            "title": "Importar conjunto de datos",
            "description": "Usted puede importar sus propios datos en formato shp-, gpx- o formatos mif/mid en un formato de fichero zip o en kmz file format (zipped kml).",
            "help": "\"Seleccione un archivo de su equipo o de  un enlace al archivo que contiene el conjunto de datos. El archivo puede estar en formato  shp, zip o kml o kmz. Puede crear archivos zip de Shapefiles, comprimiendo  en un mismo archivo zip  los archivos con  sufijos shp, shx, dbf y prj También los archivos kml y kmz de Google maps puede ser comprimidos de la misma manera. los datos Mif/mid deben estar en CRS actuales – consulta CRS actuales en  zoombar\"",
            "actions": {
                "cancel": "Cancelar",
                "next": "Siguiente"
            },
            "file": {
                "submit": "Enviar",
                "fileOverSizeError": {
                    "title": "Error",
                    "message": "Su conjunto de datos es demasiado grande. El tamaño máximo del conjunto de datos importados es <xx> mb.",
                    "close": "cerrar"
                }
            },
            "layer": {
                "title": "Salvar la información del conjunto de datos",
                "name": "Nombre",
                "desc": "Descripción",
                "source": "Fuente de los datos",
                "style": "Definiciones de estilo de conjunto de datos"
            },
            "validations": {
                "error": {
                    "title": "Error",
                    "message": "No se ha seleccionado el ficheroy falta el nombre de la capa"
                }
            },
            "finish": {
                "success": {
                    "title": "La importación de datos ha sido un éxito",
                    "message": "Puede encontrar la capa en el menú «Mis datos»"
                },
                "failure": {
                    "title": "La importación de datos no se ha conseguido. Por favor, inténtelo más tarde"
                }
            }
        },
        "tab": {
            "title": "Conjuntos de datos",
            "grid": {
                "name": "Nombre",
                "description": "Descripción",
                "source": "Fuente de datos",
                "remove": "Borrar",
                "removeButton": "Borrar"
            },
            "confirmDeleteMsg": "¿Quiere borrar? \"{name}\"",
            "buttons": {
                "ok": "Hecho",
                "cancel": "Cancelar",
                "delete": "Borrar"
            },
            "notification": {
                "deletedTitle": "Borado de datos",
                "deletedMsg": "Los datos han sido borrados"
            },
            "error": {
                "title": "¡Error!",
                "generic": "Ha habido un error. Por favor, inténtelo más tarde"
            }
        },
        "layer": {
            "organization": "Conjuntos de datos propios",
            "inspire": "Conjuntos de datos propios"
        }
    }
});
