import { Messaging } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import React from 'react';

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='admin-layeranalytics' />;

/**
 * @class Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance
 *
 * See Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance for bundle definition.
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance',

    /**
    * @method create called automatically on construction
    * @static
    */
    function () {
        this.localization = null;
        this.plugins = {};
        this.sandbox = null;
        this.isLoading = true;
        this.analyticsData = [];
    }, {
        __name: 'admin-layeranalytics',
        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },

        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for
         * current language.
         * If key-parameter is not given, returns the whole localization
         * data.
         *
         * @param {String} key (optional) if given, returns the value for
         *         key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method start
         * implements BundleInstance protocol start method
         */
        start: function () {
            const me = this;

            const sandboxName = 'sandbox';
            const sandbox = Oskari.getSandbox(sandboxName);

            this.sandbox = sandbox;
            this.sandbox.register(me);

            me.localization = Oskari.getLocalization(me.getName());

            // Let's extend UI
            const reqName = 'userinterface.AddExtensionRequest';
            const reqBuilder = Oskari.requestBuilder(reqName);
            const request = reqBuilder(this);
            sandbox.request(this, request);

            me.produceAnalyticsData();
            me.createUi();
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {

        },
        getName: function () {
            return this.__name;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol
         * startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.publisher.Flyout
         * Oskari.mapframework.bundle.publisher.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.framework.bundle.admin-layeranalytics.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.framework.bundle.admin-layeranalytics.Tile', this);
        },

        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol
         * stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Tile'] = null;
        },

        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins
         * method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },

        createUi: function () {
            this.plugins['Oskari.userinterface.Tile'].refresh();
            this.plugins['Oskari.userinterface.Flyout'].createContent();
        },

        /**
         * @method fetchLayerAnalytics
         * Fetches data for layer analytics
         * @param {*} layerId null or layerId as a number. If null only overall list will be fetched
         * @param {*} callback
         * @returns
         */
        fetchLayerAnalytics: function (layerId, callback) {
            this.updateLoadingState(true);
            const route = layerId ? Oskari.urls.getRoute('LayerStatus', { id: layerId }) : Oskari.urls.getRoute('LayerStatus');

            return fetch(route, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (!response.ok) {
                    Messaging.error(getMessage('messages.errorFetchingLayerAnalytics'));
                }
                return response.json();
            }).then(json => {
                if (callback) {
                    callback(json);
                }

                this.updateLoadingState();
            });
        },

        /**
         * @method produceAnalyticsData
         * Produce analytics by fetching data for all layers and layer specific data
         */
        produceAnalyticsData: function () {
            this.fetchLayerAnalytics(null, (result) => {
                for (const item in result) {
                    this.fetchLayerAnalytics(item, (itemData) => {
                        this.analyticsData.push(itemData);
                        this.plugins['Oskari.userinterface.Flyout'].updateListing();
                    });
                }
            });
        },

        getAnalyticsData: function () {
            return this.analyticsData;
        },

        /**
         * @method updateLoadingState
         * Updates loading state of bundle for progress spinner usage
         */
        updateLoadingState (loadingState = false) {
            this.isLoading = loadingState;
            this.plugins['Oskari.userinterface.Flyout'].setSpinnerState(loadingState);
        }
    }, {
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);
