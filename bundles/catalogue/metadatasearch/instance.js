import { MetadataStateHandler } from './MetadataStateHandler';
import { Messaging, LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { MetadataSearchContainer } from './view/MetadataSearchContainer';
import React from 'react';
import { COVERAGE_LAYER_ID } from '../../mapping/mapmodule/plugin/layers/coveragetool/CoverageHelper';
import './publisher/MetadataSearchTool';
import './request/MetadataSearchRequest';
import './request/MetadataSearchRequestHandler';
import './event/MetadataSearchResultEvent';
import { createRoot } from 'react-dom/client';
/**
 * @class Oskari.mapframework.bundle.metadatasearch.MetadataSearchBundleInstance
 *
 * Main component and starting point for the "metadata catalogue" functionality.
 * Provides metadata catalogue search functionality for the map.
 *
 * See Oskari.mapframework.bundle.metadatasearch.MetadataCatalogueBundle for bundle definition.
 *
 */
export const METADATA_BUNDLE_LOCALIZATION_ID = 'catalogue.bundle.metadatasearch';
const COVERAGE_FEATURE_STYLE = {
    stroke: {
        color: 'rgba(211, 187, 27, 0.8)',
        width: 2
    },
    fill: {
        color: 'rgba(255,222,0, 0.6)'
    }
};

Oskari.clazz.define(
    'Oskari.catalogue.bundle.metadatasearch.MetadataSearchBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        const sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox';
        this.sandbox = Oskari.getSandbox(sandboxName);
        this.sandbox.register(this);
        this.started = false;
        this.plugins = {};
        this.loc = Oskari.getMsg.bind(null, 'catalogue.bundle.metadatasearch');
        this.optionAjaxUrl = null;
        this.searchAjaxUrl = null;
        this.initUrls();
        this.id = 'oskari_metadatasearch_tabpanel_header';
        this._vectorLayerId = 'METADATASEARCH_VECTORLAYER';
        this.handler = new MetadataStateHandler(this);
        this.contentElement = document.createElement('div');
        this.handler.addStateListener(() => {
            this.renderSearch();
        });
        this._reactRoot = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'catalogue.bundle.metadatasearch',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        getVectorLayerId: function () {
            return this._vectorLayerId;
        },
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

        initUrls: function () {
            if (this.conf && this.conf.optionUrl) {
                this.optionAjaxUrl = this.conf.optionUrl;
            } else {
                this.optionAjaxUrl = Oskari.urls.getRoute('GetMetadataSearchOptions');
            }

            if (this.conf && this.conf.searchUrl) {
                this.searchAjaxUrl = this.conf.searchUrl;
            } else {
                this.searchAjaxUrl = Oskari.urls.getRoute('GetMetadataSearch');
            }
        },
        /**
         * @method start
         * implements BundleInstance protocol start method
         */
        start: function () {
            if (this.started) {
                return;
            }

            this.started = true;
            Object.keys(this.eventHandlers).forEach(eventName => {
                this.sandbox.registerForEventByName(this, eventName);
            });

            const metadataSearchRequestHandler = Oskari.clazz.create(
                'Oskari.catalogue.bundle.metadatasearch.request.MetadataSearchRequestHandler',
                this
            );
            this.sandbox.requestHandler(
                'MetadataSearchRequest',
                metadataSearchRequestHandler
            );

            // Default tab priority
            if (this.conf && typeof this.conf?.priority === 'number') {
                this.tabPriority = this.conf.priority;
            }

            if (this.conf?.noUI === true) {
                // bundle started by published map
                return;
            }

            // draw ui
            this.createUi();
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
         * implements BundleInstance protocol update method - does
         * nothing atm
         */
        update: function () {

        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event
         * object
         * Event is handled forwarded to correct #eventHandlers if found
         * or discarded if not.
         */
        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'DrawingEvent': function (event) {
                if (event.getId() !== this.getName() || event.getIsFinished() !== true || this.drawCoverage) {
                    return;
                }

                const coverageFeature = event.getGeoJson();
                this.handler.getController().updateCoverageFeature(JSON.stringify(coverageFeature));
            },

            'userinterface.ExtensionUpdatedEvent': function (event) {
                const isShown = event.getViewState() !== 'close';
                const name = event.getExtension().getName();

                // ExtensionUpdateEvents are fired a lot, only let metadatacatalogue extension event to be handled when enabled
                if (![this.getName(), 'Search'].includes(name)) {
                    // wasn't me or disabled -> do nothing
                    return;
                }
                if ((!isShown && this.drawCoverage === false) || event.getViewState() === 'close') {
                    this._teardownMetaSearch();
                }
                if (this.getName() === name && isShown) {
                    // own flyout so Search.TabChangedEvent doesn't trigger load options
                    this.handler.loadOptions();
                }
            },
            'Search.TabChangedEvent': function (event) {
                if (event.getNewTabId() !== this.id) {
                    this._teardownMetaSearch();
                } else {
                    this.handler.loadOptions();
                    this.removeFeaturesFromMap();
                }
            },
            'MetadataSearchResultEvent': function (event) {
                // TODO: test me via RPC
                if (this.conf.noUI === true) {
                    // bundle started by published map --> not handle event
                    return;
                }
                if (event.hasSuccess()) {
                    this.handler.getController().updateSearchResult(event.getResults());
                } else {
                    Messaging.error(Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.metadataSearchserviceError'));
                }
            },
            'AfterMapLayerAddEvent': function (event) {
                this.handler.getController().updateSelectedLayers();
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this.handler.getController().updateSelectedLayers();
            },
            'FeatureEvent': function (event) {
                // coverage removed by pressing the plugin button on map -> reset our own state as well.
                if (event.getOperation() === 'remove' && event.getFeatures()?.some(feature => feature.layerId === COVERAGE_LAYER_ID)) {
                    this.handler.updateDisplayedCoverageId(null);
                    return;
                }

                // detect metadata coverage added to map by the id in it's properties and update bookkeeping accordingly.
                if (event.getOperation() === 'add' && event.getFeatures()?.some(feature => feature.layerId === COVERAGE_LAYER_ID)) {
                    const addedDisplayedCoverageId = this.getDisplayedMetadaCoverageIdFromFeatureEvent(event) || null;
                    if (addedDisplayedCoverageId) {
                        this.handler.updateDisplayedCoverageId(addedDisplayedCoverageId);
                    }
                }
            }
        },
        getDisplayedMetadaCoverageIdFromFeatureEvent (event) {
            const features = event?.getFeatures().filter(feature => feature.layerId === COVERAGE_LAYER_ID);
            if (!features || !features.length > 0) {
                return null;
            }

            const geojsonFeatures = features.flatMap(feature => feature?.geojson?.features);
            const found = geojsonFeatures?.find(feature => !!feature?.properties?.displayedMetadataCoverageId);
            return found ? found.properties.displayedMetadataCoverageId : null;
        },
        /**
         * @method _teardownMetaSearch
         * @private
         * Tears down meta data search when changing tab or closing flyout
         */
        _teardownMetaSearch: function () {
            this.handler.getController().advancedSearchCoverageCancelDrawing();
        },

        /**
         * @method addCoverageFeatureToMap
         * Adds coverage feature to map.
         *
         * @param {String} geom WKT representation of the geometry of the feature to add
         */
        addCoverageFeatureToMap: function (geom) {
            const requestName = 'MapModulePlugin.AddFeaturesToMapRequest';
            this.getSandbox().postRequestByName(requestName, [geom, {
                layerId: this.getVectorLayerId(),
                clearPrevious: true,
                layerOptions: null,
                centerTo: true,
                featureStyle: COVERAGE_FEATURE_STYLE
            }]);
        },
        /**
         * @method removeFeaturesFromMap
         * Removes features from map.
         *
         * @param {String} identifier the identifier
         * @param {String} value the identifier value
         */
        removeFeaturesFromMap: function (identifier, value) {
            this.sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [identifier, value, this.getVectorLayerId()]);
        },
        /**
         * @method startDrawing
         * Start drawing a feature for searching by coverage
         */
        startDrawing: function () {
            this.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [this.getName(), 'Box', {
                style: COVERAGE_FEATURE_STYLE
            }]);
        },
        /**
         * @method stopDrawing
         * Stop drawing
         */
        stopDrawing: function () {
            this.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [this.getName(), true]);
        },
        /**
         * @method addMapLayer
         * Add layer to map
         *
         * @param {number} layerId id of the layer to add
         */
        addMapLayer: function (layerId) {
            this.sandbox.postRequestByName('AddMapLayerRequest', [layerId]);
        },
        /**
         * @method removeMapLayer
         * Remove layer from map and set visibility to true
         *
         * @param {number} layerId id of the layer to add
         */
        removeMapLayer: function (layerId) {
            this.sandbox.postRequestByName('RemoveMapLayerRequest', [layerId]);
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            const sandbox = this.sandbox;

            Object.keys(this.eventHandlers).forEach(eventName => {
                sandbox.unregisterFromEventByName(this, eventName);
            });

            const reqBuilder = Oskari.requestBuilder('userinterface.RemoveExtensionRequest');
            this.sandbox.request(this, reqBuilder(this));

            this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'tabTitle');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * component
         */
        getDescription: function () {
            return this.loc('desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "metadata search" functionality
         */
        createUi: function () {
            // Metadata search tab
            this.renderSearch();
            const reqBuilder = Oskari.requestBuilder('Search.AddTabRequest');
            if (typeof reqBuilder === 'function') {
                const title = Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'tabTitle');
                const priority = this.tabPriority;
                this.sandbox.request(this, reqBuilder(title, this.contentElement, priority, this.id));
            } else {
                // add a tile and flyout if search is not present on the appsetup
                this.__addTileAndFlyout();
            }
        },

        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        renderSearch: function () {
            this.getReactRoot(this.contentElement).render(
                <LocaleProvider value={{ bundleKey: METADATA_BUNDLE_LOCALIZATION_ID }}>
                    <ThemeProvider>
                        <MetadataSearchContainer state={this.handler.getState()} controller={this.handler.getController()} />
                    </ThemeProvider>
                </LocaleProvider>);
        },

        /* ----------- Tile and Flyout ------------- */
        __addTileAndFlyout: function () {
            const request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
            this.getSandbox().request(this, request);
            // attach content to flyout when divmanazer has set up root element
            this.plugins['Oskari.userinterface.Flyout'].getEl().append(this.contentElement);
        },

        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.layerlist.Flyout
         * Oskari.mapframework.bundle.layerlist.Tile
         */
        startExtension: function () {
            const title = this.getTitle();
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create(
                'Oskari.userinterface.extension.DefaultTile', this, {
                    title
                });
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create(
                'Oskari.userinterface.extension.DefaultFlyout', this, {
                    title
                });
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        }
        /* ----------- /Tile and Flyout ------------- */
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);
