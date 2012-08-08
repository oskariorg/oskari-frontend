/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
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

}, {

	getName : function() {
		return "userinterface.DivManazer";
	},
	init : function(sandbox) {

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
		this.tileContainer = jQuery("#menubar");

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

		//		sandbox.registerAsStateful(this.mediator.bundleId, this);

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
		"Oskari.userinterface.Tile" : '<div class="oskari-tile oskari-tile-closed">' + '<div class="oskari-tile-title"></div>' + '<div class="oskari-tile-status"></div>' + '<div class="oskari-tile-close">' + '</div>' + '</div>',

		/* flyout */
		"Oskari.userinterface.Flyout" : '<div class="oskari-flyout oskari-closed">' + 
		'<div class="oskari-flyoutheading"></div>' + '<div class="oskari-flyouttoolbar">' +
		 '<div class="oskari-flyout-title">' + '<p></p>' + '</div>' + '<div class="oskari-flyouttools">' + 
		 '<div class="oskari-flyouttool-help">' + '</div>'+
		 '<div class="oskari-flyouttool-attach">' + '</div>' + '<div class="oskari-flyouttool-detach">' + '</div>' + '<div class="oskari-flyouttool-minimize">' + '</div>' + '<div class="oskari-flyouttool-restore">' + '</div>' + '<div class="oskari-flyouttool-close">' + '</div>' + '</div>' + '</div>' + '<div class="oskari-flyoutcontentcontainer">' + '<div class="oskari-flyoutcontent"></div>' + '</div>' + '</div>'

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
		this.compiledTemplates['Oskari.userinterface.Tile'] = jQuery(this.templates['Oskari.userinterface.Tile']);

		var flyout = jQuery(this.templates['Oskari.userinterface.Flyout']);

		flyout.css('left', '-3195px');
		flyout.css('top', '-3100px');

		this.compiledTemplates['Oskari.userinterface.Flyout'] = flyout;
	},
	/**
	 * @method addExtension
	 *
	 * adds extension to Oskari DIV Manager in response to a
	 * AddExtensionRequest
	 */
	"addExtension" : function(extension) {

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

			extensionInfo.draggableHandle = /*flyout.children('.oskari-flyoutheading');*/
			flyout.children(
			'.oskari-flyoutheading').get()[0];

			var fcc = flyout.children('.oskari-flyoutcontentcontainer');
			var fcccc = fcc.children('.oskari-flyoutcontent');

			var el = fcc.children('.oskari-flyoutcontent');

			/*RightJS.$(flyout.get()[0]).makeResizable({});*/
			/*RightJS.$(fcc.get()[0]).makeResizable({direction:'bottom'});*/

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
		
		if( tilePlugin ) {
			extensionInfo['plugins']['Oskari.userinterface.Tile'] = {
				plugin : tilePlugin,
				el : tile
			};
		}
		if( flyoutPlugin ) {
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

		title.click(function() {
			//plugin.setExtensionState();

			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'toggle']);
		});
		status.click(function() {
			//plugin.setExtensionState();

			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'toggle']);
		});
		var close = tile.children('.oskari-tile-close');
		close.hide();
		/*
		 close.click(function() {

		 me.getSandbox()
		 .postRequestByName('userinterface' +
		 '.RemoveExtensionRequest',
		 [extension ]);
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
		flyout.find('.oskari-flyout-title p').append(extension.getTitle());

		var flyouttools = flyout.children('.oskari-flyouttoolbar').children('.oskari-flyouttools');
		var toolage = {
			attach : flyouttools.children('.oskari-flyouttool-attach'),
			detach : flyouttools.children('.oskari-flyouttool-detach'),
			minimize : flyouttools.children('.oskari-flyouttool-minimize'),
			restore : flyouttools.children('.oskari-flyouttool-restore'),
			close : flyouttools.children('.oskari-flyouttool-close'),
			help: flyouttools.children('.oskari-flyouttool-help')
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
			me.getSandbox().postRequestByName('userguide.ShowUserGuideRequest', [{placement:'bottom',el: toolage.help,extension: extension.getName(), toggle: true}]);

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
			/* ... */
			/**
			 * side effects
			 */

		}
		
		var flyoutInfo = extensionInfo['plugins']['Oskari.userinterface.Flyout'];
		
		if( state == 'attach' && flyoutInfo ) {
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
	/**
	 * @static @property flyout default positioning
	 */
	"defaults" : {
		"detach" : {
			"left" : "245px",
			"top" : "100px"
		},
		"attach" : {
			"left" : "214px",
			"top" : "100px"
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
			flyout.animate(toState, 200, 'cubicIn', function() {
				var viewState = me.getFlyoutViewState(flyout, "detach");
				extensionInfo.viewState = viewState;
			});

			me.applyTransition(flyout, "detach", me.flyoutTransitions);

			var flyoutTarget = flyout
			.get()[0];
			var handle = extensionInfo.draggableHandle;
			extensionInfo.draggableTarget = flyoutTarget;
			extensionInfo.draggable = new Draggable(flyoutTarget, {
				handle : handle,
				scroll : false,
				onStop : function(draggable, event) {

					me.shuffleZIndices(flyout);

					var viewState = me.getFlyoutViewState(flyout, "detach");

					extensionInfo.viewState = viewState;
					me.notifyExtensionViewStateChange(extensionInfo);
				}
			});

		},
		/** @method attach */
		"attach" : function(flyout, flyoutPlugin, extensionInfo, extensions) {
			var me = this;

		

			flyout.removeAttr("style");
			me.applyTransition(flyout, "attach", me.flyoutTransitions);

			flyout.css('left', me.defaults.attach.left);
			flyout.css('top', me.defaults.attach.top);

			var viewState = me.getFlyoutViewState(flyout, "attach");
			extensionInfo.viewState = viewState;

			if(extensionInfo.draggable) {
				extensionInfo.draggable.destroy();
				extensionInfo.draggable = null;
			}

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

			if(extensionInfo.draggable) {
				extensionInfo.draggable.destroy();
				extensionInfo.draggable = null;
			}
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
				flyout.removeAttr("style");
				flyout.css("left", viewState.left), flyout.css("top", viewState.top);
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
	 * called after dragStop to restore some reasonable z-indexes
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
			if(zextns[idx].state != 'detach')
				continue;

			zflyout[idx].css("z-index", zprops[zarray[n]]);
		}

		toTop.css("z-index", min + zarray.length + 2);

	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Stateful']
});
/**
 * @class Oskari.userinterface.request.AddExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.AddExtensionRequest', function(extension) {
	this._extension = extension;
}, {
	__name : "userinterface.AddExtensionRequest",
	getName : function() {
		return this.__name;
	},
	getExtension : function() {
		return this._extension;
	}
}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});
/**
 *
 * @class Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler', function(ui) {
	this.ui = ui;

}, {
	handleRequest : function(core, request) {

		var extension = request.getExtension();

		this.ui.addExtension(extension);
	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.userinterface.request.RemoveExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.RemoveExtensionRequest', function(extension) {
	this._extension = extension;
}, {
	__name : "userinterface.RemoveExtensionRequest",
	getName : function() {
		return this.__name;
	},
	getExtension : function() {
		return this._extension;
	}
}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});
/**
 * @class Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler', function(ui) {
	this.ui = ui;
}, {
	handleRequest : function(core, request) {
		var extension = request.getExtension();

		this.ui.removeExtension(extension);

	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.userinterface.request.UpdateExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.UpdateExtensionRequest', function(extension, state) {
	this._extension = extension;
	this._state = state;
}, {
	__name : "userinterface.UpdateExtensionRequest",
	getName : function() {
		return this.__name;
	},
	getExtension : function() {
		return this._extension;
	},
	getState : function() {
		return this._state;
	}
}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});
/*
 * @class  Oskari.userinterface.bundle.ui.request.UpdateExtensionRequestHandler
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.request.UpdateExtensionRequestHandler', function(ui) {
	this.ui = ui;
}, {
	handleRequest : function(core, request) {
		var extension = request.getExtension();

		this.ui.updateExtension(extension, request);

	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.userinterface.request.ModalDialogRequest
 */
