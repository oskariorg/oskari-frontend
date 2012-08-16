/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.framework.bundle
 *        .coordinatedisplay.CoordinateDisplayBundleInstance
 *
 */
Oskari.clazz.define("Oskari.framework.bundle" + 
                    ".coordinatedisplay.CoordinateDisplayBundleInstance",
                    function() {

    this.sandbox = null;
    this.started = false;
    this.plugins = {};

    /**
     * @property injected yuilibrary property (by bundle)
     */
    this.yuilibrary = null;

    /**
     * @property mediator
     *
     * BundleInstance
     */
    this.mediator = null;

}, {
    
    /**
     * @method pd
     * 
     * Shorcut for sandbox.printDebug
     */
    /*
    pd : function() {
        console.log(arguments);
        var me = this;
        var sb = me.sandbox;
        if (!(sb && sb.printDebug)) {
            sb = Oskari.$('sandbox');
        }
        sb.printDebug("[coordinatedisplay.instance] "  + arguments);
    },
    */    

    /**
     * @static
     *
     * @property __name
     */
    __name : 'coordinatedisplay',

    /**
     * @method getName
     *
     * Extension.js
     */
    getName : function() {
        var me = this;
        //me.pd("getName() == '" + me.__name + "'");
        return me.__name;
    },
    /**
     * @static
     *
     * @property __title
     */
    __title : 'Coordinate Display',
    
    /**
     * @method getTitle
     *
     * Extension.js
     */
    getTitle : function() {
        var me = this;
        return me.__title;
    },

    /**
     * @static
     *
     * @property __description
     */
    __description : 'Coordinate Display',
    
    /**
     * @method getDescription
     *
     * Extension.js
     */
    getDescription : function() {
        var me = this;
        return me.__description;
    },

    /**
     * @method setSandbox
     *
     * Extension.js
     */
    setSandbox : function(sbx) {
        var me = this;
        //me.pd("setSandbox()");
        me.sandbox = sbx;
    },
    
    /**
     * @method getSandbox
     */
    getSandbox : function() {
        var me = this;
        //me.pd("getSandbox()");
        return me.sandbox;
    },
        
    /**
     * @method update
     *
     * BundleInstance
     */
    update : function() {
        var me = this;
        //me.pd("update()");
    },
        
    /**
     * @method startExtension
     *
     * Extension.js
     */
    startExtension : function() {
        var me = this;
        //me.pd("startExtension()");
        // TODO: how to handle multiple instances of the same class
        var simpleDiv = 
            Oskari.clazz.create('Oskari.framework.bundle' + 
                                '.coordinatedisplay' + 
                                '.CoordinateDisplayDiv', me);
        // TODO: get parent from bundle config?
        simpleDiv.setParent(jQuery("#mapdiv"));                                    
        me.plugins['Oskari.userinterface.SimpleDiv'] = simpleDiv;
    },
    
    /**
     * @method stopExtension
     *
     * Extension.js
     */
    stopExtension : function() {
        var me = this;
        //me.pd("stopExtension()");
        for (var pluginType in me.plugins) {
            if (pluginType) {
                me.plugins[pluginType] = null;
            }
        }
    },
        
    /**
     * @method getPlugins
     * 
     * Extension.js
     */
    getPlugins : function() {
        var me = this;
        return me.plugins;
    },
    
    
    /**
     * @method start
     *
     * BundleInstance
     */
    start : function() {
        var me = this;
        if (me.started) { 
            return; 
        }
        me.started = true;
        // Should this not come as a param?
        var sandbox = Oskari.$('sandbox');
        sandbox.register(me);
        me.setSandbox(sandbox);

        for (var p in me.eventHandlers) {
            if (p) {
                sandbox.registerForEventByName(me, p);
            }
        }

        var request = 
            sandbox.getRequestBuilder('userinterface.AddExtensionRequest')
                                     (this);
        sandbox.request(this, request);
        me.mediator.bundle.require(function() {
            me.draw();
        });
    },
    
    /**
     * @method init
     * 
     * Module initialization
     */
    init : function() {
        var me = this;
        //me.pd("init()");
        return null;
    },
    
    /**
     * @method onEvent
     * 
     * Event dispatch
     */
    onEvent : function(event) {
        var me = this;
        var handler = me.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [event]);
    },
    
    /**
     * @static
     * @property eventHandlers
     */
    eventHandlers : {
        /**
         * @method MouseHoverEvent
         * 
         * See PorttiMouse.notifyHover
         */
        MouseHoverEvent : function(e) {
            var me = this;            
            me.plugins['Oskari.userinterface.SimpleDiv']
                .refresh({ 'latlon' : 
                            { 
				'lat' : Math.floor(e.getLat()),
				'lon' : Math.floor(e.getLon())
                            }
                       });
        }
    },

    /**
     * @method stop
     *
     * implements bundle instance stop method
     */
    stop : function() {
        var me = this;
        var sandbox = me.sandbox();
        for (var p in me.eventHandlers) {
            if (p) {
                sandbox.unregisterFromEventByName(me, p);
            }
        }
        var request = 
            sandbox
                .getRequestBuilder('userinterface.RemoveExtensionRequest')
                                  (me);
        sandbox.request(me, request);
        me.sandbox.unregister(me);
        me.started = false;
	
    },

    /**
     * @method draw
     *
     * (re)creates selected layers to a hardcoded DOM div
     * #featureinfo This
     */
    draw : function() {
        var me = this;
        for (var pluginType in me.plugins) {
            if (pluginType) {
                me.plugins[pluginType].draw();
            }
        }
    }
    
}, {
    protocol : [ 'Oskari.bundle.BundleInstance', 
                 'Oskari.mapframework.module.Module', 
                 'Oskari.userinterface.Extension' ]
});
/**
 * @class Oskari.framework.bundle
 *        .coordinatedisplay.CoordinateDisplayDiv
 */
