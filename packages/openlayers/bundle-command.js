
/**
 * @class Oskari.mapframework.OpenLayersBundleCommand
 */
Oskari.clazz
		.define(
				'Oskari.framework.OpenLayersBundleCommand',
				function() {

				},
				{

					/**
					 * @method start
					 * 
					 */
					start : function() {
						var query = location.search;
						if( query.indexOf('?') == -1)
							return;
						
						var bndl = query.substring(1);
					
						Oskari.setLoaderMode('dev');

						var def = {
							title : 'OpenLayers',
							fi : 'OpenLayers',
							sv : '?',
							en : 'OpenLayers',
							bundlename : 'yui',
							bundleinstancename : 'yui',
							metadata : {
								"Import-Bundle" : {
									/** core of core * */
									
									"yui" : {
										bundlePath : '../tools/bundle/'
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
						
						def.metadata["Import-Bundle"][bndl] = {
							bundlePath : 'bundle/'
						};

						/** use sample bundle to fire the engine * */
						Oskari.bundle_facade
								.playBundle(
										def,
										function() {

											/**
											 * now we're ready to do something
											 * with the core
											 */

											/**
											 * Core isn't really a core at all
											 * It requires some services, a
											 * bunch of events, requests, user
											 * interface manager of some kind
											 * 
											 */

											if (Oskari.getLoaderMode() == 'dev') {
												var cmp = Oskari.clazz
														.create('Oskari.tools.Yui');

												cmp.setExcludeTags( {});

												var cmd = cmp
														.yui_command_line_for_app('%YUICOMPRESSOR%');

												document
														.write('<body><pre style="font: 9pt Verdana;">' + cmd + '</pre></body>');
											} else {
												document
														.write('<body><pre style="font: 9pt Verdana;">loaded packed versions created with ' + Oskari
																.getLoaderMode() + '</pre></body>');
											}

										});
					}
				});

Oskari.clazz.create('Oskari.framework.OpenLayersBundleCommand').start();
