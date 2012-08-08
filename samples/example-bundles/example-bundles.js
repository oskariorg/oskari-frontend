/**
 * @class Oskari.framework.core-base.Sample
 */
Oskari.clazz
		.define(
				'Oskari.framework.example-bundles.Sample',
				function() {

				},
				{

					/**
					 * @method start
					 * 
					 */
					start : function() {
						if (location.search.length > 1) {
							Oskari.setLoaderMode(location.search.substring(1));
						}
						
						Oskari.$("Ext",Ext);

						var def = {
							title : 'Map',
							fi : 'Map',
							sv : '?',
							en : 'Map',
							bundlename : 'minimal',
							bundleinstancename : 'minimal',
							metadata : {
								"Import-Bundle" : {
									
									/** sample bundle * */
									"bundlemanager" : {
										bundlePath : 'bundle/'
									},
									"gridcalc" : {
										bundlePath : 'bundle/'
									},
									"minimal" : {
										bundlePath : 'bundle/'
									},
									"overview" : {
										bundlePath : 'bundle/'
									},
									"sade3" : {
										bundlePath : 'bundle/'
									},
									"terminal" : {
										bundlePath : 'bundle/'
									},
									"thirdpartymaps" : {
										bundlePath : 'bundle/'
									},
									"wmscaps" : {
										bundlePath : 'bundle/'
									},
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
											 * Core isn't reexample-bundlesy a core at example-bundles
											 * It requires some services, a
											 * bunch of events, requests, user
											 * interface manager of some kind
											 * 
											 */
											if (Oskari.getLoaderMode() == 'dev') {
												var cmd = Oskari.clazz
														.create(
																'Oskari.tools.Yui')
														.yui_command_line_for_app(
																'%YUICOMPRESSOR%');

												document
														.write('<body><pre style="font: 9pt Verdana;">' + cmd + '</pre></body>');
											} else {
												document.write('<body><pre style="font: 9pt Verdana;">loaded packed versions created with '+Oskari.getLoaderMode()+'</pre></body>');
											}

										});
					}
				});

Oskari.clazz.create('Oskari.framework.example-bundles.Sample').start();