/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin
 *
 * Provides indexmap functionality for map. Uses image from plugin resources as the index map.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginIndexMap
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */

    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin';
        me._defaultLocation = 'bottom right';
        me._index = 5;
        me._name = 'IndexMapPlugin';
        me._indexMap = null;
        me._indexMapUrl = '/framework/bundle/mapmodule-plugin/plugin/indexmap/images/suomi25m_tm35fin.png';
    }, {
        /**
         * @private @method _createControlElement
         * Constructs/initializes the indexmap  control for the map.
         *
         * @return {jQuery} element
         */
        _createControlElement: function () {
            /* overview map */
            var me = this,
                conf = me.getConfig(),
                el;

            if (conf.containerId) {
                el = jQuery('#' + conf.containerId);
            } else {
                el = jQuery('<div class="mapplugin indexmap"></div>');
            }

            return el;
        },

        /**
         * @private @method _createControlAdapter
         * Constructs/initializes the control adapter for the plugin
         *
         * @param {jQuery} el
         */
        _createControlAdapter: function (el) {
            /*
             * create an overview map control with non-default
             * options
             */
            var me = this,
                graphic = new OpenLayers.Layer.Image(
                    'Overview map image',
                    me.getMapModule().getImageUrl() + me._indexMapUrl,
                    new OpenLayers.Bounds(26783, 6608595, 852783, 7787250),
                    new OpenLayers.Size(120, 173)
                ),
                controlOptions = {
                    div: el[0],
                    mapOptions: {
                        maxExtent: new OpenLayers.Bounds(
                            26783,
                            6608595,
                            852783,
                            7787250
                        ),
                        units: 'm',
                        projection: me._map.getProjection(),
                        numZoomLevels: 1
                    },
                    layers: [graphic],
                    size: new OpenLayers.Size(120, 173),
                    autoPan: false,
                    controls: []
                };
            // initialize control, pass container
            me._indexMap = new OpenLayers.Control.OverviewMap(controlOptions);
            // Set indexmap stable in container
            me._indexMap.isSuitableOverview = function () {
                return true;
            };

            // Extends overviewmap to send AfterMapMove event
            OpenLayers.Util.extend(me._indexMap, {
                updateMapToRect: function () {
                    var lonLatBounds = this.getMapBoundsFromRectBounds(
                        this.rectPxBounds
                    );
                    if (this.ovmap.getProjection() !== this.map.getProjection()) {
                        lonLatBounds = lonLatBounds.transform(
                            this.ovmap.getProjectionObject(),
                            this.map.getProjectionObject()
                        );
                    }
                    this.map.panTo(lonLatBounds.getCenterLonLat());
                    me.getMapModule().notifyMoveEnd(me.getClazz());
                }
            });

            return me._indexMap;
        },

        refresh: function () {
            var me = this,
                toggleButton = me.getElement().find('.indexmapToggle');
            if (!toggleButton.length) {
                toggleButton = jQuery('<div class="indexmapToggle"></div>');
                // button has to be added separately so the element order is correct...
                me.getElement().append(toggleButton);
            }
            // add toggle functionality to button
            me._bindIcon(toggleButton);
        },

        _bindIcon: function (icon) {
            var me = this;
            icon.unbind('click');
            icon.bind('click', function (event) {
                event.preventDefault();                
                var miniMap = me.getElement().find(
                    '.olControlOverviewMapElement'
                );
                console.log("icon click", miniMap);
                miniMap.slideToggle({
                    duration: 100
                });
            });
        },

        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        _createEventHandlers: function () {
            var me = this;

            return {
                AfterMapMoveEvent: function (event) {
                    if (me._indexMap && (event.getCreator() !== me.getClazz())) {
                        me._indexMap.update();
                    }
                }
            };
        },

        _setLayerToolsEditModeImpl: function () {
            var icon = this.getElement().find('.indexmapToggle');

            if (this.inLayerToolsEditMode()) {
                // close map
                var miniMap = this.getElement().find(
                    '.olControlOverviewMapElement'
                );
                miniMap.hide();
                // disable icon
                icon.unbind('click');
            } else {
                // enable icon
                this._bindIcon(icon);
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
