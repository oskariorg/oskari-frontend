Oskari.clazz
		.define(
				'Oskari.framework.all.Sample',
				function() {

				},
				{

					/**
					 * @method start
					 * 
					 */
					start : function(mode) {

						var def = {
							title : 'Map',
							fi : 'Map',
							sv : '?',
							en : 'Map',
							bundlename : 'startup',
							bundleinstancename : 'startup',
							metadata : {
								"Import-Bundle" : {
									"domain" : {
										bundlePath : "bundle/"
									},
									/** core of core * */
									"core-base" : {
										bundlePath : 'bundle/'
									},
									/** core map * */
									"core-map" : {
										bundlePath : 'bundle/'
									},
									/** core map * */
									"core-map-full" : {
										bundlePath : 'bundle/'
									},
									/** core requires sandbox * */
									"sandbox-base" : {
										bundlePath : 'bundle/'
									},
									/** sandbox map * */
									"sandbox-map" : {
										bundlePath : 'bundle/'
									},
									/** events & requests * */
									"event-base" : {
										bundlePath : 'bundle/'
									},
									/** events & requests * */
									"event-map" : {
										bundlePath : 'bundle/'
									},
									/** events & requests * */
									"event-map-layer" : {
										bundlePath : 'bundle/'
									},
									"event-map-full" : {
										bundlePath : 'bundle/'
									},

									"request-base" : {
										bundlePath : 'bundle/'
									},
									"request-map" : {
										bundlePath : 'bundle/'
									},
									"request-map-layer" : {
										bundlePath : 'bundle/'
									},
									"request-map-full" : {
										bundlePath : 'bundle/'
									},

									"service-base" : {
										bundlePath : 'bundle/'
									},
									"service-map" : {
										bundlePath : 'bundle/'
									},
									"service-map-full" : {
										bundlePath : 'bundle/'
									},

									"common" : {
										bundlePath : 'bundle/'
									},
									"layerhandler" : {
										bundlePath : 'bundle/'
									},
									"layerselection" : {
										bundlePath : 'bundle/'
									},
									"layerselector" : {
										bundlePath : 'bundle/'
									},
									"mapasker" : {
										bundlePath : 'bundle/'
									},
									"mapcontrols" : {
										bundlePath : 'bundle/'
									},
									"mapmodule-plugin" : {
										bundlePath : 'bundle/'
									},
									"mapoverlaypopup" : {
										bundlePath : 'bundle/'
									},
									"mapposition" : {
										bundlePath : 'bundle/'
									},
									"mapprint" : {
										bundlePath : 'bundle/'
									},
									"mapster" : {
										bundlePath : 'bundle/'
									},
									"myplaces" : {
										bundlePath : 'bundle/'
									},
									
									"runtime" : {
										bundlePath : 'bundle/'
									},
									"yui" : {
										bundlePath : '../tools/bundle/'
									},
									/** sample bundle * */
									"startup" : {
										bundlePath : 'bundle/'
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
														.create(
																'Oskari.tools.Yui');
												
												
												//cmp.setExcludeTags({});
												
																
												var cmd = cmp.yui_command_line_for_app(
																'%YUICOMPRESSOR%');

												document
														.write('<body><pre style="font: 9pt Verdana;">' + cmd + '</pre></body>');
											} else {
												document.write('<body><pre style="font: 9pt Verdana;">loaded packed versions created with '+Oskari.getLoaderMode()+'</pre></body>');
											}

										});
					}
				});

