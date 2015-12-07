/**
 * @class Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin
 *
 * Extends jquery by defining outerHtml() method for it. (TODO: check if we really want to do it here).
 * Provides a customized popup functionality for Openlayers map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._popups = {};
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'OpenLayersPopupPlugin',

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
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method init
     * implements Module protocol init method - declares popup templates
     */
    init : function() {
        var me = this;

        // templates
        this._arrow = jQuery('<div class="popupHeaderArrow"></div>');
        this._header = jQuery('<div></div>');
        this._headerWrapper = jQuery('<div class="popupHeader"></div>');
        this._headerCloseButton = jQuery('<div class="olPopupCloseBox icon-close-white" style="position: absolute; top: 12px;"></div>');
        this._contentDiv = jQuery('<div class="popupContent"></div>');
        this._contentWrapper = jQuery('<div class="contentWrapper"></div>');
        this._actionLink = jQuery('<span class="infoboxActionLinks"><a href="#"></a></span>');
        this._actionButton = jQuery('<span class="infoboxActionLinks"><input type="button" /></span>');
        this._contentSeparator = jQuery('<div class="infoboxLine">separator</div>');
    },

    /**
     * @method popup
     * @param {String} id
     * 		id for popup so we can use additional requests to control it
     * @param {String} title
     * 		popup title
     * @param {Object[]} contentData
     * 		JSON presentation for the popup data
     * @param {OpenLayers.LonLat} lonlat
     * 		coordinates where to show the popup
     *
     * Displays a popup with given title and data in the given coordinates.
     *
     * contentData format example:
     * [{
     * 	html: "",
     *  useButtons: true,
     *  primaryButton: "<button label>",
     *  actions : {
     * 	   "Tallenna" : callbackFunction,
     * 	   "Sulje" : callbackFunction
     * }
     * }]
     */
    popup : function(id, title, contentData, lonlat) {
        var me = this;

        var arrow = this._arrow.clone();
        var header = this._header.clone();
        var headerWrapper = this._headerWrapper.clone();
        var contentDiv = this._contentDiv.clone();
        var closeButton = this._headerCloseButton.clone();

        header.append(title);
        headerWrapper.append(header);
        headerWrapper.append(closeButton);

        for (var i = 0; i < contentData.length; i++) {
            if (i != 0) {
                contentDiv.append(this._contentSeparator.clone());
            }
            var html = contentData[i].html;
            var contentWrapper = this._contentWrapper.clone();
            contentWrapper.append(html);
            var action = contentData[i].actions;
            var useButtons = (contentData[i].useButtons == true);
            var primaryButton = contentData[i].primaryButton;
            for (var key in action) {
                var attrName = key;
                var attrValue = action[key];
                var actionLink = null;
                if (useButtons) {
                    actionLink = this._actionButton.clone();
                    var btn = actionLink.find('input');
                    btn.attr('contentdata', i);
                    btn.attr('value', attrName);
                    if (attrName == primaryButton) {
                        btn.addClass('primary');
                    }
                } else {
                    actionLink = this._actionLink.clone();
                    var link = actionLink.find('a');
                    link.attr('contentdata', i);
                    link.append(attrName);
                }
                contentWrapper.append(actionLink);
            }
            contentDiv.append(contentWrapper);
        }

        var openlayersMap = this.getMapModule().getMap();

        var popup = this._el;
        popup.show();
        popup.empty();
        popup.append(headerWrapper);
        popup.append(closeButton);
        popup.append(contentDiv);

        closeButton.click(function() {
            me.close();
        });

        this._ctl.setContent(popup.get()[0]);
        this._ctl.setLatLng(this.mapModule.crs2map( lonlat.lon, lonlat.lat));
        //this._ctl.setPosition([lonlat.lon, lonlat.lat]);
        this.mapModule._map.openPopup(this._ctl);

    },
    setAdaptable : function(isAdaptable) {
        this.adaptable = isAdaptable;
    },

    /**
     * @method close
     * @param {String} id
     * 		id for popup that we want to close (optional - if not given, closes all popups)
     */
    close : function(id) {
        this.mapModule._map.closePopup(this._ctl);
    },
    /**
     * @method getPopups
     * Returns references to popups that are currently open
     * @return {Object}
     */
    getPopups : function() {
        return this._popups;
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

        var el = jQuery('<div />');
        this._el = el;
        var overlay = L.popup();
        
        this._ctl = overlay;
        //this.mapModule.getMap().addOverlay(this._ctl);

    },
    /**
     * @method stopPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Unregisters self from sandbox
     */
    stopPlugin : function(sandbox) {

        this.mapModule.getMap().removeOverlay(this._ctl);
        this._el.empty();

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
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
