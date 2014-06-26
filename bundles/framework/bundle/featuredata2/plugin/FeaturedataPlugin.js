/**
 * @class Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin
 * Provides WFS grid link on top of map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (config) {
        this._clazz = 'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin';
        this._defaultLocation = 'top right';
        this._instance = config.instance;
        this._index = 6;
        this._name = 'FeaturedataPlugin';
    }, {
        /**
         * @method _createControlElement
         * @private
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         */
        _createControlElement: function () {
            var me = this,
                sandbox = me._sandbox,
                el = jQuery('<div class="mapplugin featuredataplugin">' +
                    '<a href="JavaScript: void(0);"></a>' +
                    '</div>');

            var link = el.find('a');
            link.html(me._instance.getLocalization('title'));
            me._bindLinkClick(link);
            el.mousedown(function (event) {
                event.stopPropagation();
            });
            return el;
        },

        _bindLinkClick: function (link) {
            var me = this,
                linkElement = link || me.getElement().find('a'),
                sandbox = me._sandbox;
            linkElement.bind('click', function () {
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._instance, 'detach']);
                return false;
            });
        },

        /**
         * @method _refresh
         * Updates the plugins interface (hides if no WFS layer selected)
         */
        refresh: function () {
            var me = this,
                sandbox = me.getMapModule().getSandbox(),
                layers = sandbox.findAllSelectedMapLayers(),
                i;
            // see if there's any wfs layers, show element if so
            for (i = 0; i < layers.length; i++) {
                if (layers[i].isLayerOfType('WFS')) {
                    me.setVisible(true);
                    return;
                }
            }
            me.setVisible(false);
        },

        _setLayerToolsEditModeImpl: function () {
            if (!this.inLayerToolsEditMode()) {
                this._bindLinkClick();
            } else {
                this.getElement().find('a').unbind('click');
            }
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
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
