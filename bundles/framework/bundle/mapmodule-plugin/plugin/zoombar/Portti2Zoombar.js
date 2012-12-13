/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar
 * 
 * Zoombar implementation with jQuery UI and refined graphics. Location can be configured,
 * but defaults on top of the map with placement details on the css-file.
 * 
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPorttiZoombar
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
    this._slider = null;
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
     * Returns reference to map module
     * @return {Oskari.mapframework.ui.module.common.MapModule} 
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method hasUI
     * This plugin has an UI so always returns true
     * @return {Boolean} true
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
        this.__templates['zoombar'] = jQuery('<div class="oskariui mapplugin pzbDiv" title="Koko Suomi">' + 
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
        this._draw();
        this._setZoombarValue(this._map.getZoom());
    },
    /**
     * @method stopPlugin
     * mapmodule.Plugin protocol method.
     * Unregisters self from sandbox and removes plugins UI.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    stopPlugin : function(sandbox) {

        if(this.__elements['zoombarSlider']) {
            this.__elements['zoombarSlider'].remove();
            this._slider.remove();
            delete this.__elements['zoombarSlider'];
        }
        sandbox.unregister(this);

        //this._map = null;
        this._sandbox = null;
    },
    /**
     * @method _draw
     * @private
     * 
     * Draws the zoombar on the screen.
     */
    _draw : function() {
        var me = this;
        if(!me.__parent) {
            me.__parent = this._map.div;
        }
        if(!me.__elements['zoombarSlider']) {
            me.__elements['zoombarSlider'] = me.__templates['zoombar'].clone();
        }

        var inputId = 'pzb-input-' + this.getName();
        var sliderId = 'pzb-slider-' + this.getName();
        var sliderEl = me.__elements['zoombarSlider'].find('div.slider');

        me.__elements['zoombarSlider'].find('input').attr('id', inputId);
        sliderEl.attr('id', sliderId);
        
        jQuery(me.__parent).append(me.__elements['zoombarSlider']);

       	var sliderEl = me.__elements['zoombarSlider'].find('div.slider');
       	sliderEl.css("height",(this._map.getNumZoomLevels()*11)+"px")
       	me._slider = sliderEl.slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: this._map.getNumZoomLevels()-1,
            value: this._map.getZoom(),
            slide: function( event, ui ) {
                me.getMapModule().zoomTo( ui.value );
            }
        });
        
       
        var plus = me.__elements['zoombarSlider'].find('.pzbDiv-plus');
        plus.bind('click', function(event) {
            if(me._slider.slider('value') < 12) {
                me.getMapModule().zoomTo(me._slider.slider('value') + 1);
            }
        });
        var minus = me.__elements['zoombarSlider'].find('.pzbDiv-minus');
        minus.bind('click', function(event) {
            if(me._slider.slider('value') > 0) {
                me.getMapModule().zoomTo(me._slider.slider('value') - 1);
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
    /**
     * @method _setZoombarValue
     * Sets the zoombar slider value
     * @private
     * @param {Number} value new Zoombar value
     */
    _setZoombarValue : function(value) {
        var me = this;
        if(me._slider) {
            // disable events in "onChange"
            this._suppressEvents = true;
            /*me._slider.setValue(value);*/
           me._slider.slider('value',value);
            this._suppressEvents = false;
        }
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            if(this._sandbox) {
                var me = this;
                me._setZoombarValue(event.getZoom());
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