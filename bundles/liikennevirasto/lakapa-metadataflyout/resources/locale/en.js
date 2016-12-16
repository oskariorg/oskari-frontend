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
            "pdf": "http://www.paikkatietohakemisto.fi/catalogue/portti-metadata-printout-service/MetadataPrintoutServlet?lang=sv&title=METADATAPRINTOUT&metadataresource",
            "xml": "http://www.paikkatietohakemisto.fi/geonetwork/srv/en/iso19139.xml?",
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
                    "abstract": "<span class='lakapa-metadata-tab active'>Show basic information</span>",
                    "jhs": "<span class='lakapa-metadata-tab'>Show ISO 19115 metadata</span>",
                    "inspire": "<span class='lakapa-metadata-tab'>Show INSPIRE metadata</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Open ISO 19139 XML file</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Open PDF printout</span>",
                        "target": "_blank"
                    }
                },
                "jhs": {
                    "abstract": "<span class='lakapa-metadata-tab'>Show basic information</span>",
                    "jhs": "<span class='lakapa-metadata-tab' active>Show ISO 19115 metadata</span>",
                    "inspire": "<span class='lakapa-metadata-tab'>Show INSPIRE metadata</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Open ISO 19139 XML file</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Open PDF printout</span>",
                        "target": "_blank"
                    }
                },
                "inspire": {
                    "abstract": "<span class='lakapa-metadata-tab'>Show basic information</span>",
                    "jhs": "<span class='lakapa-metadata-tab'>Show ISO 19115 metadata</span>",
                    "inspire": "<span class='lakapa-metadata-tab active'>Show INSPIRE metadata</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Open ISO 19139 XML file</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Open PDF printout</span>",
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
});
