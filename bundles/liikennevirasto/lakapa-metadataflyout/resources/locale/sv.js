Oskari.registerLocalization(
{
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
            "pdf": "http://www.paikkatietohakemisto.fi/catalogue/portti-metadata-printout-service/MetadataPrintoutServlet?lang=sv&title=METADATAUTSKRIFT&metadataresource",
            "xml": "http://www.paikkatietohakemisto.fi/geonetwork/srv/sv/iso19139.xml?",
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
                    "abstract": "<span class='lakapa-metadata-tab active'>Visa basuppgifter</span>",
                    "jhs": "<span class='lakapa-metadata-tab'>Visa ISO 19115</span>",
                    "inspire": "<span class='lakapa-metadata-tab'>Visa INSPIRE</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Öppna ISO 19139 XML</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Öppna PDF-utskrift</span>",
                        "target": "_blank"
                    }
                },
                "jhs": {
                    "abstract": "<span class='lakapa-metadata-tab'>Visa basuppgifter</span>",
                    "jhs": "<span class='lakapa-metadata-tab active'>Visa ISO 19115</span>",
                    "inspire": "<span class='lakapa-metadata-tab'>Visa INSPIRE</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Öppna ISO 19139 XML</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Öppna PDF-utskrift</span>",
                        "target": "_blank"
                    }
                },
                "inspire": {
                    "abstract": "<span class='lakapa-metadata-tab'>Visa basuppgifter</span>",
                    "jhs": "<span class='lakapa-metadata-tab'>Visa ISO 19115</span>",
                    "inspire": "<span class='lakapa-metadata-tab active'>Visa INSPIRE</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Öppna ISO 19139 XML</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Öppna PDF-utskrift</span>",
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