Oskari.clazz
    .define('Oskari.framework.bundle'  +
            '.coordinatedisplay.CoordinateDisplayDiv',
            function() {
		this.__parent = null;
		this.__elements = {};
		this.__templates = {};
		this.__templates['latlondiv'] = 
		    jQuery('<div class="cbDiv">' +
        		   ' <div class="cbSpansWrapper">' + 
        		   ' <div class="cbRow">' + 
			   '  <span class="cbLabel" axis="lat">N: </span>' +
			   '  <span class="cbValue" axis="lat"></span>' +
			   ' </div>' +
			   ' <div class="cbRow">' + 
			   '  <span class="cbLabel" axis="lon">E: </span>' +
			   '  <span class="cbValue" axis="lon"></span>' +
			   ' </div>' +
			   ' </div>' + 
			   ' <div class="cbSelection">'+
			   '  <div style="float:left">ETRS89</div>' + 
			   '  <div class="cbArrowDown"></div>' + 
			   '  <br clear="both">'+
			   ' </div>' +
			   '</div>');
	    }, {
		/**
		 * @property __name
		 */
		__name : 'Oskari.framework.bundle.coordinatedisplay.CoordinateDisplayDiv',
		
		/**
		 * @method getName
		 * 
		 * SimpleDiv
		 */
		getName : function() {
		    var me = this;
		    return me.__name;
		},
		
		/**
		 * @method setParent
		 * 
		 * SimpleDiv
		 */
		setParent : function(newParent) {
		    var me = this;
		    if (me.__parent) {
			me.__parent.detach(me.__elements['etrs89']);
		    }
		    if (newParent) {
			me.__parent = newParent;
			if (me.__elements['etrs89']) {
			    me.__parent.append(me.__elements['etrs89']);    
			}
		    }
		},
		
		/**
		 * @method getParent
		 * 
		 * SimpleDiv
		 */
		getParent : function() {
		    var me = this;
		    return me.__parent;
		},
		
		/**
		 * @method getElement
		 * 
		 * SimpleDiv
		 */
		getElement : function() {
		    var me = this;
		    return me.__elements['etrs89'];
		},
		
		/**
		 * @method startPlugin
		 * 
		 * SimpleDiv
		 */
		startPlugin : function() { 
		    var me = this;
		},
		
		/**
		 * @method stopPlugin
		 * 
		 * SimpleDiv
		 */
		stopPlugin : function() {
		    var me = this;
		    me.setParent(null);
		    me.__elements['etrs89'] = null;
		},
		
		/**
		 * @method draw
		 * 
		 * SimpleDiv
		 */
		draw : function() {
		    var me = this;
		    if (!me.__parent) {
			me.__parent = document;
		    }
		    if (!me.__elements['etrs89']) {
			me.__elements['etrs89'] = 
			    me.__templates['latlondiv'].clone();
		    }
		    jQuery(me.__parent).append(me.__elements['etrs89']);
		    jQuery(me.__elements['etrs89']).show();
		},
		
		/**
		 * @method refresh
		 * 
		 * SimpleDiv
		 */
		refresh : function(data) {
		    if (!(data.type == latlon)) {
			throw ("CoordinateDisplay.refresh() can not find " + 
			       "'latlon' in args!");
		    }
		    var me = this;
		    var latlon = data['latlon'];
		    var spanLat = 
			me.__elements['etrs89'].find('.cbValue[axis="lat"]');
		    var spanLon = 
			me.__elements['etrs89'].find('.cbValue[axis="lon"]');
		    if (spanLat && spanLon) {
			spanLat.text(latlon.lat);
			spanLon.text(latlon.lon);
		    } else {
			throw ("CoordinateDisplay.refresh() could not find spans!");
		    }           
		}
	    }, {
		protocol : [ 'Oskari.userinterface.SimpleDiv' ]
	    });
