/*
 * Locale for fi
 */
Oskari.registerLocalization({
    "lang" : "en",
    "key" : "catalogue.bundle.metadataflyout",
    "value" : {
	"title" : "Metadata",
	"desc" : "",
	"loader" : {
	    "json" : "/catalogue/portti-metadata-printout-service/MetadataServlet?",
	    "abstract" : "/geonetwork/srv/en/metadata.show.portti.abstract?",
	    "inspire" : "/geonetwork/srv/en/metadata.show.portti?",
	    "jhs" : "/geonetwork/srv/en/metadata.show.portti.jhs158?",
	    "xml" : "/geonetwork/srv/en/iso19139.xml?",
	    "schemas" : "/geonetwork/srv/en/metadata.show.portti.skeemat?",
	    "abstract" : "/geonetwork/srv/en/metadata.show.portti.abstract?"
	},
	"layer" : {
	    "name" : "Metadata",
	    "description" : "",
	    "orgName" : "Metadata",
	    "inspire" : "Metadata"
	},
	"flyout" : {
	    "title" : "Metadata",
	    "abstract" : "Abstract",
	    "inspire" : "INSPIRE",
	    "jhs" : "JHS",
	    "xml" : "XML",
	    "map" : "Geographic Extent",
	    "pdf" : "Printout",
	    "select_metadata_prompt" : "Select metadata by clicking one of the icons.",
	    "metadata_printout_title" : "METADATA PRINTOUT",
	    "linkto" : "Link to this Metadata",
	    "tabs" : {
		"abstract" : {
		    "abstract" : "",
		    "jhs" : "Show JHS metadata",
		    "inspire" : "Show INSPIRE metadata",
		    "xml" : {
			"text" : "Näytä ISO 19139 XML",
			"target" : "_blank"
		    }

		},
		"jhs" : {
		    "abstract" : "Show Abstract",
		    "jhs" : "",
		    "inspire" : "Show INSPIRE metadata",
		    "xml" : {
			"text" : "Show ISO 19139 XML",
			"target" : "_blank"
		    }

		},
		"inspire" : {
		    "abstract" : "Show Abstract",
		    "jhs" : "Show JHS metadata",
		    "inspire" : "",
		    "xml" : {
			"text" : "Show ISO 19139 XML",
			"target" : "_blank"
		    }
		}

	    }
	},
	"tile" : {
	    "title" : "Metadata",
	    "tooltip" : "?"
	}

    }
});
