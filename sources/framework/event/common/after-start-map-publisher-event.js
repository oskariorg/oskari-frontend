Oskari.clazz.define(
		'Oskari.mapframework.event.common.AfterStartMapPublisherEvent',
		function(url) {
			this._creator = null;
			this._url = url;
		}, {
			__name : "AfterStartMapPublisherEvent",
			getName : function() {
				return this.__name;
			},

			getUrl : function() {
				return this._url;
			}
		},
		{
			'protocol' : ['Oskari.mapframework.event.Event']
		});

/* Inheritance */

