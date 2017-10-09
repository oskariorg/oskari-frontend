/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin
 * Provides control UI for timeseries
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} delegate
 *      Object that has all the answers
 */
function (delegate, conf) {
    var me = this;
    me._clazz = 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin';
    me._defaultLocation = 'top center';
    me._index = 90;
    me._name = 'TimeseriesControlPlugin';

    me._mobileDefs = {
        buttons:  {
            'mobile-featuredata': {
                iconCls: 'mobile-info-marker',
                tooltip: '',
                sticky: true,
                toggleChangeIcon: true,
                show: true,
                callback: function () {

                }
            }
        },
        buttonGroup: 'mobile-toolbar'
    };
}, {
    /**
     * @method _createControlElement
     * @private
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     */
    _createControlElement: function () {
        var me = this,
            sandbox = me.getSandbox(),
            el = jQuery('<div class="mapplugin timeseriescontrolplugin">' +
                'bla blaa' +
                '</div>');
        return el;
    },
    /**
     * Handle plugin UI and change it when desktop / mobile mode
     * @method  @public redrawUI
     * @param  {Boolean} mapInMobileMode is map in mobile mode
     * @param {Boolean} forced application has started and ui should be rendered with assets that are available
     */
    redrawUI: function(mapInMobileMode, forced) {
        var me = this;
        var sandbox = me.getSandbox();
        var mobileDefs = this.getMobileDefs();

        // don't do anything now if request is not available.
        // When returning false, this will be called again when the request is available
        var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        if(!forced && toolbarNotReady) {
            return true;
        }
        this.teardownUI();

        if (!toolbarNotReady && mapInMobileMode) {
            this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        } else {
            me._element = me._createControlElement();
            this.addToPluginContainer(me._element);
        }
    },

    teardownUI : function() {
        //remove old element
        this.removeFromPluginContainer(this.getElement());
    },

    /**
     * @method _refresh
     * Updates the plugins interface (hides if no featuredata layer selected)
     */
    refresh: function () {
        var me = this,
            isVisible = true;

        if(this.getElement()) {
            this.getElement().hide();
        }
        if(isVisible && this.getElement()){
          this.getElement().show();
        }
        me.setVisible(isVisible);
    },

    _createEventHandlers: function () {
        return {
            /**
             * @method AfterMapMoveEvent
             * Shows map center coordinates after map move
             */
            'AfterMapMoveEvent': function (event) {
                this.refresh();
            }
        };
    },

}, {
    'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
