/**
 * @class Oskari.statistics.statsgrid.ClassificationPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationPlugin',

    function (instance, config, locale, sandbox) {
        var me = this;
        me._locale = locale;
        me._config = config || {};
        me._sandbox = sandbox;
        me._instance = instance;
        me._clazz = 'Oskari.statistics.statsgrid.ClassificationPlugin';
        me._index = 9;

        if ( instance.isEmbedded() )
        {
            this._defaultLocation = config.legendLocation;
        }
        else {
            this._defaultLocation = 'right bottom';
        }
        
        me._name = 'ClassificationPlugin';
        me.element = null;
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
                    tooltip: locale('legend.title'),
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

        this.__legend = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', sandbox, this._locale);
        this.__legend.on('rendered', function(){
            me._calculatePluginSize();
        });
    }, {
        _setLayerToolsEditModeImpl: function () {
            if ( !this.getElement() ) {
                return;
            }
            if ( !this.inLayerToolsEditMode() ) {
                this.setLocation(
                    this.getElement().parents('.mapplugins').attr(
                        'data-location'
                    )
                );
            }
        },
        _createControlElement: function () {
            var sb = this._sandbox;

            if ( this.element !== null ) {
                return this.element;
            }
            this.element = this._templates.main.clone();
            this.__legend.render(this.element);
            return this.element;
        },
        redrawUI: function(mapInMobileMode, forced) {
            var sandbox = this.getSandbox();
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
                return false;
            }
            this.addToPluginContainer( this._createControlElement() );
            this._makeDraggable();
            return false;
        },
        teardownUI: function(stopping) {
            var element = this.getElement();
            //detach old element from screen
            if (element ) {
                element.detach();
                this.removeFromPluginContainer(element, !stopping);
                this.element = null;
            }
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },
        _makeDraggable: function () {
            this.getElement().draggable();
        },
        makeTransparent: function ( transparent ) {
            var element = this.getElement();
            if ( !element ) {
                return;
            }
            if ( transparent ) {
                element.removeClass('statsgrid-legend-plugin');
                element.addClass('statsgrid-legend-plugin-transparent');
                element.find('.statsgrid-legend-container').addClass('legend-transparent');
            } else {
                element.removeClass('statsgrid-legend-plugin-transparent');
                element.addClass('statsgrid-legend-plugin');
                element.find('.statsgrid-legend-container').removeClass('legend-transparent');
            }
        },
        getElement: function() {
            return this.element;
        },
        enableClassification: function(enabled) {
            this.__legend.allowClassification(enabled);
        },
        stopPlugin: function() {
            this.teardownUI(true);
        },
        _createEventHandlers: function () {
            return {
                // 'StatsGrid.ActiveIndicatorChangedEvent' : function(evt) {
                // },
                MapSizeChangedEvent: function () {
                    this._calculatePluginSize();
                }
            };
        },
        _calculatePluginSize: function() {
            var element = this.getElement();

            if ( !element ) {
                return;
            }
            var height = this.getSandbox().getMap().getHeight();
            var headerHeight = element.find('.active-header').first().height();
            if ( Oskari.util.isMobile() ) {
                this._popup.getJqueryContent().find('.accordion').css({
                    'overflow': 'auto',
                    'max-height': (height * 0.8 - headerHeight) + 'px'
                });
            } else if ( !Oskari.util.isMobile() ) {
                element.find('.accordion').css({
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
