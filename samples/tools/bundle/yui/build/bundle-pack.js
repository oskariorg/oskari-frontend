/**
 * 
 * yuitools = Oskari.clazz.create('Oskari.tools.Yui');
 * 
 * yuitools.yui_command_line_for_app("\"C:/Omat/EclipseWorkspace/YUI Compressor/build/yuicompressor-2.4.6.jar\"");
 * 
 * @todo optionally (or default to) exclude framework sources 
 * @todo figure out a way to tag  
 * 
 */

Oskari.clazz
		.define(
				'Oskari.tools.Yui',
				function() {

					this.bundle_manager = Oskari.bundle_manager;
					
					this.excludeTags = {
						"mapframework" : true 
					}
				},
				{
					setExcludeTags: function(x) {
						this.excludeTags = x;
					},
					getBundleTags: function(bndl) {
						return this.bundle_manager.stateForBundleDefinitions[bndl].metadata.manifest['Bundle-Tag']||{};
					},
					
					shallExclude: function(tags) {
						var me = this;
						var excludeTags = me.excludeTags;
						
						for( p in tags) {
							if( excludeTags[p]) 
								return true;
						}
						return false;
					},
					
					defaultCompressorJar : "\"../tools/bundle/yui/yuicompressor-2.4.6.jar\"",
					yui_command_line : function(bndlName, pathToJar, bpath) {
						var me = this;
						var def = me.bundle_manager.sources[bndlName];

						var s = '';
						s += 'md build\n';

						
						var bndlSrc = "bundle.js";
						s += "java -jar "
								+ pathToJar
								+ " --charset UTF-8 --line-break 4096 --type js "
								+ bndlSrc + " > build/bundle-yui.js\n";

						s += 'echo /* This is a packed Oskari bundle (bundle script version ' + (new Date()) + ') */ > build/yui.js\n';

						for ( var n = 0; n < def.scripts.length; n++) {
							var rc = def.scripts[n];
							var src = rc.src;
							var typ = "text/javascript" == rc.type ? "js"
									: "css";
							if ("css" == typ)
								continue;

							/*s += "java -jar "
									+ pathToJar
									+ " --charset UTF-8 --line-break 4096 --type "
									+ typ + " " + src + " >> build/yui.js\n";*/
							s += "type "+src+" >> build/bundle-pack.js\n";

						}
						
						s += "java -jar "
							+ pathToJar
							+ " --charset UTF-8 --line-break 4096 --type js "
							+ 'build/bundle-pack.js' + " > build/bundle-yui.js\n";

						return s;

					},

					yui_command_lines : function(pathToJar) {
						var me = this;
						var results = {};
						
						
						
						
						for (bndlName in me.bundle_manager.sources) {
							
							var bndlTags = me.getBundleTags(bndlName);
							if( me.shallExclude(bndlTags) )
								continue;

							var bpath = Oskari.bundle_manager.stateForBundleDefinitions[bndlName].bundlePath;
							var cmd = '';
							cmd += 'pushd \"' + bpath + '\"\n';
							cmd += me.yui_command_line(bndlName, pathToJar,
									bpath);
							cmd += 'popd\n';

							results[bndlName] = cmd;

						}

						return results;

					},
					yui_command_line_for_app : function(pathToJar) {
						var me = this;
						
						var current = "SET CURRENT=%CD%\n";
						var compressor = "SET YUICOMPRESSOR=%CURRENT%/"+this.defaultCompressorJar+"\n";
						
						var results = me.yui_command_lines(pathToJar);

						var cmd = '';

						for (p in results) {

							cmd += results[p];
						}

						return current+compressor+cmd;
					},

					/**
					 * @method showYuiBuildCmd
					 */
					showYuiBuildCmd: function() {
						var cmd = this.yui_command_line_for_app('%YUICOMPRESSOR%');
						
						var openedWindow = window.open();
                        openedWindow.document.write('<body ><pre style="font: 9pt Verdana;">'+cmd+'</body></pre>');
					}
				});
