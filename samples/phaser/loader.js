/**
 * @class Oskari.framework.core-base.Sample
 */
(function() {
	
	Oskari.setLoaderMode('yui');
	
	var def_a = {
			title : 'Base',
			fi : 'Base',
			sv : '?',
			en : 'Base',
			bundlename : 'phase-a',
			bundleinstancename : 'phase-a',
			metadata : {
				"Import-Bundle" : {
					"phase-a" : {
						bundlePath : "bundle/"
					}
				},

				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : []

				},
				instanceProps : {

				}
			};
	
	Oskari.bundle_facade
	.playBundle(
			def_a,
			function() {
				
				var def_b = {
						title : 'Base',
						fi : 'Base',
						sv : '?',
						en : 'Base',
						bundlename : 'phase-b',
						bundleinstancename : 'phase-b',
						metadata : {
							"Import-Bundle" : {
								"phase-b" : {
									bundlePath : "bundle/"
								}
							},

							/**
							 * A list of bundles to be started
							 */
							"Require-Bundle-Instance" : []

							},
							instanceProps : {

							}
						};
				
				Oskari.bundle_facade
				.playBundle(
						def_b,
						function() {
				Oskari.clazz.create('Oskari.framework.all.Sample').start();
						});
			});
})();