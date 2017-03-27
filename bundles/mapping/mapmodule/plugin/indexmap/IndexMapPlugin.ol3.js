/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin
 *
 * Provides indexmap functionality for map. Uses image from plugin resources as the index map.
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     *
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin';
        me._defaultLocation = 'bottom right';
        me._index = 5;
        me._name = 'IndexMapPlugin';
        me._indexMap = null;
        me._indElement = null;
        // FIXME a more generic filename or get it from config...
        me._indexMapUrl = '/mapping/mapmodule/resources/images/suomi25m_tm35fin.png';
    },
    {
        /**
         * @private @method _createControlElement
         * Constructs/initializes the indexmap  control for the map.
         *
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
            // Ol indexmap target
            me._indElement = jQuery('<div class="mapplugin ol_indexmap"></div>');
            el.append(me._indElement);

            var toggleButton = jQuery('<div class="indexmapToggle"></div>');
            // button has to be added separately so the element order is correct...
            el.append(toggleButton);
            // add toggle functionality to button
            me._bindIcon(toggleButton);
            return el;
        },

        _bindIcon: function (icon) {
            var me = this;

            icon.unbind('click');
            icon.bind('click', function (event) {

                //Add index map control - remove old one
                if (!me._indexMap || me._indexMap.getCollapsed()) {
                    // get/Set only base layer to index map
                    var layer = me._getBaseLayer();
                    if (layer) {
                        if(typeof layer.createIndexMapLayer === 'function') {
                            // this is used for statslayer to create a copied layer as indexmap
                            // as using it directly results in weird behavior:
                            // - the normal map not refreshing on move after indexmap is opened
                            // - in some cases indexmap + normal map going to an infinite update-loop when zooming out
                            layer = layer.createIndexMapLayer();
                        }

                        var controlOptions = {
                            target: me._indElement[0],
                            layers: [ layer ],
                            view: new ol.View({
                                center: me.getMap().getView().getCenter(),
                                projection: me.getMap().getView().getProjection(),
                                zoom: me.getMap().getView().getZoom()
                            })
                        };
                        // initialize control, pass container
                        if(me._indexMap) {
                            me.getMap().removeControl(me._indexMap);
                        }
                        me._indexMap = new ol.control.OverviewMap(controlOptions);
                        me._indexMap.setCollapsible(true);
                        me.getMap().addControl(me._indexMap);

                    }
                    me._indexMap.setCollapsed(false);
                }

                else {
                    me._indexMap.setCollapsed(true);
                }

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
                        me._indexMap.render();
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
        },
        /**
         * Get 1st visible bottom layer
         * @returns {*}
         * @private
         */
        _getBaseLayer: function () {
            var layer = null;
            for (var i = 0; i < this._map.getLayers().getLength(); i += 1) {
                layer = this._map.getLayers().item(i);
                if(layer.getVisible()){
                    return layer;
                }
            }
            return null;
        }
    },
    {
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
