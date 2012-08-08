/*
 * Locale for sv
 */
Oskari.registerLocalization({
    "lang" : "sv",
    "key" : "catalogue.bundle.metadataflyout",
    "value" : {
	"title" : "Metadata",
	"desc" : "",
	"loader" : {
	    "json" : "/catalogue/portti-metadata-printout-service/MetadataServlet?",
	    "abstract" : "/geonetwork/srv/sv/metadata.show.portti.abstract?",
	    "inspire" : "/geonetwork/srv/sv/metadata.show.portti?",
	    "jhs" : "/geonetwork/srv/sv/metadata.show.portti.jhs158?",
	    "xml" : "/geonetwork/srv/sv/iso19139.xml?",
	    "schemas" : "/geonetwork/srv/sv/metadata.show.portti.skeemat?",
	    "abstract" : "/geonetwork/srv/sv/metadata.show.portti.abstract?"
	},
	"layer" : {
	    "name" : "Metadata",
	    "description" : "",
	    "orgName" : "Metadata",
	    "inspire" : "Metadata"
	},
	"flyout" : {
	    "title" : "Metadata",
	    "abstract" : "Abstrakt",
	    "inspire" : "INSPIRE",
	    "jhs" : "JHS",
	    "xml" : "XML",
	    "map" : "Omfattning",
	    "pdf" : "Utskrift",
	    "select_metadata_prompt" : "VÃ¤lj metadata...",
	    "metadata_printout_title" : "METATIETOTULOSTE",
	    "linkto" : "AnvÃ¤nd denna lÃ¤nk fÃ¶r att lÃ¤nka till den hÃ¤r metadatan",
	    "tabs" : {
		"abstract" : {
		    "abstract" : "",
		    "jhs" : "Näytä JHS metatieto",
		    "inspire" : "Näytä INSPIRE metatieto",
		    "xml" : "Näytä ISO 19139 XML"
		},
		"jhs" : {
		    "abstract" : "Näytä vain perustiedot",
		    "jhs" : "",
		    "inspire" : "Näytä INSPIRE metatieto",
		    "xml" : "Näytä ISO 19139 XML"
		},
		"inspire" : {
		    "abstract" : "Näytä vain perustiedot",
		    "jhs" : "Näytä JHS metatieto",
		    "inspire" : "",
		    "xml" : "Näytä ISO 19139 XML"
		},
		"xml" : {
		    "abstract" : "Näytä vain perustiedot",
		    "jhs" : "Näytä JHS metatieto",
		    "inspire" : "Näytä INSPIRE metatieto",
		    "xml" : ""
		},
		"pdf" : {
		    "abstract" : "Näytä vain perustiedot",
		    "jhs" : "Näytä JHS metatieto",
		    "inspire" : "Näytä INSPIRE metatieto",
		    "xml" : "Näytä ISO 19139 XML"
		}

	    }
	},
	"tile" : {
	    "title" : "Metadata",
	    "tooltip" : "?"
	}

    }
});
