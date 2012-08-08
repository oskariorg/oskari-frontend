Oskari.clazz.define("Oskari.mapframework.bundle.MinimalBundleInstance",
		function() {

		}, {

			"start" : function() {
				alert('Started!');

			},
			"update" : function() {

			},
			"stop" : function() {
				alert('Stopped!');
			}
		}, {
			"protocol" : [ "Oskari.bundle.BundleInstance" ]
		});