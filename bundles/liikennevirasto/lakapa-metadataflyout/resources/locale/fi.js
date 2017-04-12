Oskari.registerLocalization(
{
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
            "pdf": "http://www.paikkatietohakemisto.fi/catalogue/portti-metadata-printout-service/MetadataPrintoutServlet?lang=fi&title=METATIETOTULOSTE&metadataresource",
            "xml": "http://www.paikkatietohakemisto.fi/geonetwork/srv/fi/iso19139.xml?",
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
            "inspire": "Inspire-metatiedot",
            "jhs": "JHS 158-metatiedot",
            "xml": "ISO 19139 XML-tiedosto",
            "map": "Kattavuus",
            "pdf": "Tuloste",
            "select_metadata_prompt": "Valitse metatieto kuvakkeista painamalla.",
            "metadata_printout_title": "METATIETOKUVAUS",
            "linkto": "Metatietolinkki",
            "tabs": {
                "abstract": {
                    "abstract": "<span class='lakapa-metadata-tab active'>Perustiedot</span>",
                    "jhs": "<span class='lakapa-metadata-tab'>JHS 158-metatiedot</span>",
                    "inspire": "<span class='lakapa-metadata-tab'>Inspire-metatiedot</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>ISO 19139 XML-tiedosto</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Tuloste</span>",
                        "target": "_blank"
                    }
                },
                "jhs": {
                    "abstract": "<span class='lakapa-metadata-tab'>Perustiedot</span>",
                    "jhs": "<span class='lakapa-metadata-tab active'>JHS 158-metatiedot</span>",
                    "inspire": "<span class='lakapa-metadata-tab'>Inspire-metatiedot</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>ISO 19139 XML-tiedosto</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Tuloste</span>",
                        "target": "_blank"
                    }
                },
                "inspire": {
                    "abstract": "<span class='lakapa-metadata-tab'>Perustiedot</span>",
                    "jhs": "<span class='lakapa-metadata-tab'>JHS 158-metatiedot</span>",
                    "inspire": "<span class='lakapa-metadata-tab active'>Inspire-metatiedot</span>",
                    "xml": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>ISO 19139 XML-tiedosto</span>",
                        "target": "_blank"
                    },
                    "pdf": {
                        "text": "<span class='lakapa-metadata-tab extra-content'>Tuloste</span>",
                        "target": "_blank"
                    }
                }
            }
        },
        "tile": {
            "title": "Metatieto",
            "tooltip": "Metatieto on tietoa tiedosta, tässä tapauksessa joko paikkatietoaineistosta, -aineistosarjasta tai -palvelusta. Metatiedoista selviää mm. kyseisen tietoresurssin käyttöehdot ja saatavuus."
        }
    }
});
