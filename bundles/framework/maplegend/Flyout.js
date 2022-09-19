import React from 'react';
import ReactDOM from 'react-dom';
import { Message } from 'oskari-ui';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { MapLegendList } from './MapLegendList';

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
        this.sandbox = this.instance.getSandbox();
        this.state = null;
        this._legendImagesNotLoaded = {};
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
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
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
        showMetadataFlyout: function (event, uuid) {
            event.stopPropagation();
            this.sandbox.postRequestByName('catalogue.ShowMetadataRequest', [{
                uuid: uuid
            }]);
        },
        /**
         * @method _populateLayerList
         * @private
         * @param {Object} layerListContainer reference to jQuery object representing the layerlist placeholder
         * Renders legend images as an accordion for the selected layers.
         */
        _populateLayerList: function () {
            const layers = this.sandbox.findAllSelectedMapLayers();

            // populate selected layer list
            const showMetadata = (event, uuid) => this.showMetadataFlyout(event, uuid);
            const legends = layers
                .filter(layer => typeof layer.getLegendImage === 'function' && !!layer.getLegendImage())
                .map(layer => {
                    const uuid = layer.getMetadataIdentifier();
                    return {
                        title: layer.getName(),
                        uuid: uuid,
                        legendImageURL: layer.getLegendImage(),
                        loadError: false,
                        showMetadataCallback: uuid ? showMetadata : null
                    };
                });

            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'maplegend' }}>
                    <ThemeProvider>
                        { legends.length === 0
                            ? <Message messageKey='noLegendsText' />
                            : <MapLegendList legendList={ legends } />
                        }
                    </ThemeProvider>
                </LocaleProvider>,
                this.container
            );
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
