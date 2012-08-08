Oskari.clazz.define('Oskari.mapframework.service.GetFeatureInfoService',
		function() {

		}, {
			__qname: "Oskari.mapframework.service.GetFeatureInfoService",
			getQName: function() {
				return this.__qname;
			},
			__name : "GetFeatureInfoService",
			getName : function() {
				return this.__name;
			},

			doGetFeatureInfo : function(x, y, infoFormat, queryLayers, width,
					height, wmsBaseUrl, onResult) {

				var url = "REQUEST=GetFeatureInfo"
						+ "&EXCEPTIONS=application/vnd.ogc.se_xml" + "&BBOX="
						+ bbox + "&X=" + x + "&Y=" + y + "&INFO_FORMAT="
						+ infoFormat + "&QUERY_LAYERS=" + queryLayers
						+ "&WIDTH=" + width + "&HEIGHT=" + height
						+ "&FEATURE_COUNT=1";

				jQuery.ajax( {
					dataType : "text",
					type : "POST",
					url : wmsBaseUrl,
					data : url,
					success : onResult
				});

			}
		},
		{
			'protocol' : ['Oskari.mapframework.service.Service']
		});

/* Inheritance */
