/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:02:04 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance
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

	this.templates = {};

}, {

	/**
	 * @method getSandbox
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method start
	 *
	 * implements BundleInstance start methdod creates tile and
	 * flyout templates creates and registers request handlers
	 *
	 */
	"start" : function() {

		/**
		 * templtates
		 */
		this.createTileTemplate();
		this.createFlyoutTemplate();

		/**
		 * Requests and handlers
		 */
		var sandbox = Oskari.$("sandbox");
		this.sandbox = sandbox;

		this.requestHandlers['add'] = Oskari.clazz.create('Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler', this);
		this.requestHandlers['remove'] = Oskari.clazz.create('Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler', this);
		this.requestHandlers['update'] = Oskari.clazz.create('Oskari.userinterface.bundle.ui.request.UpdateExtensionRequestHandler', this);

		sandbox.addRequestHandler('userinterface.AddExtensionRequest', this.requestHandlers['add']);
		sandbox.addRequestHandler('userinterface.RemoveExtensionRequest', this.requestHandlers['remove']);
		sandbox.addRequestHandler('userinterface.UpdateExtensionRequest', this.requestHandlers['update']);

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
	 * implements bundle instance stop method removes request
	 * handlers
	 */
	"stop" : function() {
		sandbox.removeRequestHandler('userinterface.UpdateExtensionRequest', this.requestHandlers['update']);
		sandbox.removeRequestHandler('userinterface.RemoveExtensionRequest', this.requestHandlers['remove']);
		sandbox.removeRequestHandler('userinterface.AddExtensionRequest', this.requestHandlers['add']);

	},
	/**
	 * @method createTileTemplate
	 *
	 * creates jQuery template to be cloned to any menubar Tiles
	 */
	"createTileTemplate" : function() {
		/**
		 * Templates
		 */
		this.templates['Oskari.userinterface.Tile'] = $('<div style="display:none;" class="oskari-tile">' + '<div class="oskari-tile-title"></div>' + '<div class="oskari-tile-status"></div>' + '<div class="oskari-tile-close"></div>' + '</div>');

	},
	/**
	 * @method createFlyoutTemplate creates jQuery template to
	 *         be cloned for any Flyouts
	 */
	"createFlyoutTemplate" : function() {
		var flyout = $('<div class="oskari-flyout attached">' + '<div class="oskari-flyouttoolbar">' + '<div class="oskari-flyout-title"><p></p></div>' + '<div class="oskari-flyouttool-attach"></div>' + '<div class="oskari-flyouttool-detach"></div>' + '<div class="oskari-flyouttool-minimize"></div>' + '<div class="oskari-flyouttool-restore"></div>' + '<div class="oskari-flyouttool-close"></div>' + '</div>' + '<div class="oskari-flyoutcontentcontainer">' + '<div class="oskari-flyoutcontent"></div>' + '</div>' + '</div>');

		flyout.css('left', '-3195px');
		flyout.css('top', '-3100px');

		this.templates['Oskari.userinterface.Flyout'] = flyout;
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
			draggableHandle : null

		};

		var count = extensions.length;
		var name = extension.getName();

		var flyoutPlugin = plugins['Oskari.userinterface.Flyout'];
		var flyout = null;
		if(flyoutPlugin != null) {
			flyout = this.createFlyout(extension, flyoutPlugin, count, extensionInfo);

			extensionInfo.draggableHandle = flyout.children(
			'.oskari-flyouttoolbar').children(
			'.oskari-flyout-title').get()[0];

			var fcc = flyout.children('.oskari-flyoutcontentcontainer');


			var el = fcc.children('.oskari-flyoutcontent');

			flyoutPlugin.setEl(el.get());

			$(document.body).append(flyout);
			
			/*if(!Browser.IE && !Browser.OLD) { */
				/*RightJS.$(flyout.get()[0]).makeResizable();*/
			/*}*/


			flyoutPlugin.startPlugin();

		}

		var tilePlugin = plugins['Oskari.userinterface.Tile'];
		var tile = null;
		if(tilePlugin != null) {
			tile = this.createTile(extension, tilePlugin, count, extensionInfo);

			tilePlugin.startPlugin();

			tile.fadeIn(200);

		}

		/* TEMP */
		if(tile != null) {
			$("#menubar").append(tile);
		}

		/*
		 * store these for further usage
		 */
		extensionInfo['plugins'] = {
			'Oskari.userinterface.Tile' : {
				plugin : tilePlugin,
				el : tile
			},
			'Oskari.userinterface.Flyout' : {
				plugin : flyoutPlugin,
				el : flyout
			}
		};

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

		var container = $('#menubar');

		var tile = this.templates['Oskari.userinterface.Tile'].clone(true, true);

		var title = tile.children('.oskari-tile-title');
		title.append(plugin.getTitle());
		var status = tile.children('.oskari-tile-status');

		var close = tile.children('.oskari-tile-close');

		title.click(function() {
			plugin.setState();

			console.log("TOGGLE -----------------------------------------------------------------------------");
			me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'toggle']);
		});

		close.click(function() {

			me.getSandbox().postRequestByName('userinterface.RemoveExtensionRequest', [extension]);
		});

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

		var flyout = this.templates['Oskari.userinterface.Flyout'].clone(true, true);
		var flyouttools = flyout.children('.oskari-flyouttoolbar');
		var toolage = {
			attach : flyouttools.children('.oskari-flyouttool-attach'),
			detach : flyouttools.children('.oskari-flyouttool-detach'),
			minimize : flyouttools.children('.oskari-flyouttool-minimize'),
			restore : flyouttools.children('.oskari-flyouttool-restore'),
			close : flyouttools.children('.oskari-flyouttool-close')
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
		var flyoutPlugin = flyoutInfo.plugin;
		var flyout = flyoutInfo.el;

		var tileInfo = extensionInfo['plugins']['Oskari.userinterface.Tile'];
		var tilePlugin = tileInfo.plugin;
		var tile = tileInfo.el;

		var ops = this.flyoutOps;
		var closeOp = ops['close'];

		closeOp.apply(this, [flyout, flyoutPlugin, extensionInfo]);

		tile.remove();
		/*css("border", "2pt dashed red");*/
		flyout.remove();
		/*css("border", "2pt dashed red");*/

		console.log("NYI", "This really does NOT close - just hiding for now");

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

		console.log("UPDATE", extension, request, extensions, extensionsByName);

		var flyoutInfo = extensionInfo['plugins']['Oskari.userinterface.Flyout'];
		var flyoutPlugin = flyoutInfo.plugin;
		var flyout = flyoutInfo.el;

		var ops = this.flyoutOps;
		var closeOp = ops['close'];

		if(state == 'toggle') {

			if(extensionState == 'close') {
				state = 'attach';
			} else if(extensionState == 'attach') {
				state = 'close';
			} else if(extensionState == 'detach') {
				state = 'close';
			} else if(extensionState == 'minimize') {
				state = 'detach';
			}
			/* ... */
			/**
			 * side effects
			 */

		}

		if(state == 'attach') {
			for(var n = 0, len = extensions.length; n < len; n++) {
				var otherExtensionInfo = extensions[n];
				if(otherExtensionInfo === extensionInfo)
					continue;

				if(otherExtensionInfo.state != 'attach')
					continue;

				var otherState = 'close';

				console.log("CLOSING", otherExtensionInfo.extension.getName(), otherExtensionInfo);

				var otherFlyoutInfo = otherExtensionInfo['plugins']['Oskari.userinterface.Flyout'];
				var otherFlyoutPlugin = otherFlyoutInfo.plugin;
				var otherFlyout = otherFlyoutInfo.el;

				otherFlyoutPlugin.setState(otherState);
				otherExtensionInfo.state = otherState;
				closeOp.apply(this, [otherFlyout, otherFlyoutPlugin, otherExtensionInfo]);
				me.updateFlyoutState(otherState, otherFlyout, otherFlyoutPlugin, otherExtensionInfo);
			}
		}

		/**
		 * do the op for this extension
		 */
		flyoutPlugin.setState(state);
		extensionInfo.state = state;

		var op = ops[state];
		op.apply(this, [flyout, flyoutPlugin, extensionInfo]);

		me.updateFlyoutState(state, flyout, flyoutPlugin, extensionInfo);

	},
	/**
	 * @method updateFlyoutState
	 */
	"updateFlyoutState" : function(what, flyout, flyoutPlugin, extensionInfo) {

		console.log('updateFlyoutState', what, flyout, flyoutPlugin, extensionInfo);
	},
	/**
	 * @static
	 * @property flyoutOps a set of (jQuery) operations to be
	 *           performed on flyout to
	 *           show/hide/minimize/restore/attach/detach
	 */
	"flyoutOps" : {
		/** @method detach */
		"detach" : function(flyout, flyoutPlugin, extensionInfo) {
			var me = this;

			/* flyout.css('left', '224px'); */
			flyout.animate({
				left : '224px'
			}, 200, 'cubicIn');
			flyout.removeClass('oskari-attached');
			flyout.addClass('oskari-detached');
			flyout.removeClass('oskari-closed');

			var handle = extensionInfo.draggableHandle;

			extensionInfo.draggable = new Draggable(flyout
			.get()[0], {
				handle : handle,
				scroll : false,
				onStop : function(draggable, event) {
					me.updateFlyoutState('dragStop', flyout, flyoutPlugin, extensionInfo);
				}
			});

		},
		/** @method attach */
		"attach" : function(flyout, flyoutPlugin, extensionInfo) {

			/*
			 * flyout.animate( { left : '195px' }, 200,
			 * 'cubicIn');
			 */
			flyout.css('left', '195px');
			flyout.css('top', '100px');
			flyout.addClass('oskari-attached');
			flyout.removeClass('oskari-detached');
			flyout.removeClass('oskari-closed');

			if(extensionInfo.draggable) {
				extensionInfo.draggable.destroy();
				extensionInfo.draggable = null;
			}

		},
		/** @method minimize */
		"minimize" : function(flyout) {
			flyout.css('left', '224px');
			flyout.css('top', '100px');
			flyout.addClass('oskari-minimized');
			flyout.removeClass('oskari-closed');
			flyout.removeClass('oskari-detached');

		},
		/** @method restore */
		"restore" : function(flyout) {
			flyout.removeClass('oskari-minimized');
			flyout.removeClass('oskari-closed');
			flyout.css('top', '100px');
			flyout.css('left', '224px');
			flyout.addClass('oskari-detached');
		},
		/** @method close */
		"close" : function(flyout) {
			flyout.removeClass('oskari-attached');
			flyout.removeClass('oskari-detached');
			flyout.addClass('oskari-closed');
		}
	}

}, {
	"protocol" : ["Oskari.bundle.BundleInstance"]
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
