/**
 * @class Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance
 *
 * Default DIV Manager implementation handles menu like and detached DIVs
 * handles hiding showing DIVS.
 * Draggability is enabled in top-border element when DIV is detached
 *
 */
Oskari.clazz.define("Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance",

/**
 * @method init called on constructing this instance
 */
function() {
	this.sandbox = null;

	/**
	 * @property requestHandlers
	 */
	this.requestHandlers = {};

	this.extensions = [];
	this.extensionsByName = {};

	/**
	 * @property compiledTemplates
	 *
	 * HTML templates 'compiled' with jQuery - HTML code in static property templates
	 */
	this.compiledTemplates = {};

	/**
	 * @property flyoutContainer (document.body)
	 */
	this.flyoutContainer = null;

	/**
	 * @property tileContainer (#menubar)
	 */
	this.tileContainer = null;

	/**
	 * @property flyoutZIndexBase
	 */
	this.flyoutZIndexBase = 1100;

	/**
	 * @property menubarContainerId
	 */
	this.menubarContainerId = "#menubar";

}, {

	getName : function() {
		return "userinterface.DivManazer";
	},
	init : function(sandbox) {

	},
	getExtensionByName : function(name) {
		return this.extensionsByName[name];
	},
	/**
	 7	 * @method getSandbox
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method start
	 *
	 * implements BundleInstance start methdod
	 *
	 * creates tile and flyout compiledTemplates
	 * creates and registers request handlers
	 *
	 */
	"start" : function() {

		/*
		 * setup templates
		 */
		this.compileTemplates();

		this.flyoutContainer = jQuery(document.body);
		this.tileContainer = jQuery(this.menubarContainerId);
		this.tileContainer.addClass("oskari-tile-container");

		/*
		 * setup requests and handlers
		 */
		var sandbox = Oskari.$("sandbox");
		this.sandbox = sandbox;

		this.sandbox.register(this);

		this.requestHandlers['add'] = Oskari.clazz.create('Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler', this);
		this.requestHandlers['remove'] = Oskari.clazz.create('Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler', this);
		this.requestHandlers['update'] = Oskari.clazz.create('Oskari.userinterface.bundle.ui.request.UpdateExtensionRequestHandler', this);

		sandbox.addRequestHandler('userinterface.AddExtensionRequest', this.requestHandlers['add']);
		sandbox.addRequestHandler('userinterface.RemoveExtensionRequest', this.requestHandlers['remove']);
		sandbox.addRequestHandler('userinterface.UpdateExtensionRequest', this.requestHandlers['update']);

		this.requestHandlers['modal'] = Oskari.clazz.create('Oskari.userinterface.bundle.ui.request.ModalDialogRequestHandler', this);
		sandbox.addRequestHandler('userinterface.ModalDialogRequest', this.requestHandlers['modal']);

		/* removed for some reason or another */
		//		sandbox.registerAsStateful(this.mediator.bundleId, this);

		/* IE fixes for flyout height others use CSS media query */
		if(jQuery.browser.msie && jQuery.browser.version < "9.0") {
			var toFix = this.compiledTemplates['Oskari.userinterface.Flyout'].children('.oskari-flyoutcontentcontainer');
			var height = this.flyoutContainer.height();
			var ieFixClasses = this.ieFixClasses;
			for(var n = 0; n < ieFixClasses.length; n++) {
				var fix = ieFixClasses[n];

				if(height >= fix.min && height <= fix.max) {
					toFix.addClass(fix.cls);
					break;
				}
			}

		}

	},
	/**
	 * @method update
	 *
	 * implements bundle instance update method
	 */
	"update" : function() {

	},
	/**
	 * @method stop
	 *
	 * implements bundle instance stop method
	 *
	 * removes request handlers
	 */
	"stop" : function() {
		sandbox.removeRequestHandler('userinterface.UpdateExtensionRequest', this.requestHandlers['update']);
		sandbox.removeRequestHandler('userinterface.RemoveExtensionRequest', this.requestHandlers['remove']);
		sandbox.removeRequestHandler('userinterface.AddExtensionRequest', this.requestHandlers['add']);
		sandbox.removeRequestHandler('userinterface.ModalDialogRequest', this.requestHandlers['modal']);

		//		this.sandbox.unregisterStateful(this.mediator.bundleId);

		this.sandbox.unregister(this);
		this.started = false;

	},
	/**
	 * HTML templates
	 */
	"templates" : {

		/* menu tile */
		"Oskari.userinterface.Tile" : '<div class="oskari-tile oskari-tile-closed">' + '<div class="oskari-tile-title"></div>' + '<div class="oskari-tile-status"></div>' + '</div>',

		/* flyout */
		"Oskari.userinterface.Flyout" : '<div class="oskari-flyout oskari-closed">' + '<div class="oskari-flyouttoolbar">' + '<div class="oskari-flyoutheading"></div>' + '<div class="oskari-flyout-title">' + '<p></p>' + '</div>' + '<div class="oskari-flyouttools">' + '<div class="oskari-flyouttool-help">' + '</div>' + '<div class="oskari-flyouttool-attach">' + '</div>' + '<div class="oskari-flyouttool-detach">' + '</div>' + '<div class="oskari-flyouttool-minimize">' + '</div>' + '<div class="oskari-flyouttool-restore">' + '</div>' + '<div class="oskari-flyouttool-close icon-close icon-close:hover">' + '</div>' + '</div>' + '</div>' + '<div class="oskari-flyoutcontentcontainer">' + '<div class="oskari-flyoutcontent"></div>' + '</div>' + '</div>'

	},

	/**
	 * @method compileTemplates
	 *
	 * creates jQuery template to be cloned to any menubar Tiles
	 */
	"compileTemplates" : function() {
		/**
		 * Templates
		 */
		var me = this;
		me.compiledTemplates['Oskari.userinterface.Tile'] = jQuery(this.templates['Oskari.userinterface.Tile']);

		var flyout = jQuery(me.templates['Oskari.userinterface.Flyout']);

		/*flyout.css('left', '-3195px');
		 flyout.css('top', '-3100px');*/
		flyout.css('left', me.defaults.attach.left);
		flyout.css('top', me.defaults.attach.top);

		me.compiledTemplates['Oskari.userinterface.Flyout'] = flyout;
	},
	/**
	 * @method addExtension
	 *
	 * adds extension to Oskari DIV Manager in response to a
	 * AddExtensionRequest
	 */
	"addExtension" : function(extension) {

		var me = this;
		extension.startExtension();

		var plugins = extension.getPlugins();

		var plugin = null;
		var extensions = this.extensions;
		var extensionsByName = this.extensionsByName;

		var extensionInfo = {
			state : 'close',
			extension : extension,
			draggable : null,
			draggableTarget : null,
			draggableHandle : null,
			viewState : {},
			extensionUpdatedEvent : null
		};

		extensionInfo.extensionUpdatedEvent = this.sandbox.getEventBuilder('userinterface.ExtensionUpdatedEvent')(extension, extensionInfo.state);

		var count = extensions.length;
		var name = extension.getName();

		var flyoutPlugin = plugins['Oskari.userinterface.Flyout'];
		var flyout = null;
		if(flyoutPlugin != null) {
			flyout = this.createFlyout(extension, flyoutPlugin, count, extensionInfo);

			this._applyDraggableToFlyout(flyout, extensionInfo, '.oskari-flyouttoolbar')

			var fcc = flyout.children('.oskari-flyoutcontentcontainer');
			var fcccc = fcc.children('.oskari-flyoutcontent');

			var el = fcc.children('.oskari-flyoutcontent');

			flyoutPlugin.setEl(el.get());

			this.flyoutContainer.append(flyout);

			flyoutPlugin.startPlugin();

		}

		var tilePlugin = plugins['Oskari.userinterface.Tile'];
		var tile = null;
		if(tilePlugin != null) {
			tile = this.createTile(extension, tilePlugin, count, extensionInfo);

			tilePlugin.startPlugin();

			tile.fadeIn(200);

			this.tileContainer.append(tile);
		}

		/*
		 * store these for further usage
		 */
		extensionInfo['plugins'] = {};

		if(tilePlugin) {
			extensionInfo['plugins']['Oskari.userinterface.Tile'] = {
				plugin : tilePlugin,
				el : tile
			};
		}
		if(flyoutPlugin) {
			extensionInfo['plugins']['Oskari.userinterface.Flyout'] = {
				plugin : flyoutPlugin,
				el : flyout
			};
		}

		extensions.push(extensionInfo);
		extensionsByName[name] = extensionInfo;

		return extensionInfo;
	},
	/**
	 * @method _applyDraggableToFlyout
	 * applies draggable handle to flyouts title bar
	 */
	_applyDraggableToFlyout : function(flyout, extensionInfo, cls) {
		var me = this;
		var handle = flyout.children(cls).get()[0];
		var flyoutTarget = flyout.get()[0];

		extensionInfo.draggableHandle = handle;
		extensionInfo.draggableTarget = flyoutTarget;

		/* jQueryUI won't work without this */
		flyout.css("position", "absolute");

		var useHelper = true;

		extensionInfo.draggable = $(flyout).draggable({
			handle : jQuery(handle),
			helper : useHelper ? function() {
				var el = jQuery('<div />');

				el.css("width", flyout.css("width"));
				el.css("height", flyout.css("height"));
				el.css("border", "2px solid rgba(0,0,0,.5)");
				el.css("z-index", flyout.css("z-index"));

				return el;
			} : null,
			scroll : false,
			stack : '.oskari-flyout',
			create : function(event, ui) {
				/* IE8 works fine BUT IE9 needs fixed width to not jump flyout width during and after dragging */
				if(jQuery.browser.msie && jQuery.browser.version[0] === "9") {
					flyout.css('width',flyout.width()+"px"); 
				}
			},
			start : function() {
				if(useHelper) {
					flyout.css("display", "none");
				} else {
					/* Attempt to fix IE9 vs. draggable flyout width issues */
					/* this did not work */
					/* if(jQuery.browser.msie && jQuery.browser.version[0] === "9") {
						flyout.css('width',flyout.width()+"px"); 
					}
					*/

				}
			},
			drag : function() {
				if(useHelper) {
					flyout.css("display", "none");
				} else {
					/* Attempt to fix IE9 vs. draggable flyout width issues */
					/* this did not work */
					 if(jQuery.browser.msie && jQuery.browser.version[0] === "9") {
						flyout.css('width',flyout.width()+"px"); 
					}
					

				}

			},
			stop : function(event, ui) {
				if(useHelper) {
					flyout.css("top", ui.helper.css("top"));
					flyout.css("left", ui.helper.css("left"));
				} else {
					/* Attempt to fix IE9 vs. draggable flyout width issues */
					/* this did not work */
					/*if(jQuery.browser.msie && jQuery.browser.version[0] === "9") {
						if(jQuery.browser.msie && jQuery.browser.version[0] === "9") {
							flyout.css('width',''); 
						}

					}*/
					
				}
				me.shuffleZIndices(flyout);
				if(useHelper) {
					flyout.css("display", "");
				}
				//flyout.css("height", "");
				var viewState = me.getFlyoutViewState(flyout, "detach");

				extensionInfo.viewState = viewState;
				me.notifyExtensionViewStateChange(extensionInfo);

			}
		});
	},
	/**
	 * @method createTile
	 *
	 * creates menubar tile using the tile template
	 */

	createTile : function(extension, plugin, count, extensionInfo) {
		var me = this;
		var container = jQuery('#menubar');
		var tile = this.compiledTemplates['Oskari.userinterface.Tile'].clone(true, true);

		var title = tile.children('.oskari-tile-title');
		title.append(plugin.getTitle());
		var status = tile.children('.oskari-tile-status');

		tile.click(function() {
			//plugin.setExtensionState();

			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'toggle']);
		});
		/*title.click(function() {
		 //plugin.setExtensionState();

		 me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'toggle']);
		 });
		 status.click(function() {
		 //plugin.setExtensionState();

		 me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'toggle']);
		 });
		 */

		plugin.setEl(tile.get());

		return tile;
	},
	/**
	 * @method createFlyout
	 *
	 * creates flyout DIV using the flyout template adds a bunch
	 * of tools to the DIV toolbar
	 *
	 */
	createFlyout : function(extension, plugin, count, extensionInfo) {
		var me = this;
		var flyout = this.compiledTemplates['Oskari.userinterface.Flyout'].clone(true, true);
		flyout.find('.oskari-flyout-title p').append(plugin.getTitle());

		var flyouttools = flyout.children('.oskari-flyouttoolbar').children('.oskari-flyouttools');
		var toolage = {
			attach : flyouttools.children('.oskari-flyouttool-attach'),
			detach : flyouttools.children('.oskari-flyouttool-detach'),
			minimize : flyouttools.children('.oskari-flyouttool-minimize'),
			restore : flyouttools.children('.oskari-flyouttool-restore'),
			close : flyouttools.children('.oskari-flyouttool-close'),
			help : flyouttools.children('.oskari-flyouttool-help')
		};

		toolage.detach.click(function() {
			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'detach']);

		});
		toolage.attach.click(function() {
			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'attach']);

		});
		toolage.minimize.click(function() {
			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'minimize']);

		});
		toolage.restore.click(function() {
			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'restore']);

		});
		toolage.close.click(function() {
			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'close']);

		});
		toolage.help.click(function() {
			me.getSandbox().postRequestByName('userguide.ShowUserGuideRequest', [{
				placement : 'bottom',
				el : toolage.help,
				extension : extension.getName(),
				toggle : true
			}]);

		});
		return flyout;

	},
	/**
	 * @method removeExtension TBD
	 */

	"removeExtension" : function(extension) {

		/*
		 * to-do:
		 * - remove tile
		 * - remove flyout
		 */

		var me = this;
		var extensions = me.extensions;
		var extensionsByName = this.extensionsByName;
		var extensionInfo = extensionsByName[extension.getName()];
		var extensionState = extensionInfo.state;

		var flyoutInfo = extensionInfo['plugins']['Oskari.userinterface.Flyout'];
		if(flyoutInfo) {
			var flyoutPlugin = flyoutInfo.plugin;
			var flyout = flyoutInfo.el;

			var ops = this.flyoutOps;
			var closeOp = ops['close'];

			closeOp.apply(this, [flyout, flyoutPlugin, extensionInfo]);

			flyout.remove();
		}

		var tileInfo = extensionInfo['plugins']['Oskari.userinterface.Tile'];
		if(tileInfo) {
			var tilePlugin = tileInfo.plugin;
			var tile = tileInfo.el;

			tile.remove();
		}

		extensionsByName[extension.getName()] = null;

		var after = [];

		for(var n = 0, len = extensions.length; n < len; n++) {
			if(extensions[n] === extensionInfo)
				continue;

			after.push(extensions[n]);

		}

		me.extensions = after;

		extension.stopExtension();

	},
	/**
	 * @method updateExtension updates extension state
	 *
	 */
	"updateExtension" : function(extension, request) {
		var me = this;
		var extensions = me.extensions;
		if(!extension) {
			// if extension not spesified, do it for all
			for(var i = 0; i < extensions.length; ++i) {
				this.updateExtension(extensions[i].extension, request);
			}
			return;
		}
		var extensionsByName = this.extensionsByName;
		var extensionInfo = extensionsByName[extension.getName()];
		var extensionState = extensionInfo.state;

		var state = request.getState();

		if(state == 'toggle') {

			if(extensionState == 'close') {
				state = 'attach';
			} else if(extensionState == 'attach') {
				state = 'close';
			} else if(extensionState == 'detach') {
				state = 'minimize';
			} else if(extensionState == 'minimize') {
				state = 'restore';
			} else if(extensionState == 'restore') {
				state = 'minimize';
			}

		}

		var flyoutInfo = extensionInfo['plugins']['Oskari.userinterface.Flyout'];

		/* opening  flyouts 'attached' closes previously attachily opened  flyout(s) */
		if(state == 'attach' && flyoutInfo) {
			var ops = me.flyoutOps;
			var closeOp = ops['close'];
			for(var n = 0, len = extensions.length; n < len; n++) {
				var otherExtensionInfo = extensions[n];
				if(otherExtensionInfo === extensionInfo)
					continue;

				if(otherExtensionInfo.state != 'attach')
					continue;

				var otherState = 'close';

				var plgnfo = otherExtensionInfo['plugins'];
				var otherFlyoutInfo = plgnfo['Oskari.userinterface.Flyout'];
				if(otherFlyoutInfo) {
					var otherFlyoutPlugin = otherFlyoutInfo.plugin;
					var otherFlyout = otherFlyoutInfo.el;

					otherExtensionInfo.state = otherState;
					closeOp.apply(this, [otherFlyout, otherFlyoutPlugin, otherExtensionInfo]);

					me.notifyExtensionViewStateChange(otherExtensionInfo);
				} else {
					continue;
				}

				var otherTileInfo = plgnfo['Oskari.userinterface.Tile'];
				if(otherTileInfo) {
					var otherTilePlugin = otherTileInfo.plugin;
					var otherTile = otherTileInfo.el;

					me.applyTransition(otherTile, otherState, me.tileTransitions);

				}
			}
		}

		/* let's transition flyout if one exists */
		if(flyoutInfo) {
			var flyoutPlugin = flyoutInfo.plugin;
			var flyout = flyoutInfo.el;

			/**
			 * do the op for this extension
			 */
			var ops = me.flyoutOps;
			var op = ops[state];
			op.apply(this, [flyout, flyoutPlugin, extensionInfo, extensions]);

		}

		/* let's transition menu tile if one exists */
		var tileInfo = extensionInfo['plugins']['Oskari.userinterface.Tile'];
		if(tileInfo) {
			var tilePlugin = tileInfo.plugin;
			var tile = tileInfo.el;

			me.applyTransition(tile, state, me.tileTransitions);

		}

		extensionInfo.state = state;

		me.notifyExtensionViewStateChange(extensionInfo);
	},
	/**
	 * @method notifyExtensionViewStateChange
	 */
	"notifyExtensionViewStateChange" : function(extensionInfo) {

		var evt = extensionInfo.extensionUpdatedEvent;
		evt.setViewState(extensionInfo.state);
		evt.setViewInfo(extensionInfo.viewState);

		this.sandbox.notifyAll(evt, true);
	},
	/*
	 * @static @property validStates
	 */
	"validStates" : {
		"attach" : {
			"attach" : true,
			"detach" : false,
			"close" : false,
			"minimize" : false,
			"restore" : false,
			"drawer" : false,
			"sidebar" : false
		},
		"detach" : {
			"attach" : false,
			"detach" : true,
			"close" : false,
			"minimize" : false,
			"restore" : false,
			"drawer" : false,
			"sidebar" : false
		},
		"minimize" : {
			"attach" : true,
			"detach" : true,
			"close" : false,
			"minimize" : true,
			"restore" : false,
			"drawer" : false,
			"sidebar" : false
		},
		"restore" : {
			"attach" : false,
			"detach" : true,
			"close" : false,
			"minimize" : false,
			"restore" : true,
			"drawer" : false,
			"sidebar" : false
		},
		"close" : {
			"attach" : false,
			"detach" : false,
			"close" : true,
			"minimize" : false,
			"restore" : false,
			"drawer" : false,
			"sidebar" : false
		},
		"drawer" : {
			"attach" : false,
			"detach" : false,
			"close" : false,
			"minimize" : false,
			"restore" : false,
			"drawer" : true,
			"sidebar" : false
		},
		"sidebar" : {
			"attach" : false,
			"detach" : false,
			"close" : false,
			"minimize" : false,
			"restore" : false,
			"drawer" : false,
			"sidebar" : true
		}
	},

	/**
	 * @static @property flyout default positioning
	 */
	"defaults" : {
		"detach" : {
			"left" : "212px",
			"top" : "50px"
		},
		"attach" : {
			"left" : "192px",
			"top" : "30px"
		}
	},

	/**
	 * @static
	 * @property tileTransitions
	 * CSS transitions for menu tiles
	 */
	"tileTransitions" : {
		"attach" : {
			"oskari-tile-attached" : true,
			"oskari-tile-detached" : false,
			"oskari-tile-closed" : false
		},
		"detach" : {
			"oskari-tile-attached" : false,
			"oskari-tile-detached" : true,
			"oskari-tile-minimized" : false,
			"oskari-tile-closed" : false
		},
		"minimize" : {
			"oskari-tile-minimized" : true,
			"oskari-tile-closed" : false,
			"oskari-tile-detached" : false
		},
		"restore" : {
			"oskari-tile-minimized" : false,
			"oskari-tile-detached" : true
		},
		"close" : {
			"oskari-tile-closed" : true,
			"oskari-tile-attached" : false,
			"oskari-tile-detached" : false
		}

	},

	/**
	 * @static @property flyoutTransitions
	 * CSS transitions for flyouts
	 */
	"flyoutTransitions" : {
		"attach" : {
			"oskari-attached" : true,
			"oskari-detached" : false,
			"oskari-closed" : false
		},
		"detach" : {
			"oskari-attached" : false,
			"oskari-detached" : true,
			"oskari-closed" : false
		},
		"minimize" : {
			"oskari-minimized" : true,
			"oskari-closed" : false,
			"oskari-detached" : false
		},
		"restore" : {
			"oskari-minimized" : false,
			"oskari-closed" : false,
			"oskari-detached" : true,
			"oskari-attached" : false
		},
		"close" : {
			"oskari-closed" : true,
			"oskari-minimized" : false,
			"oskari-detached" : false,
			"oskari-attached" : false
		}

	},

	/**
	 * @method applyTransition
	 * adds and removes CSS classes from element
	 *
	 */
	"applyTransition" : function(obj, state, transitions) {
		var transitions = transitions[state];
		if(!transitions)
			return;
		for(var t in transitions) {

			if(transitions[t]) {
				obj.addClass(t);
			} else {
				obj.removeClass(t);
			}
		}
	},
	/**
	 * @method getFlyoutViewState
	 *
	 */
	"getFlyoutViewState" : function(flyout, state) {
		var viewState = {
			"left" : flyout.css("left"),
			"top" : flyout.css("top"),
			"width" : flyout.width(),
			"height" : flyout.height(),
			"z-index" : flyout.css("z-index"),
			"viewState" : state
		};
		return viewState;
	},
	/**
	 * @static
	 * @property flyoutOps a set of (jQuery) operations to be
	 *           performed on flyout to
	 *           show/hide/minimize/restore/attach/detach
	 */
	"flyoutOps" : {
		/** @method detach */
		"detach" : function(flyout, flyoutPlugin, extensionInfo, extensions) {
			var me = this;

			if((!extensionInfo.viewState.left || !extensionInfo.viewState.top) || (extensionInfo.viewState.left == me.defaults.attach.left && extensionInfo.viewState.top == me.defaults.attach.top )) {
				extensionInfo.viewState.left = me.defaults.detach.left;
				extensionInfo.viewState.top = me.defaults.detach.top;
			}
			var toState = {
				"left" : extensionInfo.viewState.left,
				"top" : extensionInfo.viewState.top
			};

			/*
			 * to top
			 */
			me.shuffleZIndices(flyout);

			/*
			 * with style
			 */
			me.applyTransition(flyout, "detach", me.flyoutTransitions);

			var viewState = me.getFlyoutViewState(flyout, "detach");
			extensionInfo.viewState = viewState;

		},
		/** @method attach */
		"attach" : function(flyout, flyoutPlugin, extensionInfo, extensions) {
			var me = this;

			/*
			 * to top
			 */
			me.shuffleZIndices(flyout);

			/*
			 * with style
			 */

			me.applyTransition(flyout, "attach", me.flyoutTransitions);

			var viewState = me.getFlyoutViewState(flyout, "attach");
			extensionInfo.viewState = viewState;

		},
		/** @method minimize */
		"minimize" : function(flyout, flyoutPlugin, extensionInfo) {
			var me = this;

			var viewState = me.getFlyoutViewState(flyout, "minimize");

			me.applyTransition(flyout, "minimize", me.flyoutTransitions);

			extensionInfo.viewState = viewState;
		},
		/** @method restore */
		"restore" : function(flyout, flyoutPlugin, extensionInfo) {
			var me = this;
			me.applyTransition(flyout, "restore", me.flyoutTransitions);
			var viewState = extensionInfo.viewState;

		},
		/** @method close */
		"close" : function(flyout, flyoutPlugin, extensionInfo) {
			var me = this;

			extensionInfo.viewState = {
				viewState : "close"
			};
			me.applyTransition(flyout, "close", me.flyoutTransitions);

		}
	},

	/**
	 * @method setState
	 *
	 * restores state from state snapshot
	 *
	 * @param {Object} state bundle state as JSON
	 */
	setState : function(state) {
		var me = this;

		var divmanazerState = state;

		if(!divmanazerState)
			return;

		for(var e in me.extensionsByName) {
			var extensionInfo = me.extensionsByName[e];

			var restoredState = divmanazerState.extensionStatesByName[e];
			if(!restoredState)
				continue;
			extensionInfo.state = restoredState.state;
			extensionInfo.viewState = restoredState.viewState || {};

		}

		/* let's not Bundles may not have been loaded */
		/* me.restoreExtensionViewStates(); */

	},
	/**
	 * @method getState
	 *
	 * builds a state snapshot
	 *
	 * @return {Object} bundle state as JSON
	 */
	getState : function() {
		var me = this;
		me.refreshExtensionViewStates();

		var divmanazerState = {
			extensionStatesByName : {}
		};

		for(var e in me.extensionsByName) {
			var extensionInfo = me.extensionsByName[e];
			divmanazerState.extensionStatesByName[e] = {
				state : extensionInfo.state,
				viewState : extensionInfo.viewState
			};
		}

		return divmanazerState;

	},
	/**
	 * @method applyState
	 *
	 * called after all bundles go will restore view states
	 *
	 */
	applyState : function() {
		var me = this;
		me.restoreExtensionViewStates();
	},
	/**
	 * @method refreshExtensionStates
	 * moves state to cache
	 */
	refreshExtensionViewStates : function() {
		var me = this;
		for(var e in me.extensionsByName) {
			var extensionInfo = me.extensionsByName[e];

			var flyoutInfo = extensionInfo['plugins']['Oskari.userinterface.Flyout'];
			if(flyoutInfo) {
				var flyoutPlugin = flyoutInfo.plugin;
				var flyout = flyoutInfo.el;

				var viewState = me.getFlyoutViewState(flyout, extensionInfo.state);

				extensionInfo.viewState = viewState;
			}
		}
	},
	/**
	 * @method restoreExtensionViewStates
	 */
	restoreExtensionViewStates : function() {
		var me = this;
		var ops = me.flyoutOps;

		var extensions = me.extensions;

		for(var e in me.extensionsByName) {
			var extensionInfo = me.extensionsByName[e];
			var extension = extensionInfo.extension;

			var flyoutInfo = extensionInfo['plugins']['Oskari.userinterface.Flyout'];
			if(flyoutInfo) {
				var flyoutPlugin = flyoutInfo.plugin;
				var flyout = flyoutInfo.el;

				var viewState = extensionInfo.viewState;
				flyout.removeAttr("style"); flyout.css("left", viewState.left), flyout.css("top", viewState.top);
				flyout.width(viewState.width);
				flyout.height(viewState.height);
				flyout.css("z-index", viewState['z-index']);

				var op = ops[extensionInfo.state];
				/*me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, viewState]);*/
				op.apply(me, [flyout, flyoutPlugin, extensionInfo, extensions]);

			}
			var tileInfo = extensionInfo['plugins']['Oskari.userinterface.Tile'];
			if(tileInfo) {
				var tilePlugin = tileInfo.plugin;
				var tile = tileInfo.el;

				me.applyTransition(tile, extensionInfo.state, me.tileTransitions);

			}

		}
	},
	/**
	 *
	 * @method shuffleZIndexes
	 *
	 * called after dragStop (or updateExtension) to restore some reasonable z-indexes
	 * as well as bump the requested flyout on top of others
	 *
	 */
	shuffleZIndices : function(toTop) {
		var me = this;

		var extensions = me.extensions;

		var zarray = [];
		var zprops = {};
		var zextns = {};
		var zflyout = {};
		var min = 1100;

		for(var e in me.extensionsByName) {
			var extensionInfo = me.extensionsByName[e];
			var extension = extensionInfo.extension;

			var flyoutInfo = extensionInfo['plugins']['Oskari.userinterface.Flyout'];
			if(flyoutInfo) {
				var flyoutPlugin = flyoutInfo.plugin;
				var flyout = flyoutInfo.el;
				var zIndex = flyout.css("z-index");

				zarray.push(zIndex);
				var idx = '' + zIndex;
				zprops[idx] = zIndex;
				zflyout[idx] = flyout;
				zextns[idx] = extensionInfo;
			}
		}

		zarray.sort();

		for(var n = 0; n < zarray.length; n++) {
			var idx = zarray[n];
			zprops[idx] = min + n;
			/*if(zextns[idx].state != 'detach')
			 continue;*/

			zflyout[idx].css("z-index", zprops[zarray[n]]);
		}

		/*
		 * finally bump the requested flyout to top
		 */
		toTop.css("z-index", min + zarray.length + 2);

	},
	ieFixClasses : [{
		min : 400,
		max : 599,
		cls : "oskari-flyoutcontentcontainer_IE_400_599"
	}, {
		min : 600,
		max : 799,
		cls : "oskari-flyoutcontentcontainer_IE_600_799"
	}, {
		min : 800,
		max : 999,
		cls : "oskari-flyoutcontentcontainer_IE_800_999"
	}, {
		min : 1000,
		max : 1199,
		cls : "oskari-flyoutcontentcontainer_IE_1000_1199"
	}, {
		min : 1200,
		max : 1399,
		cls : "oskari-flyoutcontentcontainer_IE_1200_1399"
	}, {
		min : 1400,
		max : 9999,
		cls : "oskari-flyoutcontentcontainer_IE_1400"
	}]

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Stateful']
});
