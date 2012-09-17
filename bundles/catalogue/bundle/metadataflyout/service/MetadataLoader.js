/**
 * @class Oskari.catalogue.bundle.metadataflyout.service.MetadataLoader
 *
 * Class to load metadata content from backend
 *
 */
Oskari.clazz.define("Oskari.catalogue.bundle.metadataflyout.service.MetadataLoader", function(urls, sandbox) {
	this.urls = urls;
	this.sandbox = sandbox;
	this.dev = false;
}, {

	/**
	 * @method getURLForView
	 *
	 * builds backend URL URI or whatever it's called n
	 */
	getURLForView : function(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType) {
		var url = this.urls[subsetId];
		var uri = url + "uuid=" + uuid;

		/*dev only */
		if(this.dev) {
			var devuri = {
			'abstract': 'abstract',
			'jhs' : 'jhs158',
			'inspire' : 'inspire',
			'json' : 'json'		}[subsetId];

			if(devuri != null) {
				uri = devuri;
			}

		}

		return uri;
	},
	/**
	 * @method loadMetadata
	 *
	 * loads metadata from backend
	 *
	 */
	loadMetadata : function(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType) {

		var uri = this.getURLForView(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);

		this.sandbox.printDebug("loadMetadata " + uri);

		if(uri == null)
			return;

		jQuery.ajax({
			url : uri,
			dataType : dataType || 'xml',
			beforeSend : function(x) {
				if(x && x.overrideMimeType) {
					if(dataType && dataType == 'json')
						x.overrideMimeType("application/json");
					else
						x.overrideMimeType("text/html");
				}
			},
			success : function(data, textStatus) {

				cb(data,true);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				cb(null,false);

			}
		});

	},
	
	/**
	 * Helper to circumvent jQuery ajax html hassles
	 */
	loadGeonetworkAjaxHTML: function(handler,viewId, metadata_uuid, metadata_RS_Identifier_Code, metadata_RS_Identifier_CodeSpace) {
		var uri = this.getURLForView(viewId, metadata_uuid, metadata_RS_Identifier_Code, metadata_RS_Identifier_CodeSpace);

		var request = OpenLayers.Request.GET({
			url : uri,
			callback : handler
		});
	},
	/**
	 * @method openMetadata
	 *
	 * opens metadata from backend to new window
	 *
	 */
	openMetadata : function(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType, target) {
		var uri = this.getURLForView(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);

		this.sandbox.printDebug("openMetadata " + uri);

		var win = window.open(uri, target, "resizable=yes,scrollbars=yes,status=yes");

	}
});
