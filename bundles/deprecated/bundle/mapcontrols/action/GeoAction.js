/**
 * Copyright (c) 2008-2010 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/**
 * Copyright (c) 2011 National Land Survey of Finland.
 */

/**
 * api: (define) 
 * module = Oskari 
 * class = GeoAction 
 * base_link = 
 *     `Ext.Action <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Action>`_
 */
Ext.namespace("Oskari");

/**
 * api: example Sample code to create a toolbar with an OpenLayers control into
 * it.
 * .. 
 * code-block:: javascript
 *    var action = new Oskari.GeoAction({ 
 *        text: "max extent", 
 *        control: new OpenLayers.Control.ZoomToMaxExtent(), 
 *        map: map 
 *    }); 
 *    var toolbar = new Ext.Toolbar([action]);
 */

/**
 * api: constructor 
 * .. 
 * class:: GeoAction(config)
 * 
 * Create a Oskari.GeoAction instance. A Oskari.GeoAction is created to insert
 * an OpenLayers control in a toolbar as a button or in a menu as a menu item.
 * A Oskari.GeoAction instance can be used like a regular Ext.Action, look 
 * at the Ext.Action API doc for more detail.
 */
Ext.define('Oskari.mapframework.ui.module.common.mapmodule.GeoAction', {
    extend : Ext.Action,
    control : null,

    /**
     * api: config[map] ``OpenLayers.Map`` 
     * The OpenLayers map that the control should be added to. 
     * For controls that don't need to be added to a map or have 
     * already been added to one, this config property may be omitted.
     */
    map : null,

    /**
     * private: property[uScope] ``Object`` 
     * The user-provided scope, used when calling uHandler, uToggleHandler, 
     * and uCheckHandler.
     */
    uScope : null,

    /**
     * private: property[uHandler] ``Function`` 
     * References the function the user passes through the 
     * "handler" property.
     */
    uHandler : null,

    /**
     * private: property[uToggleHandler] ``Function`` 
     * References the function the user passes through 
     * the "toggleHandler" property.
     */
    uToggleHandler : null,

    /**
     * private: property[uCheckHandler] ``Function`` 
     * References the function the user passes through the "checkHandler" 
     * property.
     */
    uCheckHandler : null,

    /* private */
    constructor : function(config) {
        // store the user scope and handlers
        this.uScope = config.scope;
        this.uHandler = config.handler;
        this.uToggleHandler = config.toggleHandler;
        this.uCheckHandler = config.checkHandler;

        this.activateHandler = config.activateHandler;
        this.deactivateHandler = config.deactivateHandler;

        config.scope = this;
        config.handler = this.pHandler;
        config.toggleHandler = this.pToggleHandler;
        config.checkHandler = this.pCheckHandler;

        // set control in the instance, the Ext.Action
        // constructor won't do it for us
        this.control = config.control;
        delete config.control;

        // register "activate" and "deactivate" listeners
        // on the control
        if (this.control) {
            // If map is provided in config, add control to map.
            if (config.map) {
                config.map.addControl(this.control);
                delete config.map;
            }
            if ((config.pressed || config.checked) && this.control.map) {
                this.control.activate();
            }
            this.control.events.on({
                activate : this.onCtrlActivate,
                deactivate : this.onCtrlDeactivate,
                scope : this
            });
        }

        this.callParent(arguments);
    },

    /**
     * private: method[pHandler] 
     * :param cmp: ``Ext.Component`` 
     *   The component that triggers the shandler.
     * 
     * The private handler.
     */
    pHandler : function(cmp) {
        if (this.control && this.control.type == OpenLayers.Control.TYPE_BUTTON) {
            this.control.trigger();
        }
        if (this.uHandler) {
            this.uHandler.apply(this.uScope, arguments);
        }
    },

    /**
     * private: method[pTogleHandler] 
     * :param cmp: ``Ext.Component`` 
     *   The component that triggers the toggle handler. 
     * :param state: ``Boolean`` 
     *   The state of the toggle.
     * 
     * The private toggle handler.
     */
    pToggleHandler : function(cmp, state) {
        this.changeControlState(state);
        if (this.uToggleHandler) {
            this.uToggleHandler.apply(this.uScope, arguments);
        }
    },

    /**
     * private: method[pCheckHandler] 
     * :param cmp: ``Ext.Component`` 
     *   The component that triggers the check handler. 
     * :param state: ``Boolean`` 
     *   The state of the toggle.
     * 
     * The private check handler.
     */
    pCheckHandler : function(cmp, state) {
        this.changeControlState(state);
        if (this.uCheckHandler) {
            this.uCheckHandler.apply(this.uScope, arguments);
        }
    },

    /**
     * private: method[changeControlState] 
     * :param state: ``Boolean`` 
     *   The state of the toggle.
     * 
     * Change the control state depending on the state boolean.
     */
    changeControlState : function(state) {
        if (state) {
            if (!this._activating) {
                this._activating = true;
                if (this.control)
                    this.control.activate();
                this._activating = false;
            }
        } else {
            if (!this._deactivating) {
                this._deactivating = true;
                if (this.control)
                    this.control.deactivate();
                this._deactivating = false;
            }
        }
    },

    /**
     * private: method[onCtrlActivate]
     * 
     * Called when this action's control is activated.
     */
    onCtrlActivate : function() {
        if (this.activateHandler) 
            this.activateHandler();
        if (this.control && this.control.type == OpenLayers.Control.TYPE_BUTTON) {
            this.enable();
        } else {
            // deal with buttons
            this.safeCallEach("toggle", [ true ]);
            // deal with check items
            this.safeCallEach("setChecked", [ true ]);
        }
    },

    /**
     * private: method[onCtrlDeactivate]
     * 
     * Called when this action's control is deactivated.
     */
    onCtrlDeactivate : function() {
        if (this.deActivateHandler) 
            this.deActivateHandler();
        if (this.control && this.control.type == OpenLayers.Control.TYPE_BUTTON) {
            this.disable();
        } else {
            // deal with buttons
            this.safeCallEach("toggle", [ false ]);
            // deal with check items
            this.safeCallEach("setChecked", [ false ]);
        }
    },

    /**
     * private: method[safeCallEach]
     * 
     */
    safeCallEach : function(fnName, args) {
        var cs = this.items;
        for ( var i = 0, len = cs.length; i < len; i++) {
            if (cs[i][fnName]) {
                cs[i].rendered ? cs[i][fnName].apply(cs[i], args) : cs[i].on({
                    "render" : cs[i][fnName].createDelegate(cs[i], args),
                    single : true
                });
            }
        }
    }
});