Oskari.clazz
    .define('Oskari.userinterface.request.ModalDialogRequest', 
	    function(title, message, buttons, onshow) {
		this._title = title ? title : "Untitled";
		this._message = message ? message : "Lorem ipsum";
		this._buttons = buttons ? buttons : {};
		this._parent = parent ? parent : jQuery('#mapdiv');
		this._onshow = onshow ? onshow : null;
	    }, {
		__name : "userinterface.ModalDialogRequest",
		getName : function() {
		    return this.__name;
		},
		getTitle : function() {
		    return this._title;
		},
		getMessage : function() {
		    return this._message;
		},
		getButtons : function() {
		    return this._buttons;
		},
		getGeom : function() {
		    return this._geom;
		},
		getParent : function() {
		    return this._parent;
		},
		getOnShow : function() {
		    return this._onshow;
		}
	    }, {
		'protocol' : ['Oskari.mapframework.request.Request']
	    });
/*
 * @class  Oskari.userinterface.bundle.ui.request.ModalDialogRequestHandler
 */
Oskari
    .clazz
    .define('Oskari.userinterface.bundle.ui.request' + 
	    '.ModalDialogRequestHandler', 
	    function(ui) {
		this._ui = ui;
		this._tpl = {};
		this._tpl['modal'] = 
		    jQuery('<div id="modaldialog" class="modaldialog">' + 
			   '  <div class="modaltitle"></div>' +
			   '  <div class="modalmessage"></div>' + 
			   '  <div class="modalbuttons"></div> ' + 
			   '</div>');
		this._tpl['button'] =
		    jQuery('<div class="modalbutton">' +
			   '<input type="button" /></input>' +
			   '</div>');
		this._buttons = {};
		this._args = {
		    closeClass : 'modalclose',
		    overlayId : 'modaloverlay',
		    overlayCss : {
			'background-color' : 'lightgrey',
			'cursor' : 'wait'
		    },
		    containerId : 'modalcontainer',
		    containerCss : { 
			'background-color' : 'white'
		    },
		    onClose : function() {
			this.close();
		    },
		    zIndex : 80130
		};
	    }, {
		handleRequest : function(core, request) {
		    var tpl = this._tpl['modal'].clone();
		    tpl.find('.modaltitle').append(request.getTitle());
		    tpl.find('.modalmessage').append(request.getMessage());
		    var btns = request.getButtons();
		    var buttondiv = tpl.find('.modalbuttons');
		    for (var bidx in btns) {
			if (!btns[bidx].name) {
			    continue;
			}
			var btn = btns[bidx];
			var bcont = this._tpl['button'].clone();
			var button = bcont.find('input');
			button.attr('name', btn.name);
			button.attr('text', btn.text);
			button.attr('value', btn.text);			
			button.bind('click',  btn.onclick);
			if (btn.close !== false) {
			    button.addClass(this._args.closeClass);
			}
			buttondiv.append(bcont);
		    }
		    if (request.onshow) {
			this._args.onShow = onshow;
		    }
		    $.modal = tpl.modal(this._args);
		}
	    }, {
		protocol : ['Oskari.mapframework.core.RequestHandler']
		       }
	    );

