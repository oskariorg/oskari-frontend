import React from 'react';
import { Message } from 'oskari-ui';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { MapLegendList } from './components/MapLegendList';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.maplegend.Flyout
 *
 * Renders any Legend Images (such as returned from WMS GetLegendGraphic)
 * for any selected layers.
 *
 * TODO: Add support for sublayers
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.maplegend.LayerSelectorBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this._legendImagesNotLoaded = {};
        this._reactRoot = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.maplegend.Flyout';
        },
        /**
         * @method setEl
         * @param {Object} el reference to the container in browser
         *
         * Interface method implementation
         */
        setEl: function (el, flyout) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('maplegend')) {
                jQuery(this.container).addClass('maplegend');
            }
            if (!flyout.hasClass('maplegend')) {
                flyout.addClass('maplegend');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.loc('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            return this.instance.loc('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {String} state
         *      close/minimize/maximize etc
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },
        createUi: function () {
            this.refresh();
        },
        refresh: function () {
            this._populateLayerList();
        },
        showMetadataFlyout: function (event, layerId) {
            event.stopPropagation();
            this.instance.getSandbox().postRequestByName('catalogue.ShowMetadataRequest', [{ layerId: layerId }]);
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        /**
         * @method _populateLayerList
         * @private
         * @param {Object} layerListContainer reference to jQuery object representing the layerlist placeholder
         * Renders legend images as an accordion for the selected layers.
         */
        _populateLayerList: function () {
            const layers = this.instance.getSandbox().findAllSelectedMapLayers();

            // populate selected layer list
            const showMetadata = (event, layerId) => this.showMetadataFlyout(event, layerId);
            const legends = layers
                .filter(layer => typeof layer.getLegendImage === 'function' && !!layer.getLegendImage())
                .map(layer => {
                    const uuid = layer.getMetadataIdentifier();
                    const layerId = layer.getId();
                    return {
                        title: layer.getName(),
                        uuid,
                        layerId,
                        legendImageURL: layer.getLegendImage(),
                        metadataUrl: layer.getAttributes().metadataUrl,
                        loadError: false,
                        showMetadataCallback: layerId ? showMetadata : null
                    };
                }).reverse();

            this.getReactRoot(this.container).render(
                <ThemeProvider>
                    <LocaleProvider value={{ bundleKey: 'maplegend' }}>
                        { legends.length === 0
                            ? <Message messageKey='noLegendsText' />
                            : <MapLegendList legendList={ legends } />
                        }
                    </LocaleProvider>
                </ThemeProvider>
            );
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });
