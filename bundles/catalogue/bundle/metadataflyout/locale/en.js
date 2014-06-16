Oskari.registerLocalization(
{
    "lang": "en",
    "key": "catalogue.bundle.metadataflyout",
    "value": {
        "title": "Metadata",
        "desc": "",
        "loader": {
            "json": "/catalogue/portti-metadata-printout-service/MetadataServlet?",
            "abstract": "/geonetwork/srv/en/metadata.show.portti.abstract?",
            "inspire": "/geonetwork/srv/en/metadata.show.portti?",
            "jhs": "/geonetwork/srv/en/metadata.show.portti.jhs158?",
            "pdf": "/catalogue/portti-metadata-printout-service/MetadataPrintoutServlet?lang=sv&title=METADATAPRINTOUT&metadataresource",
            "xml": "/geonetwork/srv/en/iso19139.xml?",
            "schemas": "/geonetwork/srv/en/metadata.show.portti.skeemat?"
        },
        "layer": {
            "name": "Metadata",
            "description": "",
            "orgName": "Metadata catalogue",
            "inspire": "Metadata"
        },
        "flyout": {
            "title": "Metadata",
            "abstract": "Basic information",
            "inspire": "Inspire metadata",
            "jhs": "ISO 19115 metadata",
            "xml": "ISO 19139 XML file",
            "map": "Geographic extent",
            "pdf": "Printout",
            "select_metadata_prompt": "Select metadata by clicking the icons.",
            "metadata_printout_title": "METADATA PRINTOUT",
            "linkto": "Link to this metadata",
            "tabs": {
                "abstract": {
                    "abstract": "",
                    "jhs": "Show ISO 19115 metadata",
                    "inspire": "Show INSPIRE metadata",
                    "xml": {
                        "text": "Open ISO 19139 XML file",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Open PDF printout",
                        "target": "_blank"
                    }
                },
                "jhs": {
                    "abstract": "Show basic information",
                    "jhs": "",
                    "inspire": "Show INSPIRE metadata",
                    "xml": {
                        "text": "Open ISO 19139 XML file",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Open metadata in PDF printout",
                        "target": "_blank"
                    }
                },
                "inspire": {
                    "abstract": "Show basic information",
                    "jhs": "Show ISO 19115 metadata",
                    "inspire": "",
                    "xml": {
                        "text": "Open ISO 19139 XML file",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Open metadata in PDF printout",
                        "target": "_blank"
                    }
                }
            }
        },
        "tile": {
            "title": "Metadata",
            "tooltip": "The terms of use and the availability of the dataset are documented in the metadata description."
        }
    }
}
);