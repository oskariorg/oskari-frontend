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
        this._index = 8;
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
                sandbox = me.getSandbox(),
                el = jQuery('<div class="mapplugin featuredataplugin">' +
                    '<a href="JavaScript: void(0);"></a>' +
                    '</div>');

            var link = el.find('a');
            me._loc = Oskari.getLocalization('FeatureData2', Oskari.getLang() || Oskari.getDefaultLanguage(), true);
            link.html(me._loc.title);
            me._bindLinkClick(link);
            el.mousedown(function (event) {
                event.stopPropagation();
            });
            return el;
        },

        _bindLinkClick: function (link) {
            var me = this,
                linkElement = link || me.getElement().find('a'),
                sandbox = me.getSandbox();
            linkElement.bind('click', function () {
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me._instance, 'detach']);
                var event = sandbox.getEventBuilder('WFSRefreshManualLoadLayersEvent')();
                sandbox.notifyAll(event);
                return false;
            });
        },
        /**
         * @method _refresh
         * Updates the plugins interface (hides if no featuredata layer selected)
         */
        refresh: function () {
            var me = this,
                sandbox = me.getMapModule().getSandbox(),
                layers = sandbox.findAllSelectedMapLayers(),
                i,
                isVisible = false;

            if(this.getElement()) {
                this.getElement().hide();
            }
            // see if there's any wfs layers, show element if so
            for (i = 0; i < layers.length; i++) {
                if (layers[i].hasFeatureData()) {
                    isVisible = true;
                }
            }
            if(isVisible && this.getElement()){
              this.getElement().show();
            }
            me.setVisible(isVisible);

        },
        showLoadingIndicator : function(blnLoad) {
            if(!this.getElement()) {
                return;
            }
            if(blnLoad) {
                this.getElement().addClass('loading');
            }
            else {
                this.getElement().removeClass('loading');
            }
        },
        showErrorIndicator : function(blnLoad) {
            if(!this.getElement()) {
                return;
            }
            if(blnLoad) {
                this.getElement().addClass('error');
            }
            else {
                this.getElement().removeClass('error');
            }
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
