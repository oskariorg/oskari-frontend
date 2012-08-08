
/*
  Adapt.js licensed under GPL and MIT.

  Read more here: http://adapt.960.gs
*/

/**
 * @class Oskari.mapframework.bundle.SampleBundleInstance
 */

/**
 * @class Oskari.mapframework.bundle.SampleBundle
 * 
 */


Oskari.clazz
		.define(
				"Oskari.mapframework.ns960.Bundle",
				/**
				 * @constructor
				 * 
				 * Bundle's constructor is called when bundle is created. At
				 * this stage bundle sources have been loaded, if bundle is
				 * loaded dynamically.
				 * 
				 */
				function() {

					/**
					 * @property config
					 */
					
					this.config = null;
					
					/*
					 * Any bundle specific classes may be declared within
					 * constructor to enable stealth mode
					 * 
					 * When running within map application framework - Bundle
					 * may refer classes declared with Oskari.clazz.define() -
					 * Bundle may refer classes declared with Ext.define -
					 * Bundle may refer classes declared within OpenLayers
					 * libary
					 * 
					 * 
					 */
				},

				{
					/*
					 * @method create
					 * 
					 * called when a bundle instance will be created
					 * 
					 */
					"create" : function() {

						var path = 'bundle/ns960/assets/css/';
						
					
						var conf = {
								  // Where is your CSS?
								  path: path,

								  // false = Only run once, when page first loads.
								  // true = Change on window resize and page tilt.
								  dynamic: true,

								  
								  // First range entry is the minimum.
								  // Last range entry is the maximum.
								  // Separate ranges by "to" keyword.
								  range: [
								    '0px    to 760px  = mobile.min.css',
									  //								    '760px  to 980px  = 720.min.css',
								    '760px  to 1280px = 960.min.css',
								    '1280px to 1600px = 1200.min.css',
								    '1600px to 1940px = 1560.min.css',
								    '1940px to 2540px = 1920.min.css',
								    '2540px           = 2520.min.css'
								  ]
								};
						
						var me = this;
						conf.callback = function() {
							me.callback.apply(me,arguments);
						}
					
						me.config = conf;
			
						return this;
					},

					"callback" : function(i,width) {
						/**
						 * Might rearrange UI
						 * 
						 */
						/*console.log("SELECTING RANGE "+i+" ("+width+")");*/
						
					},
					
					"adapt" : function(w, d, config, undefined) {
						  // If no config, exit.
						  var me = this;
						
						  if (!config) {
						    return;
						  }

						  // Empty vars to use later.
						  var url, url_old;

						  // Alias config values.
						  var callback = typeof config.callback === 'function' ? config.callback : undefined;
						  var path = config.path ? config.path : '';
						  var range = config.range;
						  var range_len = range.length;

						  // Create empty link tag:
						  // <link rel="stylesheet" />
						  var css = d.createElement('link');
						  css.rel = 'stylesheet';
						  css.media = 'screen';

						  // Called from within adapt().
						  function change(i, width) {
						    // Set the URL.
						    css.href = url;
						    url_old = url;

						    // Call callback, if defined.
						    callback && callback(i, width);
						  }

						  // Adapt to width.
						  function adapt() {
						    // This clearTimeout is for IE.
						    // Really it belongs in react(),
						    // but doesn't do any harm here.
						    clearTimeout(me.timer);

						    // Parse browser width.
						    var width = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth || 0;

						    // While loop vars.
						    var arr, arr_0, val_1, val_2, is_range, file;

						    // How many ranges?
						    var i = range_len;
						    var last = range_len - 1;

						    while (i--) {
						      // Blank if no conditions met.
						      url = '';

						      // Turn string into array.
						      arr = range[i].split('=');

						      // Width is to the left of "=".
						      arr_0 = arr[0];

						      // File name is to the right of "=".
						      // Presuppoes a file with no spaces.
						      // If no file specified, make empty.
						      file = arr[1] ? arr[1].replace(/\s/g, '') : undefined;

						      // Assume max if "to" isn't present.
						      is_range = arr_0.match('to');

						      // If it's a range, split left/right sides of "to",
						      // and then convert each one into numerical values.
						      // If it's not a range, turn maximum into a number.
						      val_1 = is_range ? parseInt(arr_0.split('to')[0], 10) : parseInt(arr_0, 10);
						      val_2 = is_range ? parseInt(arr_0.split('to')[1], 10) : undefined;

						      // Check for maxiumum or range.
						      if ((!val_2 && i === last && width > val_1) || (width > val_1 && width <= val_2)) {
						        // Build full URL to CSS file.
						        file && (url = path + file);

						        // Exit the while loop. No need to continue
						        // if we've already found a matching range.
						        break;
						      }
						    }

						    // Was it created yet?
						    if (!url_old) {
						      // Apply changes.
						      change(i, width);

						      // Add the CSS, only if path is defined.
						      // Use faster document.head if possible.
						      path && (d.head || d.getElementsByTagName('head')[0]).appendChild(css);
						    }
						    else if (url_old !== url) {
						      // Apply changes.
						      change(i, width);
						    }
						  }

						  // Fire off once.
						  adapt();

						  // Slight delay.
						  function react() {
						    // Clear the timer as window resize fires,
						    // so that it only calls adapt() when the
						    // user has finished resizing the window.
						    clearTimeout(me.timer);

						    // Start the timer countdown.
						    me.timer = setTimeout(adapt, 16);
						    // -----------------------^^
						    // Note: 15.6 milliseconds is lowest "safe"
						    // duration for setTimeout and setInterval.
						    //
						    // http://www.nczonline.net/blog/2011/12/14/timer-resolution-in-browsers
						  }

						  // Do we want to watch for
						  // resize and device tilt?
						  if (config.dynamic) {
						    // Event listener for window resize,
						    // also triggered by phone rotation.
						    if (w.addEventListener) {
						      // Good browsers.
						      w.addEventListener('resize', react, false);
						    }
						    else if (w.attachEvent) {
						      // Legacy IE support.
						      w.attachEvent('onresize', react);
						    }
						    else {
						      // Old-school fallback.
						      w.onresize = react;
						    }
						  }

						// Pass in window, document, config, undefined.
						},
					
					
					/**
					 * @method update
					 * 
					 * Called by Bundle Manager to provide state information to
					 * bundle
					 * 
					 */
					"update" : function(manager, bundle, bi, info) {

					},
					
					"start" : function() {
						/* enable (load/install callback) CSS */
						var me = this;
						var conf = this.config;
						me.adapt(window, window.document, conf);
					},
					
					"stop" : function() {
						/* disable (uninstall callback/unload) CSS */
						/* NYI */
					}

				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance" ],
					"source" : {

						"scripts" : [],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "ns960",
							"Bundle-Name" : "mapframework.ns960.Bundle",
							"Bundle-Author" : [ {
								"Name" : "jjk",
								"Organisation" : "nls.fi",
								"Temporal" : {
									"Start" : "2009",
									"End" : "2011"
								},
								"Copyleft" : {
									"License" : {
										"License-Name" : "EUPL",
										"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
									}
								}
							} ],
							"Bundle-Name-Locale" : {
								"fi" : {
									"Name" : " mapframework.mapportal.Bundle",
									"Title" : " mapframework.mapportal.Bundle"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari" ],
							"Import-Bundle" : {}
						}
					}
				});

/**
 * Install this bundle by instantating the Bundle Class
 * 
 */
Oskari.bundle_manager.installBundleClass("ns960",
		"Oskari.mapframework.ns960.Bundle");