/**
 * @class Oskari.userinterface.event.ExtensionUpdatedEvent
 * 
 * Sent after Extension view state has changed
 * 
 */
Oskari.clazz.define('Oskari.userinterface.event.ExtensionUpdatedEvent', function(extension,viewstate,viewinfo) {
	this._creator = null;
	this._extension = extension;
	this.viewstate = viewstate;
	this.viewinfo = viewinfo;
}, {
	__name : "userinterface.ExtensionUpdatedEvent",
	getName : function() {
		return this.__name;
	},
	
	/**
	 * @method returns Extension 
	 */
	getExtension : function() {
		return this._extension;
	},
	
	/**
	 * @method getViewState
	 * returns 'close','attach','detach','minimize','restore','minimize'
	 */
	getViewState : function() {
		return this.viewstate;
	},
	setViewState : function(viewstate) {
		this.viewstate = viewstate;
	},
	
	/**
	 * @method getViewInfo
	 * returns a property with view dimension info (currently WHEN in restored or detached state)
	 */
	getViewInfo : function() {
		return this.viewinfo;
	},
	setViewInfo : function(viewinfo) {
		this.viewinfo = viewinfo;
	}
}, {
	'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance *//**
 * @class Oskari.userinterface.component.Accordion
 */
Oskari.clazz.define('Oskari.userinterface.component.Accordion',

/**
 * @method create called automatically on construction
 * @static
 *
 */
function() {
    this.template = jQuery('<div class="accordion"></div>');
    this.panels = [];
    this.ui = this.template.clone();
}, {
    addPanel : function(panel) {
        this.panels.push(panel);
        panel.insertTo(this.ui);
    },
    removePanel : function(pPanel) {
        var panel = null;
        for(var i = 0; i < this.panels.length; i++) {
            if(this.panels[i] === pPanel) {
                panel = this.panels[i];
                this.panels.splice(i, 1);
                break;
            }
        }
        if(panel) {
            panel.destroy();
            // notify components of layer removal
            return true;
        }
        return false;
    },
    insertTo : function(container) {
        container.append(this.ui);
    }
});
/**
 * @class Oskari.userinterface.component.AccordionPanel
 * 
 * TODO: close/open methods?
 */
Oskari.clazz.define('Oskari.userinterface.component.AccordionPanel',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
    this.template = jQuery('<div class="accordion_panel">' + 
               '<div class="header">' +
               '</div>' + 
               '<div class="content">' +
               '</div>' +
        '</div>');
    this.title = null;
    this.content = null;
    this.html=this.template.clone();
    
    var header = this.html.find('div.header'); 
    header.click(function() {
        var panelDiv = jQuery(this).parent();
        var isOpen = panelDiv.hasClass('open');
        // panel is open -> close it
        if(isOpen) {
            panelDiv.removeClass('open');
            panelDiv.find('div.content').hide();
        }
        // panel is closed -> open it
        else {
            panelDiv.addClass('open');
            panelDiv.find('div.content').show();
        }
    });
    this.html.find('div.content').hide();
}, {
    setTitle : function(pTitle) {
        this.title = pTitle;
        var header = this.html.find('div.header'); 
        header.append(this.title);
    },
    setContent : function(pContent) {
        this.content = pContent;
        var content = this.html.find('div.content'); 
        content.append(this.content);
    },
    destroy : function() {
        this.html.remove();
    },
    getContainer : function() {
        return this.html.find('div.content');
    },

    insertTo : function(container) {
        container.append(this.html);
    }
});
/**
 * @class Oskari.userinterface.component.Badge
 */
Oskari.clazz.define('Oskari.userinterface.component.Badge',

/**
 * @method create called automatically on construction
 * @static
 *
 */
function() {
	this.compiledTemplates = {};
	this.compileTemplates();
	this.ui = null;
	this.container = null;
}, {
	templates : {
		"default" : '<span class="oskari-badge"></span>',
		"success" : '<span class="oskari-badge oskari-badge-success"></span>',
		"warning" : '<span class="oskari-badge oskari-badge-warning"></span>',
		"important" : '<span class="oskari-badge oskari-badge-important"></span>',
		"info" : '<span class="oskari-badge oskari-badge-info"></span>',
		"success" : '<span class="oskari-badge oskari-badge-inverse"></span>'
	},
	compileTemplates : function() {
		for(var p in this.templates ) {
			this.compiledTemplates[p] = jQuery(this.templates[p]);
		}
	},
	insertTo : function(container) {
		this.container = container;
	},
	setContent : function(pContent, status) {
		if( this.ui ) {
			this.ui.remove();
			this.ui = null;
		}
			
		var txtspan = this.compiledTemplates[status || 'default'].clone();
		txtspan.append(pContent);
		this.container.append(txtspan);
		this.ui = txtspan;
	},
	hide : function() {
		if( this.ui)  {
			this.ui.remove();
			this.ui = null;
		}
	}
});
/**
 * @class Oskari.userinterface.component.Bubble
 * 
 * Closable erikseen
 * 
 */
Oskari.clazz.define('Oskari.userinterface.component.Alert',

/**
 * @method create called automatically on construction
 * @static
 *
 */
function() {
	this.compiledTemplates = {};
	this.compileTemplates();
	this.ui = null;
	this.container = null;	
}, {
	templates : {
		"default" : '<div class="oskari-alert"><div class="oskari-alert-icon-close"></div></div>',
		"success" : '<div class="oskari-alert oskari-alert-success"><div class="oskari-alert-icon-close"></div></div>',
		"error" : '<div class="oskari-alert oskari-alert-error"><div class="oskari-alert-icon-close"></div></div>',
		"info" : '<div class="oskari-alert oskari-alert-info"><div class="oskari-alert-icon-close"></div></div>'
	},
	compileTemplates : function() {
		for(var p in this.templates ) {
			this.compiledTemplates[p] = jQuery(this.templates[p]);
		}
	},
	insertTo : function(container) {
		this.container = container;
	},
	setContent : function(pContent, status) {
		if( this.ui ) {
			this.ui.remove();
			this.ui = null;
		}
			
		var txtdiv = this.compiledTemplates[status || 'default'].clone();
		txtdiv.append(pContent);
		this.container.prepend(txtdiv);
		this.ui = txtdiv;
		var me = this;
		txtdiv.children('.oskari-alert-icon-close').click(function(){
			me.hide();
		});
	},
	hide : function() {
		if( this.ui)  {
			this.ui.remove();
			this.ui = null;
		}
		
	}
});
/* ===========================================================
 * bootstrap-tooltip.js v2.0.3 (with popover)
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */! function($) {"use strict";// jshint ;_;

	/* TOOLTIP PUBLIC CLASS DEFINITION
	 * =============================== */

	var Tooltip = function(element, options) {
		this.init('oskariTooltip', element, options)
	}

	Tooltip.prototype = {

		constructor : Tooltip,
		init : function(type, element, options) {
			var eventIn, eventOut

			this.type = type
			this.$element = $(element)
			this.options = this.getOptions(options)
			this.enabled = true

			if(this.options.trigger != 'manual') {
				eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
				eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
				this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
				this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
			}

			this.options.selector ? (this._options = $.extend({}, this.options, {
				trigger : 'manual',
				selector : ''
			})) : this.fixTitle()
		},
		getOptions : function(options) {
			options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

			if(options.delay && typeof options.delay == 'number') {
				options.delay = {
					show : options.delay,
					hide : options.delay
				}
			}

			return options
		},
		enter : function(e) {
			var self = $(e.currentTarget)[this.type](this._options).data(this.type)

			if(!self.options.delay || !self.options.delay.show)
				return self.show()
			clearTimeout(this.timeout)
			self.hoverState = 'in'
			this.timeout = setTimeout(function() {
				if(self.hoverState == 'in')
					self.show()
			}, self.options.delay.show)
		},
		leave : function(e) {
			var self = $(e.currentTarget)[this.type](this._options).data(this.type)

			if(!self.options.delay || !self.options.delay.hide)
				return self.hide()
			clearTimeout(this.timeout)
			self.hoverState = 'out'
			this.timeout = setTimeout(function() {
				if(self.hoverState == 'out')
					self.hide()
			}, self.options.delay.hide)
		},
		show : function() {
			var $tip, inside, pos, actualWidth, actualHeight, placement, tp

			if(this.hasContent() && this.enabled) {
				$tip = this.tip()
				this.setContent()

				if(this.options.animation) {
					$tip.addClass('fade')
				}
				placement = /*typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement*/
					this.options.placement.apply(this.options.scope);
				inside = /in/.test(placement)

				$tip.remove().css({
					top : 0,
					left : 0,
					display : 'block'
				}).appendTo( inside ? this.$element : document.body)
				pos = this.getPosition(inside)
				actualWidth = $tip[0].offsetWidth
				actualHeight = $tip[0].offsetHeight

				switch (inside ? placement.split(' ')[1] : placement) {
					case 'bottom':
						tp = {
							top : pos.top + pos.height,
							left : pos.left + pos.width / 2 - actualWidth / 2
						}
						break
					case 'top':
						tp = {
							top : pos.top - actualHeight,
							left : pos.left + pos.width / 2 - actualWidth / 2
						}
						break
					case 'left':
						tp = {
							top : pos.top + pos.height / 2 - actualHeight / 2,
							left : pos.left - actualWidth
						}
						break
					case 'right':
						tp = {
							top : pos.top + pos.height / 2 - actualHeight / 2,
							left : pos.left + pos.width
						}
						break
				}

				$tip.css(tp).addClass(placement).addClass('in')
			
			}
		},
		isHTML : function(text) {
			// html string detection logic adapted from jQuery
			return typeof text != 'string' || (text.charAt(0) === "<" && text.charAt(text.length - 1) === ">" && text.length >= 3
			) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
		},
		setContent : function() {
			var $tip = this.tip(), title = this.getTitle()

			$tip.find('.oskari-tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
			$tip.removeClass('fade in top bottom left right')
		},
		hide : function() {
			var that = this, $tip = this.tip()

			$tip.removeClass('in')

			function removeWithAnimation() {
				var timeout = setTimeout(function() {
					$tip.off($.support.transition.end).remove()
				}, 500)

				$tip.one($.support.transition.end, function() {
					clearTimeout(timeout)
					$tip.remove()
				})
			}$.support.transition && this.$tip.hasClass('fade') ? removeWithAnimation() : $tip.remove()
		},
		fixTitle : function() {
			var $e = this.$element
			if($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
				$e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
			}
		},
		hasContent : function() {
			return this.getTitle()
		},
		getPosition : function(inside) {
			return $.extend({}, ( inside ? {
				top : 0,
				left : 0
			} : this.$element.offset()), {
				width : this.$element[0].offsetWidth,
				height : this.$element[0].offsetHeight
			})
		},
		getTitle : function() {		
			return this.options.title.apply(this.options.scope);
		},
		tip : function() {
			return this.$tip = this.$tip || $(this.options.template)
		},
		validate : function() {
			if(!this.$element[0].parentNode) {
				this.hide()
				this.$element = null
				this.options = null
			}
		},
		enable : function() {
			this.enabled = true
		},
		disable : function() {
			this.enabled = false
		},
		toggleEnabled : function() {
			this.enabled = !this.enabled
		},
		toggle : function() {
			this[this.tip().hasClass('in') ? 'hide' : 'show']()
		},
		attach : function($el) {
			this.$element = $el;
		}
	}

	/* TOOLTIP PLUGIN DEFINITION
	 * ========================= */

	$.fn.oskariTooltip = function(option) {
		return this.each(function() {
			var $this = $(this), data = $this.data('oskariTooltip'), options = typeof option == 'object' && option
			if(!data)
				$this.data('oskariTooltip', ( data = new Tooltip(this, options)))
			if( typeof option == 'string')
				data[option]()
		})
	}

	$.fn.oskariTooltip.Constructor = Tooltip

	$.fn.oskariTooltip.defaults = {
		animation : true,
		placement : 'top',
		selector : false,
		template : '<div class="oskari-tooltip"><div class="oskari-tooltip-arrow"></div><div class="oskari-tooltip-inner"></div></div>',
		trigger : 'hover',
		title : '',
		delay : 0
	}

	/* POPOVER PUBLIC CLASS DEFINITION
	 * =============================== */

	var Popover = function(element, options) {
		this.init('oskariPopover', element, options)
	}
	/* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
	 ========================================== */

	Popover.prototype = $.extend({}, $.fn.oskariTooltip.Constructor.prototype, {

		constructor : Popover,
		setContent : function() {
			var $tip = this.tip(), title = this.getTitle(), content = this.getContent()

			$tip.find('.oskari-popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
			$tip.find('.oskari-popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

			$tip.removeClass('fade top bottom left right in')
		},
		hasContent : function() {
			return this.getTitle() || this.getContent()
		},
		getContent : function() {
			return this.options.content.apply(this.options.scope);
		},
		tip : function() {
			if(!this.$tip) {
				this.$tip = $(this.options.template)
			}
			return this.$tip
		}
	})

	/* POPOVER PLUGIN DEFINITION
	 * ======================= */

	$.fn.oskariPopover = function(option) {
		return this.each(function() {
			var $this = $(this), data = $this.data('oskariPopover'), options = typeof option == 'object' && option
			if(!data)
				$this.data('oskariPopover', ( data = new Popover(this, options)))
			if( typeof option == 'string')
				data[option]()
		})
	}

	$.fn.oskariPopover.Constructor = Popover

	$.fn.oskariPopover.defaults = $.extend({}, $.fn.oskariTooltip.defaults, {
		placement : 'right',
		content : '',
		template : '<div class="oskari-popover"><div class="oskari-arrow"></div><div class="oskari-popover-inner"><h3 class="oskari-popover-title"></h3><div class="oskari-popover-content"><p></p></div></div></div>'
	})

	/**
	 * @class Oskari.userinterface.component.Popover
	 */
	Oskari.clazz.define('Oskari.userinterface.component.Popover',

	/**
	 * @method create called automatically on construction
	 * @static
	 *
	 */
	function(title, content) {

		this.title = title;
		this.content = content;
		this.$container = null;
		this.data = null;
		this.shown = false;
		this.placement = 'bottom';

	}, {
		templates : {
			"container" : '<div class="oskari-popover-container"/>'
		},
		hide : function() {
			if( !this.shown)
				return;
			this.shown = false;
			if( !this.data)
				return;
			this.data.hide();
		},
		show : function() {
			if( this.shown)
				return;
			if( !this.data)
				return;
			this.data.show();
			this.shown = true;
		},
		attachTo : function(element) {
			var me = this;
			this.$container = $(element);
			if(!this.data) {
				this.data = new Popover(element, {
					'scope' : me,
					'title' : me.getTitle,
					'content' : me.getContent,
					'trigger' : 'manual',
					'placement' : me.getPlacement,
				});

			} else {
				this.data.attach(this.$container);
			}
			this.$container.data('oskariPopover', this.data);
		},
		getTitle : function() {
			return this.title;
		},
		getContent : function() {
			return this.content;
		},
		setContent : function(content, title) {
			this.hide();
			this.content = content;
			if(title)
				this.title = title;
			this.show();
		},
		setTitle : function(title, content) {
			this.hide();
			this.title = title;
			if(content)
				this.content = content;

			this.show();
		},
		setPlacement: function(p){
			this.placement = p;
		},
		getPlacement: function(){
			return this.placement;
		}
	});

}(window.jQuery);