/**
 * 
 * yuitools = Oskari.clazz.create('Oskari.tools.Yui');
 * 
 * yuitools.yui_command_line_for_app("\"C:/Omat/EclipseWorkspace/YUI Compressor/build/yuicompressor-2.4.6.jar\"");
 * 
 * @todo optionally (or default to) exclude framework sources 
 * @todo figure out a way to tag  
 * 
 */

Oskari.clazz
		.define(
				'Oskari.tools.Yui',
				function() {

					this.bundle_manager = Oskari.bundle_manager;
					
					this.excludeTags = {
						"mapframework" : true 
					}
				},
				{
					setExcludeTags: function(x) {
						this.excludeTags = x;
					},
					getBundleTags: function(bndl) {
						return this.bundle_manager.stateForBundleDefinitions[bndl].metadata.manifest['Bundle-Tag']||{};
					},
					
					shallExclude: function(tags) {
						var me = this;
						var excludeTags = me.excludeTags;
						
						for( p in tags) {
							if( excludeTags[p]) 
								return true;
						}
						return false;
					},
					
					defaultCompressorJar : "\"../tools/bundle/yui/yuicompressor-2.4.6.jar\"",
					yui_command_line : function(bndlName, pathToJar, bpath) {
						var me = this;
						var def = me.bundle_manager.sources[bndlName];

						var s = '';
						s += 'md build\n';

						
						var bndlSrc = "bundle.js";
						s += "java -jar "
								+ pathToJar
								+ " --charset UTF-8 --line-break 4096 --type js "
								+ bndlSrc + " > build/bundle-yui.js\n";

						s += 'echo /* This is a packed Oskari bundle (bundle script version ' + (new Date()) + ') */ > build/yui.js\n';

						for ( var n = 0; n < def.scripts.length; n++) {
							var rc = def.scripts[n];
							var src = rc.src;
							var typ = "text/javascript" == rc.type ? "js"
									: "css";
							if ("css" == typ)
								continue;

							/*s += "java -jar "
									+ pathToJar
									+ " --charset UTF-8 --line-break 4096 --type "
									+ typ + " " + src + " >> build/yui.js\n";*/
							s += "type \""+src+"\" >> build/bundle-pack.js\n";

						}
						
						s += "java -jar "
							+ pathToJar
							+ " --charset UTF-8 --line-break 4096 --type js "
							+ 'build/bundle-pack.js' + " > build/bundle-yui.js\n";

						return s;

					},

					yui_command_lines : function(pathToJar) {
						var me = this;
						var results = {};
						
						
						
						
						for (bndlName in me.bundle_manager.sources) {
							
							var bndlTags = me.getBundleTags(bndlName);
							if( me.shallExclude(bndlTags) )
								continue;

							var bpath = Oskari.bundle_manager.stateForBundleDefinitions[bndlName].bundlePath;
							var cmd = '';
							cmd += 'pushd \"' + bpath + '\"\n';
							cmd += me.yui_command_line(bndlName, pathToJar,
									bpath);
							cmd += 'popd\n';

							results[bndlName] = cmd;

						}

						return results;

					},
					yui_command_line_for_app : function(pathToJar) {
						var me = this;
						
						var current = "SET CURRENT=%CD%\n";
						var compressor = "SET YUICOMPRESSOR=%CURRENT%/"+this.defaultCompressorJar+"\n";
						
						var results = me.yui_command_lines(pathToJar);

						var cmd = '';

						for (p in results) {

							cmd += results[p];
						}

						return current+compressor+cmd;
					},

					/**
					 * @method showYuiBuildCmd
					 */
					showYuiBuildCmd: function() {
						var cmd = this.yui_command_line_for_app('%YUICOMPRESSOR%');
						
						var openedWindow = window.open();
                        openedWindow.document.write('<body ><pre style="font: 9pt Verdana;">'+cmd+'</body></pre>');
					}
				});
