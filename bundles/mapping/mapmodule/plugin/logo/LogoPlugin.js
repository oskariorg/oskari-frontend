import './DataProviderInfoService';
import './logo.service';
import React from 'react';
import { Links } from './Links';
import { showDataProviderPopup } from './DataProviderPopup';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mappublished.LogoPlugin
 * Displays the NLS logo and provides a link to terms of use on top of the map.
 * Gets base urls from localization files.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function (config) {
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin';
        this._defaultLocation = 'bottom left';
        this._index = 1;
        this._name = 'LogoPlugin';
        this._popupControls = null;
        this._reactRoot = null;
    }, {
        constLayerGroupId: 'layers',
        templates: {
            main: jQuery(
                '<div class="mapplugin logoplugin"></div>'
            )
        },
        _initImpl: function () {
            this._loc = Oskari.getLocalization('MapModule', Oskari.getLang() || Oskari.getDefaultLanguage()).plugin.LogoPlugin;
        },
        /**
         * While this plugin DOES have a UI we don't want publisher stopping it on startup so
         * we are returning false to stay on screen for the duration of publisher.
         * @returns false
         */
        isShouldStopForPublisher: function () {
            return false;
        },
        getService: function () {
            if (!this._service) {
                this._service = Oskari.clazz.create('Oskari.map.DataProviderInfoService', this.getSandbox());

                if (this._service) {
                    var me = this;
                    // init group for layers
                    this._service.addGroup(me.constLayerGroupId, me._loc.layersHeader);
                    var layers = me.getSandbox().findAllSelectedMapLayers();
                    // add initial layers
                    layers.forEach(function (layer) {
                        me._service.addItemToGroup(me.constLayerGroupId, {
                            'id': layer.getId(),
                            'name': layer.getName(),
                            // AH-2182 Show source for user layers
                            'source': layer.getSource && layer.getSource() ? layer.getSource() : layer.getOrganizationName()
                        });
                    });
                    // if service was created, add a change listener
                    this._service.on('change', function () {
                        me.updateDialog();
                    });
                }
            }
            return this._service;
        },
        clearPopup: function () {
            if (this._popupControls) {
                this._popupControls.close();
            }
            this._popupControls = null;
        },
        openDataProvidersPopup: function (data) {
            if (!this._popupControls) {
                this._popupControls = showDataProviderPopup(this._loc.dataSources, data, () => this.clearPopup());
            }
        },
        registerForUpdateLabels: function (el) {
            var me = this;
            var element = el || this.getElement();
            if (!this._extendService) {
                this._extendService = Oskari.clazz.create('Oskari.map.LogoPluginService', this.getSandbox());
                this._extendServiceHandler = function () {
                    me._labelCallBack();
                };
                this._extendService.on('change', this._extendServiceHandler);
            }
            this._labelCallBack = function () {
                me.updateLabels(element);
            };
        },
        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        _createEventHandlers: function () {
            return {
                AfterMapLayerRemoveEvent: function (event) {
                    var service = this.getService();
                    if (!service || !event.getMapLayer()) {
                        return;
                    }
                    service.removeItemFromGroup(this.constLayerGroupId, event.getMapLayer().getId());
                },
                AfterMapLayerAddEvent: function (event) {
                    var layer = event.getMapLayer();
                    var service = this.getService();
                    if (!service || !layer) {
                        return;
                    }
                    service.addItemToGroup(this.constLayerGroupId, this.getItemFromLayer(layer));
                },
                MapLayerEvent: function (event) {
                    if (event.getOperation() !== 'update') {
                        return;
                    }
                    const layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());
                    if (layer) {
                        this.getService().updateItem(this.constLayerGroupId, this.getItemFromLayer(layer));
                    }
                }
            };
        },
        getItemFromLayer: function (layer) {
            return {
                id: layer.getId(),
                name: layer.getName(),
                source: layer.getSource && layer.getSource() ? layer.getSource() : layer.getOrganizationName()
            };
        },

        resetUI: function () {
            if (this._popupControls) {
                this.clearPopup();
            }
        },

        /**
         * @private @method _createControlElement
         * Draws the panbuttons on the screen.
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            var container = this.templates.main.clone();
            var conf = this.getConfig() || {};
            this.registerForUpdateLabels(container);
            this._createServiceLink(container);

            var termsUrl = Oskari.getLocalized(conf.termsUrl);
            this._createTermsLink(termsUrl, container);
            this._createDataSourcesLink(container);
            return container;
        },

        _stopPluginImpl: function () {
            if (this._extendService) {
                this._extendService.off('change', this._extendServiceHandler);
                this._extendService = null;
            }
            this.removeFromPluginContainer(this.getElement());
        },

        _createServiceLink: function () {
            const logoUrl = Oskari.urls.getRoute('Logo');
            const { geoportalLink = true } = this.getConfig();
            const options = {
                id: 'logo',
                src: logoUrl,
                callback: () => {
                    if (geoportalLink) {
                        const mapUrl = this.__getMapUrl();
                        const linkParams = this.getSandbox().generateMapLinkParameters({});
                        window.open(mapUrl + linkParams, '_blank');
                    }
                }
            };
            this._extendService.addLabel('', options);
        },

        /**
         * Returns the map url for link tool
         * @private
         * @return {String} base URL for state parameters
         */
        __getMapUrl: function () {
            var sandbox = this.getSandbox();
            var url = Oskari.getLocalized(this.getConfig().mapUrlPrefix);

            // setup current url as base if none configured
            return sandbox.createURL(url || window.location.pathname, true);
        },
        _createTermsLink: function (termsUrl, el) {
            var me = this,
                element = el || me.getElement();
            if (!element || !termsUrl) {
                return;
            }
            var options = {
                id: 'terms',
                callback: function (evt) {
                    evt.preventDefault();
                    window.open(termsUrl, '_blank');
                }
            };

            me._extendService.addLabel(me._loc.terms, options);
        },

        _createDataSourcesLink: function (el) {
            var me = this,
                conf = me.getConfig() || {},
                element = el || me.getElement();

            if (!element || conf.hideDataSourceLink) {
                return;
            }
            var options = {
                id: 'data-sources',
                callback: function (e) {
                    if (!me._popupControls) {
                        me._openDataSourcesDialog();
                    } else {
                        me.clearPopup();
                    }
                }
            };

            me._extendService.addLabel(me._loc.dataSources, options);
        },

        updateDialog: function () {
            if (!this._popupControls) {
                return;
            }
            this.clearPopup();
            this._openDataSourcesDialog();
        },
        /**
         * @method _openDataSourcesDialog
         * Opens a dialog to show data sources of the selected layers
         * and statistics indicators.
         *
         * @param  {jQuery} target arget element where the popup is attached to
         * @param  {Array[Object]} indicators the open indicators
         *
         * @return {undefined}
         */
        _openDataSourcesDialog: function () {
            const service = this.getService();
            if (!service) {
                return;
            }
            const groups = this._service.getNonEmptyGroups();
            this.openDataProvidersPopup(groups);
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        /**
         * @method updateLabels
         * Adds functionality to plugin
         *
         * @param {jQuery} el
         *
         */
        updateLabels: function (el) {
            var template = el || this.getElement();
            if (!template) {
                return;
            }
            var labels = this._extendService.getLabels();

            this.getReactRoot(template[0]).render(
                <Links
                    links={labels}
                />
            );
        }
    }, {
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
