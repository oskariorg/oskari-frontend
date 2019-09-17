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

        if (instance.isEmbedded()) {
            this._defaultLocation = config.legendLocation;
        } else {
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

        me._isMobileVisible = true;

        me._mobileDefs = {
            buttons: {
                'mobile-classification': {
                    iconCls: 'mobile-statslegend',
                    tooltip: locale('legend.title'),
                    sticky: false,
                    show: true,
                    callback: function () {
                        if (me._isMobileVisible) {
                            me.teardownUI();
                        } else {
                            me._buildUI();
                        }
                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me.log = Oskari.log('Oskari.statistics.statsgrid.ClassificationPlugin');

        this.__legend = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', sandbox, this._locale);
        this.__legend.on('rendered', function () {
            me._calculatePluginSize();
        });
        this.__legend.on('edit-legend', function (isEdit) {
            if (isEdit) {
                me._overflowCheck(true);
            } else {
                me._restoreOverflow();
            }
        });
        this.__legend.on('content-rendered', function () {
            me._overflowCheck();
        });
        this._overflowedOffset = null;
    }, {
        _setLayerToolsEditModeImpl: function () {
            if (!this.getElement()) {
                return;
            }
            if (!this.inLayerToolsEditMode()) {
                this.setLocation(
                    this.getElement().parents('.mapplugins').attr(
                        'data-location'
                    )
                );
            }
        },
        _createControlElement: function () {
            if (this.element !== null) {
                return this.element;
            }
            this.element = this._templates.main.clone();
            this.element.css('z-index', 15001);
            this.__legend.render(this.element);
            return this.element;
        },
        redrawUI: function (mapInMobileMode, forced) {
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarReady = !this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && !toolbarReady) {
                return true;
            }
            this.teardownUI();

            if (toolbarReady && mapInMobileMode) {
                // create mobile
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
                var toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')('mobile-classification', 'mobileToolbar-mobile-toolbar');
                this.getSandbox().request(this, toolbarRequest);
            }
            if (!mapInMobileMode) {
                this._buildUI();
            }
            return false;
        },
        teardownUI: function () {
            this._isMobileVisible = false;
            var element = this.getElement();
            // detach old element from screen
            if (element) {
                this.removeFromPluginContainer(element, true);
                this.element = null;
            }
        },
        _buildUI: function () {
            this._isMobileVisible = true;
            this.addToPluginContainer(this._createControlElement());
            this._makeDraggable();
            this._overflowCheck();
        },
        _makeDraggable: function () {
            this.getElement().draggable();
        },
        makeTransparent: function (transparent) {
            var element = this.getElement();
            if (!element) {
                return;
            }
            if (transparent) {
                element.removeClass('statsgrid-legend-plugin');
                element.addClass('statsgrid-legend-plugin-transparent');
                element.find('.statsgrid-legend-container').addClass('legend-transparent');
            } else {
                element.removeClass('statsgrid-legend-plugin-transparent');
                element.addClass('statsgrid-legend-plugin');
                element.find('.statsgrid-legend-container').removeClass('legend-transparent');
            }
        },
        getElement: function () {
            return this.element;
        },
        enableClassification: function (enabled) {
            this.__legend.allowClassification(enabled);
        },
        stopPlugin: function () {
            this.teardownUI();
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
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
        _calculatePluginSize: function () {
            var element = this.getElement();

            if (!element) {
                return;
            }
            var height = this.getSandbox().getMap().getHeight();
            var headerHeight = element.find('.active-header').first().height();
            if (Oskari.util.isMobile()) {
                element.find('.accordion').css({
                    'overflow': 'auto',
                    'max-height': (height * 0.8 - headerHeight) + 'px'
                });
            } else if (!Oskari.util.isMobile()) {
                element.find('.accordion').css({
                    'max-height': (height * 0.8 - headerHeight) + 'px'
                });
            }
        },
        _overflowCheck: function (storeOverflow) {
            var pluginEl = this.getElement();
            if (!pluginEl) {
                return;
            }
            if (pluginEl.css('position') === 'absolute') {
                var top = pluginEl.offset().top;
                var bottom = top + pluginEl.height();
                var offsetToWindowBottom = jQuery(window).height() - bottom - 10; // add margin 10
                if (this._defaultLocation.includes('bottom')) {
                    var pluginContainer = jQuery('.mapplugins.bottom.right');
                    var containerHeight = pluginContainer.outerHeight();
                    var offsetToContainer = pluginEl.position().left + pluginEl.outerWidth() + 10;
                    if (offsetToContainer > 0) {
                        offsetToWindowBottom = offsetToWindowBottom - containerHeight + 10; // remove margin 10
                    }
                }
                if (offsetToWindowBottom < 0) {
                    if (storeOverflow === true) {
                        this._overflowedOffset = offsetToWindowBottom;
                    }
                    pluginEl.css('top', pluginEl.position().top + offsetToWindowBottom + 'px');
                }
            }
        },
        _restoreOverflow: function () {
            var pluginEl = this.getElement();
            if (this._overflowedOffset === null || !pluginEl) {
                return;
            }
            pluginEl.css('top', pluginEl.position().top - this._overflowedOffset + 'px');
            this._overflowedOffset = null;
        },
        hasUI: function () {
            // Plugin has ui element but returns false, because
            // otherwise publisher would stop this plugin and start it again when leaving the publisher,
            // resulting a misfuctioning duplicate classification element on screen.
            return false;
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
