Oskari.registerLocalization(
{
    "lang": "nb",
    "key": "MyPlacesImport",
    "value": {
        "title": "Import av datasett",
        "desc": "Du kan importere dine egne datasett i shp-, gpx- eller mif/mid filformat, i en zipfil eller i kmz filformat (zipped kml).",
        "tool": {
            "tooltip": "Importer ditt eget datasett"
        },
        "flyout": {
            "title": "Datasettimport",
            "description": "Du kan importere dine egne datasett i shp-, gpx- eller mif/mid filformat, i en zipfil eller i kmz filformat (zipped kml).",
            "help": "Velg en fil eller angi en lenke til datafila. Fila kan være på shp, zip eller kml/kmz format. Du kan lage zipfiler fra shapefiler ved å legge til filer av type shp, shx, dbf og prj til zipfil. kml/kmz-filesrkan zippes på samme måte. Mif/mid data må være i gjeldende map CRS - se gjeldende CRS under zoombar",
            "actions": {
                "cancel": "Avbryt",
                "next": "Neste"
            },
            "file": {
                "submit": "Send",
                "fileOverSizeError": {
                    "title": "Feil",
                    "message": "Datasettet er for stort. Maksimal størrelse på importert datasett er <xx> mb.",
                    "close": "Lukk"
                }
            },
            "layer": {
                "title": "Lagre informasjon om datasett:",
                "name": "Navn",
                "desc": "Beskrivelse",
                "source": "Datakilde",
                "style": "Datasett stildefinisjoner:"
            },
            "validations": {
                "error": {
                    "title": "Feil",
                    "message": "Fila er ikke valgt og navn på kartlag mangler."
                }
            },
            "finish": {
                "success": {
                    "title": "Import av datasett fullført",
                    "message": "Du kan finne kartlaget under menyen \"Mine data\""
                },
                "failure": {
                    "title": "Import av datasett feilet. Vennligst prøv igjen seinere."
                }
            }
        },
        "tab": {
            "title": "Datasett",
            "grid": {
                "name": "Navn",
                "description": "Beskrivelse",
                "source": "Datakilde",
                "remove": "Slett",
                "removeButton": "Slett"
            },
            "confirmDeleteMsg": "Vil du slette \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Avbryt",
                "delete": "Slett"
            },
            "notification": {
                "deletedTitle": "Slett datasett",
                "deletedMsg": "Datasettet har blitt slettet"
            },
            "error": {
                "title": "Feil!",
                "generic": "En systemfeil oppstod. Vennligst prøv igjen seinere"
            }
        },
        "layer": {
            "organization": "Egne datasett",
            "inspire": "Egne datasett"
        }
    }
});
