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
                "<div class='mapplugin logoplugin'>" +
                    "<div class='icon'></div>" +
                    "<div class='terms'><a href='JavaScript:void(0);'></a></div>" +
                    "<div class='data-sources'></div>" +
                    "</div>"
            ),
            dataSourcesDialog: jQuery(
                "<div class='data-sources-dialog'>" +
                    "<div class='layers'><h4></h4></div>" +
                    "<div class='indicators'><h4></h4></div>" +
                    "</div>"
            )
        },

        /** @static @property __name plugin name */
        __name: 'LogoPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
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
                p;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }

            me._sandbox.unregister(me);
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
            'MapSizeChangedEvent' : function (event) {
                if (this.dataSourcesDialog) {
                    var target = jQuery('div.logoplugin div.data-sources');
                    if (target) this.dataSourcesDialog.moveTo(target, 'top');
                }
            }
        },

        /** 
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
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
            me.conf.location = location;

            // reset plugin if active
            if (me.element) {
                me.stopPlugin();
                me.startPlugin();
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
                link,
                linkParams,
                mapUrl,
                termsUrl,
                containerClasses = 'bottom left',
                position = 1,
                dataSources;

            if (me.conf) {
                mapUrl = sandbox.getLocalizedProperty(me.conf.mapUrlPrefix);
                termsUrl = sandbox.getLocalizedProperty(me.conf.termsUrl);
            }

            if (!me.element) {
                me.element = me.templates.main.clone();
            }

            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }
            //parentContainer.append(me.element);
            me.getMapModule().setMapControlPlugin(me.element, containerClasses, position);
            link = me.element.find('div.icon');
            if (mapUrl) {
                link.bind('click', function () {
                    linkParams = sandbox.generateMapLinkParameters();
                    mapUrl += linkParams;
                    window.open(mapUrl, '_blank');
                    return false;
                });
            }

            link = me.element.find('a');
            if (termsUrl) {
                link.append(myLoc.terms);
                link.bind('click', function () {
                    window.open(termsUrl, '_blank');
                    return false;
                });
            } else {
                link.hide();
            }

            dataSources = me.element.find('div.data-sources');
            if (me.conf && me.conf.hideDataSourceLink) {
                dataSources.remove();
            } else {
                dataSources.html(myLoc.dataSources);
                dataSources.click(function (e) {
                    if (me.dataSourcesDialog == null) {
                        me._openDataSourcesDialog(e.target);
                        me._requestDataSources();
                    }
                });
            }
        },

        /**
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
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
         * Sends a request to get indicators. If the statsgrid bundle is not available
         * (and consequently there aren't any indicators) it opens the data sources dialog
         * and just shows the data sources of the layers.
         *
         * @method _requestDataSources
         * @return {undefined}
         */
        _requestDataSources: function () {
            var me = this,
                reqBuilder = me._sandbox.getRequestBuilder('StatsGrid.IndicatorsRequest'),
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
         * @param  {jQuery} target the target element where the popup is attached to
         * @param  {Array[Object]} indicators the open indicators
         * @return {undefined}
         */
        _openDataSourcesDialog: function (target) {
            var me = this,
                pluginLoc = me.getMapModule().getLocalization('plugin', true)[me.__name],
                popupTitle = pluginLoc.dataSources,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
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

                for (i = 0; i < layersLen; ++i) {
                    layer = layers[i];
                    layersCont.append(
                        '<div>' +
                            layer.getName() + ' - ' + layer.getOrganizationName() +
                            '</div>'
                    );
                }
            }

            this.dataSourcesDialog = dialog;

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
            var dialog = this.dataSourcesDialog;
            if (!dialog) {
                return;
            }

            var pluginLoc = this.getMapModule().getLocalization('plugin', true)[this.__name],
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
                                indicator.title + ' - ' + indicator.organization +
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
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });