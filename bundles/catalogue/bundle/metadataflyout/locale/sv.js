Oskari.registerLocalization({
    "lang": "sv",
    "key": "catalogue.bundle.metadataflyout",
    "value": {
        "title": "Metadata",
        "desc": "",
        "loader": {
            "json": "/catalogue/portti-metadata-printout-service/MetadataServlet?",
            "abstract": "/geonetwork/srv/sv/metadata.show.portti.abstract?",
            "inspire": "/geonetwork/srv/sv/metadata.show.portti?",
            "jhs": "/geonetwork/srv/sv/metadata.show.portti.jhs158?",
            "pdf": "/catalogue/portti-metadata-printout-service/MetadataPrintoutServlet?lang=sv&title=METADATAUTSKRIFT&metadataresource",
            "xml": "/geonetwork/srv/sv/iso19139.xml?",
            "schemas": "/geonetwork/srv/sv/metadata.show.portti.skeemat?"
        },
        "layer": {
            "name": "Metadata",
            "description": "",
            "orgName": "Metadata",
            "inspire": "Metadata"
        },
        "flyout": {
            "title": "Metadata",
            "abstract": "Abstrakt",
            "inspire": "INSPIRE",
            "jhs": "ISO 19115",
            "xml": "XML",
            "map": "Omfattning",
            "pdf": "Utskrift",
            "select_metadata_prompt": "Välj metadata genom att klicka på ikonerna",
            "metadata_printout_title": "METATIETOTULOSTE",
            "linkto": "Metadatalänk",
            "tabs": {
                "abstract": {
                    "abstract": "",
                    "jhs": "Visa ISO 19115",
                    "inspire": "Visa INSPIRE",
                    "xml": {
                        "text": "Öppna ISO 19139 XML",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Öppna PDF-utskrift",
                        "target": "_blank"
                    }
                },
                "jhs": {
                    "abstract": "Visa basuppgifter",
                    "jhs": "",
                    "inspire": "Visa INSPIRE",
                    "xml": {
                        "text": "Öppna ISO 19139 XML",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Öppna PDF-utskrift",
                        "target": "_blank"
                    }
                },
                "inspire": {
                    "abstract": "Visa basuppgifter",
                    "jhs": "Visa ISO 19115",
                    "inspire": "",
                    "xml": {
                        "text": "Öppna ISO 19139 XML",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Öppna PDF-utskrift",
                        "target": "_blank"
                    }
                }
            }
        },
        "tile": {
            "title": "Metadata",
            "tooltip": "Metadata innehåller uppgifter om användningsvillkor och tillgång till datamaterial."
        }
    }
});