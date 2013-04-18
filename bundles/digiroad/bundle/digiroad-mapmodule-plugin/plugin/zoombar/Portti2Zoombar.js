/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.__templates = {};
    this.__elements = {};
    this.__parent = null;
    this._slider
    this._zoombar_messages = {};
    this._suppressEvents = false;
    this._conf = config;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'Portti2Zoombar',

    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if(mapModule) {
            this._map = mapModule.getMap();
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method init
     * implements Module protocol init method - declares popup templates
     */
    init : function() {
        var me = this;
        // templates
        this.__templates['zoombar'] = jQuery('<div class="mapplugin pzbDiv" title="Koko Suomi">' + 
            '<div class="pzbDiv-plus"></div>' + 
            '<input type=\'hidden\' />' + 
            '<div class="slider"></div>' + 
            '<div class="pzbDiv-minus"></div>' + 
        '</div>');
    },
    /**
     * @method register
     * mapmodule.Plugin protocol method - does nothing atm
     */
    register : function() {

    },
    /**
     * @method unregister
     * mapmodule.Plugin protocol method - does nothing atm
     */
    unregister : function() {
    },
    /**
     * @method startPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Sets sandbox and registers self to sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);

        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
        this.draw();
        this.setZoombarValue(this._map.getZoom());
    },
    /**
     * @method draw
     *
     * SimpleDiv
     */
    draw : function() {
        var me = this;
        if(!me.__parent) {
            me.__parent = this._map.div;
        }
        if(!me.__elements['zoombarSlider']) {
            me.__elements['zoombarSlider'] = me.__templates['zoombar'].clone();
        }

        var inputId = 'pzb-input-' + this.getName();
        var sliderId = 'pzb-slider-' + this.getName();
        me.__elements['zoombarSlider'].find('input').attr('id', inputId);
        me.__elements['zoombarSlider'].find('div.slider').attr('id', sliderId);
        jQuery(me.__parent).append(me.__elements['zoombarSlider']);
        me._slider = new Slider({
            min : 0,
            max : 12,
            value : 0,
            direction : 'y'
        }).insertTo(sliderId).assignTo(inputId);

        me._slider.level.hide();

        var tooltips = me.getMapModule().getLocalization('zoombar_tooltip');

        me._slider.on('change', function(event) {
            // update tooltip
            var tooltip = tooltips['zoomLvl-' + event.value];
            if(tooltip) {
                me.__elements['zoombarSlider'].attr('title', tooltip);
            }
            // zoom map if not suppressed
            if(!this._suppressEvents) {
                me.getMapModule().zoomTo(event.value);
            }
        });
        var plus = me.__elements['zoombarSlider'].find('.pzbDiv-plus');
        plus.bind('click', function(event) {
            if(me._slider.getValue() < 12) {
                me.getMapModule().zoomTo(me._slider.getValue() + 1);
            }
        });
        var minus = me.__elements['zoombarSlider'].find('.pzbDiv-minus');
        minus.bind('click', function(event) {
            if(me._slider.getValue() > 0) {
                me.getMapModule().zoomTo(me._slider.getValue() - 1);
            }
        });
        // override default location if configured
        if(this._conf && this._conf.location) {
            // clear possible opposite position with 'auto' and set the one in config
            if(this._conf.location.top) {
                me.__elements['zoombarSlider'].css('bottom', 'auto');
                me.__elements['zoombarSlider'].css('top', this._conf.location.top);
            }
            if(this._conf.location.left) {
                me.__elements['zoombarSlider'].css('right', 'auto');
                me.__elements['zoombarSlider'].css('left', this._conf.location.left);
            }
            if(this._conf.location.right) {
                me.__elements['zoombarSlider'].css('left', 'auto');
                me.__elements['zoombarSlider'].css('right', this._conf.location.right);
            }
            if(this._conf.location.bottom) {
                me.__elements['zoombarSlider'].css('top', 'auto');
                me.__elements['zoombarSlider'].css('bottom', this._conf.location.bottom);
            }
        }
    },
    setZoombarValue : function(value) {
        var me = this;
        if(me._slider) {
            // disable events in "onChange"
            this._suppressEvents = true;
            me._slider.setValue(value);
            this._suppressEvents = false;
        }
    },
    /**
     * @method stopPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Unregisters self from sandbox
     */
    stopPlugin : function(sandbox) {

        if(this.__elements['zoombarSlider']) {
            this.__elements['zoombarSlider'].remove();
            this._slider.remove();
        }
        sandbox.unregister(this);

        //this._map = null;
        this._sandbox = null;
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            if(this._sandbox) {
                var me = this;
                me.setZoombarValue(event.getZoom());
            }
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method start
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Module protocol method - does nothing atm
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Module protocol method - does nothing atm
     */
    stop : function(sandbox) {
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
