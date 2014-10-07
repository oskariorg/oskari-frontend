/**
 * @class Oskari.mapframework.bundle.mappublished.LogoPlugin
 * Displays the NLS logo and provides a link to terms of use on top of the map.
 * Gets base urls from localization files.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (conf) {
        this.conf = conf;
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.element = null;
    }, {

        templates: {
            main: jQuery(
                '<div class="mapplugin logoplugin" data-clazz="Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin">' +
                    '<div class="icon"></div>' +
                    '<div class="terms">' +
                    '<a href="JavaScript:void(0);"></a>' +
                    '</div>' +
                    '<div class="data-sources"><a href="JavaScript:void(0);"></a></div>' +
                    '</div>'
            ),
            dataSourcesDialog: jQuery(
                '<div class="data-sources-dialog">' +
                    '<div class="layers"><h4></h4></div>' +
                    '<div class="indicators"><h4></h4></div>' +
                    '</div>'
            )
        },

        /** @static @property __name plugin name */
        __name: 'LogoPlugin',

        getClazz: function () {
            return 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin';
        },

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         *     reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule}
         *     reference to map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },

        getElement: function () {
            return this.element;
        },

        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has an UI so always returns true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {},
        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {},
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {},
        /**
         * @method startPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._map = me.getMapModule().getMap();

            me._sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.registerForEventByName(me, p);
                }
            }
            me._createUI();
        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p,
                sb = sandbox || me._sandbox;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sb.unregisterFromEventByName(me, p);
                }
            }

            sb.unregister(me);
            me._map = null;
            me._sandbox = null;

            // TODO: check if added?
            // unbind change listener and remove ui
            if (me.element) {
                me.element.find('a').unbind('click');
                me.element.remove();
                me.element = undefined;
            }
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /** 
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'StatsGrid.IndicatorsEvent': function (event) {
                this._addIndicatorsToDataSourcesDialog(event.getIndicators());
            },

            LayerToolsEditModeEvent: function (event) {
                // FIXME make sure event.isInMode() returns a bool and remove !!
                this.isInLayerToolsEditMode = !!event.isInMode();
                if (!this.isInLayerToolsEditMode) {
                    this.setLocation(
                        this.element.parents('.mapplugins').attr(
                            'data-location'
                        )
                    );
                }
            },

            MapSizeChangedEvent: function (event) {
                if (this.dataSourcesDialog) {
                    var target = jQuery('div.logoplugin div.data-sources');
                    if (target) {
                        this.dataSourcesDialog.moveTo(target, 'top');
                    }
                }
            }

        },

        /** 
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(this, [event]);
            }
        },

        /**
         * Sets the location of the logo.
         *
         * @method setLocation
         * @param {String} location The new location
         */
        setLocation: function (location) {
            var me = this;
            if (!me.conf) {
                me.conf = {};
            }
            if (!me.conf.location) {
                me.conf.location = {};
            }
            me.conf.location.classes = location;

            if (me.element) {
                me.getMapModule().setMapControlPlugin(me.element, location, 1);
            }
        },

        /**
         * @method _createUI
         * @private
         * Creates logo and terms of use links on top of map
         */
        _createUI: function () {
            var me = this,
                sandbox = me._sandbox,
                pluginLoc = me.getMapModule().getLocalization('plugin', true),
                myLoc = pluginLoc[me.__name],
                mapUrl,
                termsUrl,
                containerClasses = 'bottom left',
                position = 1;

            if (me.conf) {
                mapUrl = sandbox.getLocalizedProperty(me.conf.mapUrlPrefix);
                termsUrl = sandbox.getLocalizedProperty(me.conf.termsUrl);
            }

            if (!me.element) {
                me.element = me.templates.main.clone();
            }

            if (me.conf) {
                if (me.conf.location) {
                    containerClasses =
                        me.conf.location.classes || containerClasses;
                    position = me.conf.location.position || position;
                }
                if (me.conf.font) {
                    this.changeFont(me.conf.font);
                }
            }

            me.getMapModule().setMapControlPlugin(
                me.element,
                containerClasses,
                position
            );

            me._createServiceLink(mapUrl);
            me._createTermsLink(myLoc, termsUrl);
            me._createDataSourcesLink(myLoc);

            // in case we are already in edit mode when plugin is drawn
            this.isInLayerToolsEditMode =
                me.getMapModule().isInLayerToolsEditMode();

        },

        _createServiceLink: function (mapUrl) {
            var me = this,
                link = me.element.find('div.icon'),
                linkParams;
            if (mapUrl) {
                link.bind('click', function () {
                    if (!me.isInLayerToolsEditMode) {
                        linkParams = me._sandbox.generateMapLinkParameters();
                        window.open(mapUrl + linkParams, '_blank');
                        return false;
                    }
                });
            }
        },

        _createTermsLink: function (loc, termsUrl) {
            var me = this,
                link = me.element.find('.terms a');

            if (termsUrl) {
                link.append(loc.terms);
                link.bind('click', function () {
                    if (!me.isInLayerToolsEditMode) {
                        window.open(termsUrl, '_blank');
                        return false;
                    }
                });
            } else {
                link.hide();
            }
        },

        _createDataSourcesLink: function (loc) {
            var me = this,
                dataSources = me.element.find('div.data-sources');

            if (me.conf && me.conf.hideDataSourceLink) {
                dataSources.remove();
            } else {
                dataSources.find('a').html(loc.dataSources);
                dataSources.click(function (e) {
                    if (!me.isInLayerToolsEditMode && !me.dataSourcesDialog) {
                        me._openDataSourcesDialog(e.target);
                        me._requestDataSources();
                    } else if (me.dataSourcesDialog) {
                        me.dataSourcesDialog.close(true);
                        me.dataSourcesDialog = null;
                    }
                });
            }
        },

        /**
         * Changes the font plugin's font by adding a class to its DOM elements.
         *
         * @method changeFont
         * @param {String} fontId
         * @param {jQuery} div
         */
        changeFont: function (fontId, div) {
            var classToAdd,
                testRegex;
            div = div || this.element;

            if (!div || !fontId) {
                return;
            }

            classToAdd = 'oskari-publisher-font-' + fontId;
            testRegex = /oskari-publisher-font-/;

            this.getMapModule().changeCssClasses(classToAdd, testRegex, [div]);
        },

        /**
         * Sends a request for indicators. If the statsgrid bundle is not
         * available (and consequently there aren't any indicators) it opens the
         * data sources dialog and just shows the data sources of the layers.
         *
         * @method _requestDataSources
         * @return {undefined}
         */
        _requestDataSources: function () {
            var me = this,
                reqBuilder = me._sandbox.getRequestBuilder(
                    'StatsGrid.IndicatorsRequest'
                ),
                request;

            if (reqBuilder) {
                request = reqBuilder();
                me._sandbox.request(me, request);
            }
        },

        /**
         * Opens a dialog to show data sources of the selected layers
         * and statistics indicators.
         *
         * @method _openDataSourcesDialog
         * @param  {jQuery} target arget element where the popup is attached to
         * @param  {Array[Object]} indicators the open indicators
         * @return {undefined}
         */
        _openDataSourcesDialog: function (target) {
            var me = this,
                pluginLoc = me.getMapModule().getLocalization(
                    'plugin',
                    true
                )[me.__name],
                popupTitle = pluginLoc.dataSources,
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                closeButton = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                content = me.templates.dataSourcesDialog.clone(),
                layersCont = content.find('div.layers'),
                layersHeaderLoc = pluginLoc.layersHeader,
                layers = me._sandbox.findAllSelectedMapLayers(),
                layersLen = layers.length,
                layer,
                i;

            closeButton.setTitle('OK');
            closeButton.setHandler(function () {
                me.dataSourcesDialog = null;
                dialog.close(true);
            });

            // List the layers if any
            if (layersLen === 0) {
                layersCont.remove();
            } else {
                layersCont.find('h4').html(layersHeaderLoc);

                for (i = 0; i < layersLen; i += 1) {
                    layer = layers[i];
                    layersCont.append(
                        '<div>' +
                            layer.getName() + ' - ' +
                            layer.getOrganizationName() +
                            '</div>'
                    );
                }
            }

            me.dataSourcesDialog = dialog;

            dialog.show(popupTitle, content, [closeButton]);

            target = target || me.element.find('div.data-sources');
            dialog.moveTo(target, 'top');
        },

        /**
         * Adds indicators to the data sources dialog.
         *
         * @method _addIndicatorsToDataSourcesDialog
         * @param {Object} indicators
         */
        _addIndicatorsToDataSourcesDialog: function (indicators) {
            if (!this.dataSourcesDialog) {
                return;
            }
            var dialog = this.dataSourcesDialog,
                pluginLoc = this.getMapModule().getLocalization(
                    'plugin',
                    true
                )[this.__name],
                content = dialog.getJqueryContent(),
                indicatorsCont = content.find('div.indicators'),
                indicatorsHeaderLoc = pluginLoc.indicatorsHeader,
                indicator,
                i,
                target;

            indicators = indicators || {};

            // List the indicators if any
            if (jQuery.isEmptyObject(indicators)) {
                indicatorsCont.remove();
            } else {
                indicatorsCont.find('h4').html(indicatorsHeaderLoc);

                for (i in indicators) {
                    if (indicators.hasOwnProperty(i)) {
                        indicator = indicators[i];
                        indicatorsCont.append(
                            '<div>' +
                                indicator.title + ' - ' +
                                indicator.organization +
                                '</div>'
                        );
                    }
                }
            }

            target = target || this.element.find('div.data-sources');
            dialog.moveTo(target, 'top');
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
