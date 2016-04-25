/**
 * @class Oskari.mapframework.bundle.mappublished.MyLocationPlugin
 *
 * Tries to locate the user by using HTML5 GeoLocation services or tries a
 * fallback to http://dev.maxmind.com/geoip/javascript GeoIP if GeoLocation is
 * not available.
 * Centers the map on the users location if location is determined successfully.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin';
        me._defaultLocation = 'top right';
        me._index = 30;
        me._name = 'MyLocationPlugin';

        me._mobileDefs = {
            buttons:  {
                'mobile-my-location': {
                    iconCls: 'mylocation-rounded-dark',
                    tooltip: '',
                    sticky: true,
                    show: true,
                    callback: function (el) {
                        me._setupLocation();
                    }
                }
            },
            buttonGroup: 'mobile-zoombar'
        };
    }, {
        /**
         * @private @method _createControlElement
         * Creates the DOM element that will be placed on the map
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            var el = jQuery(
                    '<div class="mapplugin mylocationplugin icon mylocation-rounded-dark"></div>'
                ),
                me = this;

            me._loc = Oskari.getLocalization('MapModule', Oskari.getLang() || Oskari.getDefaultLanguage()).plugin.MyLocationPlugin;

            el.click(function () {
                me._setupLocation();
            });

            el.attr('title', me._loc.tooltip);

            return el;
        },

        /**
         * @private @method _setLayerToolsEditModeImpl
         *
         *
         */
        _setLayerToolsEditModeImpl: function () {
            var me = this;
            if (me.inLayerToolsEditMode()) {
                // disable icon
                me.getElement().unbind('click');
            } else {
                // enable icon
                me.getElement().click(function () {
                    me._setupLocation();
                });
            }
        },

        /**
         * @public @method refresh
         *
         *
         */
        refresh: function () {
            var me = this,
                conf = me.getConfig();

            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                if (toolStyle !== null && toolStyle !== undefined) {
                    me.changeToolStyle(toolStyle, me.getElement());
                }
            }
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         *
         */
        changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'mylocation-' + (style ? style : 'rounded-dark');

            me.changeCssClasses(styleClass, /^mylocation-/, [el]);
        },

        /**
         * @private @method _setupLocation
         * Tries to get the geolocation from browser and move the map to the
         * location
         *
         */
        _setupLocation: function () {
            var mapmodule = this.getMapModule();
            mapmodule.getUserLocation(function (lon, lat) {
                if(!lon || !lat) {
                    // error getting location
                    return;
                }
                mapmodule.centerMap({ lon: lon, lat : lat }, 6);
            });
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         */
        createPluginUI: function (mapInMobileMode) {
            var me = this,
                sandbox = me.getSandbox();
            

            //remove old element
            if (me._element) {
                me.getMapModule().removeMapControlPlugin(
                    me._element,
                    me.inLayerToolsEditMode(),
                    me._uiMode
                );
                me._element.remove();
                delete me._element;
            }

            var toolbar = me.getMapModule().getMobileToolbar();
            var reqBuilder = sandbox.getRequestBuilder(
                'Toolbar.RemoveToolButtonRequest'
            );
            if (reqBuilder) {
                for (var tool in me._mobileDefs.buttons) {
                    var buttonConf = me._mobileDefs.buttons[tool];
                    buttonConf.toolbarid = toolbar;
                    sandbox.request(me, reqBuilder(tool, me._mobileDefs.buttonGroup, toolbar));
                }
            }
            
            if (mapInMobileMode) {                
                var toolbar = me.getMapModule().getMobileToolbar();
                var reqBuilder = sandbox.getRequestBuilder(
                    'Toolbar.AddToolButtonRequest'
                );

                if (reqBuilder) {
                    for (var tool in me._mobileDefs.buttons) {
                        var buttonConf = me._mobileDefs.buttons[tool];
                        buttonConf.toolbarid = toolbar;
                        sandbox.request(me, reqBuilder(tool, me._mobileDefs.buttonGroup, buttonConf));
                    }
                }
                
                me._uiMode = 'mobile';
            } else {                                
                me._element = me._createControlElement();
                me.getMapModule().setMapControlPlugin(
                    me._element,
                    me.getLocation(),
                    me.getIndex()
                );
                me._uiMode = 'desktop';
            }
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
