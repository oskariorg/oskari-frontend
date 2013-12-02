Oskari.registerLocalization({
    "lang": "fi",
    "key": "catalogue.bundle.metadataflyout",
    "value": {
        "title": "Metatieto",
        "desc": "",
        "loader": {
            "json": "/catalogue/portti-metadata-printout-service/MetadataServlet?",
            "abstract": "/geonetwork/srv/fi/metadata.show.portti.abstract?",
            "inspire": "/geonetwork/srv/fi/metadata.show.portti?",
            "jhs": "/geonetwork/srv/fi/metadata.show.portti.jhs158?",
            "pdf": "/catalogue/portti-metadata-printout-service/MetadataPrintoutServlet?lang=fi&title=METATIETOTULOSTE&metadataresource",
            "xml": "/geonetwork/srv/fi/iso19139.xml?",
            "schemas": "/geonetwork/srv/fi/metadata.show.portti.skeemat?"
        },
        "layer": {
            "name": "Metatieto",
            "description": "",
            "orgName": "Paikkatietohakemisto",
            "inspire": "Metatieto"
        },
        "flyout": {
            "title": "Metatieto",
            "abstract": "Perustiedot",
            "inspire": "INSPIRE",
            "jhs": "JHS",
            "xml": "XML",
            "map": "Kattavuus",
            "pdf": "Tuloste",
            "select_metadata_prompt": "Valitse metatieto kuvakkeista painamalla.",
            "metadata_printout_title": "METATIETOTULOSTE",
            "linkto": "Metatietolinkki",
            "tabs": {
                "abstract": {
                    "abstract": "",
                    "jhs": "Näytä JHS",
                    "inspire": "Näytä INSPIRE",
                    "xml": {
                        "text": "Avaa ISO 19139 XML",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Avaa PDF -tuloste",
                        "target": "_blank"
                    }
                },
                "jhs": {
                    "abstract": "Näytä perustiedot",
                    "jhs": "",
                    "inspire": "Näytä INSPIRE",
                    "xml": {
                        "text": "Avaa ISO 19139 XML",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Avaa PDF -tuloste",
                        "target": "_blank"
                    }
                },
                "inspire": {
                    "abstract": "Näytä perustiedot",
                    "jhs": "Näytä JHS",
                    "inspire": "",
                    "xml": {
                        "text": "Avaa ISO 19139 XML",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "Avaa PDF -tuloste",
                        "target": "_blank"
                    }
                }
            }
        },
        "tile": {
            "title": "Metatieto",
            "tooltip": "Metatiedoista selviää aineiston käyttöehdot ja saatavuus."
        }
    }
});