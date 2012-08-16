Oskari.clazz.define('Oskari.mapframework.service.NetServiceCenterService',
		function(endpoint) {

			this._endpoint = endpoint;
		}, {
			__qname: "Oskari.mapframework.service.NetServiceCenterService",
			getQName: function() {
				return this.__qname;
			},

			__name : "NetServiceCenterService",
			getName : function() {
				return this.__name;
			},

			doRequest : function(actionKey, paramMap, onComplete) {
				var paramString = "";
				if (paramMap != null) {
					for ( var key in paramMap) {
						paramString += "&" + key + "="
								+ encodeURIComponent(paramMap[key]);
					}
				}

				jQuery.ajax( {
					dataType : "json",
					type : "POST",
					url : this._endpoint + "&actionKey=" + actionKey
							+ paramString,
					data : "actionKey=" + actionKey + paramString,
					complete : onComplete
				});
			}
		},
		{
			'protocol' : ['Oskari.mapframework.service.Service']
		});

/* Inheritance */
