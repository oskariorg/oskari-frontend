/**
 * @class Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (instance, config, locale, mapmodule, sandbox) {
        var me = this;
        me._locale = locale;
        me._config = config || {};
        me._mapmodule = mapmodule;
        me._sandbox = sandbox;
        me._instance = instance;
        me._clazz = 'Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin';
        me._defaultLocation = 'top right';
        me._index = 9;
        me._name = 'ClassificationToolPlugin';
        me._element = null;
        me._templates = {
            main: jQuery('<div class="mapplugin statsgrid-legend-plugin"></div>')
        };
        // for publisher dragndrop to work needs to have at least:
        // -  mapplugin-class in parent template
        // - _setLayerToolsEditModeImpl()
        // - publisher tool needs to implement getPlugin()
        // publisher tool writes location to statsgrid.conf.legendLocation since this is not only a plugin
        //  for this reason we need to call setLocation() manually as location is not in the default path "config.location.classes"
        me.setLocation(config.legendLocation || me._defaultLocation);

        me._mobileDefs = {
            buttons:  {
                'mobile-coordinatetool': {
                    iconCls: 'mobile-statslegend',
                    tooltip: locale.legend.title,
                    show: true,
                    callback: function () {
                        if(me._popup && me._popup.isVisible()) {
                            me._popup.close(true);
                        } else {
                            me._showPopup();
                        }
                    },
                    sticky: true,
                    toggleChangeIcon: true
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me.log = Oskari.log('Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin');

        this.__legend = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', sandbox, locale);
        this.__legend.on('rendered', function(){
            me._calculatePluginSize();
        });
    }, {

        /**
         * Show popup.
         * @method @private _showPopup
         */
        _showPopup: function() {
            var me = this;
            var sandbox = me.getSandbox();
            var popupService = this.getSandbox().getService('Oskari.userinterface.component.PopupService');
            this._popup = popupService.createPopup();
            this._popup.onClose(function() {
                // detach so we dont lose eventlistener bindings
                me.getElement().detach();
                sandbox.postRequestByName('Toolbar.SelectToolButtonRequest', [null, 'mobileToolbar-mobile-toolbar']);
            });
            this._popup.addClass('statsgrid-mobile-legend');
            this._popup.show(null, this.getElement());
            this._popup.moveTo(jQuery('div.mobileToolbarDiv'), 'top', true);
            me._calculatePluginSize();
        },

        /**
         * @method _setLayerToolsEditModeImpl
         * Called after layerToolsEditMode is set.
         *
         *
         */
        _setLayerToolsEditModeImpl: function () {
            var me = this;
            if(!me.getElement()) {
                return;
            }
            if (!me.inLayerToolsEditMode()) {
                me.setLocation(
                    me.getElement().parents('.mapplugins').attr(
                        'data-location'
                    )
                );
            }
        },
        /**
         * Creates UI for classification UI.
         * @private @method _createControlElement
         *
         * @return {jQuery}
         */
        _createControlElement: function () {
            var me = this;
            var sb = me._sandbox;
            var locale = me._locale;
            var config = me._config;

            if(me._element !== null) {
                return me._element;
            }
            me._element = me._templates.main.clone();
            this.__legend.render(me._element);
            return me._element;
        },

        teardownUI : function(stopping) {
            //detach old element from screen
            var me = this;
            this.removeFromPluginContainer(me._element, !stopping);
            if (this._popup) {
                me.getElement().detach();
                this._popup.close(true);
            }
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
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

            me._element = me._createControlElement();
            if (!toolbarNotReady && mapInMobileMode) {
                // create mobile
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
                return;
            }

            this.addToPluginContainer(me._element);
        },

        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function(){
            return this._element;
        },

        enableClassification: function(enabled) {
            this.__legend.allowClassification(enabled);
        },
        stopPlugin: function(){
            this.teardownUI(true);
        },
        _createEventHandlers: function () {
            return {
                /**
                 * @method MapSizeChangedEvent
                 * Adjust size if map size changes
                 */
                MapSizeChangedEvent: function () {
                    this._calculatePluginSize();
                }
            };
        },
        _calculatePluginSize: function() {
            var me = this;

            var sandbox = me.getSandbox();
            var height = sandbox.getMap().getHeight();
            var headerHeight = me._element.find('.header').first().height();
            if(Oskari.util.isMobile() && me._popup) {
                me._popup.getJqueryContent().find('.accordion').css({
                    'overflow': 'auto',
                    'max-height': (height * 0.8 - headerHeight) + 'px'
                });
            } else if(!Oskari.util.isMobile()){
                me._element.find('.accordion').css({
                    'overflow': 'auto',
                    'max-height': (height * 0.8 - headerHeight) + 'px'
                });
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });
