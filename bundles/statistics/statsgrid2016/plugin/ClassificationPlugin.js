/**
 * @class Oskari.statistics.statsgrid.ClassificationPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (instance, config, locale, sandbox) {
        var me = this;
        me._locale = locale;
        me._config = config || {};
        me._sandbox = sandbox;
        me._instance = instance;
        me._clazz = 'Oskari.statistics.statsgrid.ClassificationPlugin';
        me._defaultLocation = 'top right';
        me._index = 9;
        me._name = 'ClassificationPlugin';
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
        // me.setLocation(config.legendLocation || me._defaultLocation);

        me._mobileDefs = {
            buttons:  {
                'mobile-classification': {
                    iconCls: 'mobile-statslegend',
                    tooltip: locale.legend.title,
                    show: true,
                    callback: function () {

                    },
                    sticky: true,
                    toggleChangeIcon: true
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me.log = Oskari.log('Oskari.statistics.statsgrid.ClassificationPlugin');

        this.__legend = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', sandbox);
        this.__legend.on('rendered', function(){
            me._calculatePluginSize();
        });
    }, {

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
        /**
         * @method _createUi Create element and construct DOM structure
         * @private
         * @param  {Boolean} isMobile is UI in mobile mode?
         */
        _createUi: function (isMobile) {
            var me = this;
            me._element = me._createControlElement();
            this.addToPluginContainer(me._element);
            if (!isMobile) {
                me._makeDraggable();
            }
        },
        _makeDraggable: function () {
            this._element.draggable();
        },
        makeTransparent: function ( transparent ) {
            if ( !this._element ) {
                return;
            }
            if ( transparent ) {
                this._element.find('.statsgrid-legend-container').addClass('legend-transparent');
            } else {
                this._element.find('.statsgrid-legend-container').removeClass('legend-transparent');
            }
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

            if (!toolbarNotReady && mapInMobileMode) {
                // create mobile
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
                return;
            }
            this._createUi(mapInMobileMode);
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
            if(!this._element) {
                return;
            }
            var me = this;

            var sandbox = me.getSandbox();
            var height = sandbox.getMap().getHeight();
            var headerHeight = me._element.find('.active-header').first().height();
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
