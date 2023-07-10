import { MetadataStateHandler } from './MetadataStateHandler';

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
        this.sandbox = Oskari.getSandbox();
        this.started = false;
        this.plugins = {};
        this.loc = Oskari.getMsg.bind(null, 'catalogue.bundle.metadatasearch');
        this.optionAjaxUrl = null;
        this.searchAjaxUrl = null;
        this.initUrls();
        this.id = 'oskari_metadatasearch_tabpanel_header';
        this._vectorLayerId = 'METADATASEARCH_VECTORLAYER';
        this.handler = new MetadataStateHandler(this);
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
            const me = this;

            if (me.started) {
                return;
            }

            me.started = true;

            const conf = me.conf;
            const sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            const sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;
            sandbox.register(me);
            // Default tab priority
            if (me.conf && typeof me.conf.priority === 'number') {
                me.tabPriority = me.conf.priority;
            }

            if (conf.noUI === true) {
                // bundle started by published map
                return;
            }

            // draw ui
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

                this.coverageButton.val(this.loc('deleteArea'));
                this.coverageButton[0].data = JSON.stringify(coverageFeature);
                this.coverageButton.prop('disabled', false).css({
                    'border-color': ''
                });
                this.drawCoverage = false;

                document.getElementById('oskari_metadatacatalogue_forminput_searchassistance').focus();
            },

            'userinterface.ExtensionUpdatedEvent': function (event) {
                const isShown = event.getViewState() !== 'close';

                // ExtensionUpdateEvents are fired a lot, only let metadatacatalogue extension event to be handled when enabled
                if (![this.getName(), 'Search'].includes(event.getExtension().getName())) {
                    // wasn't me or disabled -> do nothing
                    return;
                }

                if ((!isShown && this.drawCoverage === false) || event.getViewState() === 'close') {
                    this._teardownMetaSearch();
                }
            },
            'Search.TabChangedEvent': function (event) {
                if (event.getNewTabId() !== this.id) {
                    this._teardownMetaSearch();
                } else {
                    this.removeFeaturesFromMap(); // unactive show-area-icons when changing to metadata search tab
                }
            },
            'MetadataSearchResultEvent': function (event) {
                this.progressSpinner.stop();

                if (this.conf.noUI === true) {
                    // bundle started by published map --> not handle event
                    return;
                }
                if (event.hasSuccess()) {
                    this._showResults(event.getResults());
                } else {
                    this._showError(this.loc('metadatasearchservice_error'));
                }
            }
        },
        /**
         * @method _teardownMetaSearch
         * @private
         * Tears down meta data search when changing tab or closing flyout
         */
        _teardownMetaSearch: function () {
            this._stopCoverage();

            if (this.coverageButton) {
                this.coverageButton.val(this.loc('delimitArea'));
                this.coverageButton[0].data = '';
            }

            this.drawCoverage = true;
            this.removeFeaturesFromMap();
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
            return this.loc('tabTitle');
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
            const title = Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'tabTitle');
            const contentElement = document.createElement('div');

            this.handler.getController().renderMetadataSearch(contentElement);
            const priority = this.tabPriority;
            const reqBuilder = Oskari.requestBuilder('Search.AddTabRequest');

            if (typeof reqBuilder === 'function') {
                this.sandbox.request(this, reqBuilder(title, contentElement, priority, this.id));
            } else {
                // add a tile and flyout if search is not present on the appsetup
                this.__addTileAndFlyout();
            }
        },

        /* ----------- Tile and Flyout ------------- */
        __addTileAndFlyout: function () {
            const request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
            this.getSandbox().request(this, request);
            // attach content to flyout when divmanazer has set up root element
            this.plugins['Oskari.userinterface.Flyout'].getEl().append(this.metadataCatalogueContainer);
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
        },
        /* ----------- /Tile and Flyout ------------- */
        _showError: function (error) {
            this.searchPanel.hide();
            this.optionPanel.show();
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const okButton = dialog.createCloseButton('OK');

            dialog.setId('oskari_search_error_popup');
            dialog.makeModal();

            dialog.show(
                this.loc('metadataoptionservice_alert_title'),
                error, [okButton]
            );
        },

        _initCoverageButton: function (me, newButton) {
            this.coverageButton = newButton.find('.metadataCoverageDef');
            this.coverageButton.attr('value', me.loc('delimitArea'));
            this.coverageButton.attr('name', 'coverage');
            return this.coverageButton;
        },

        /**
         * @method _getOptionLocalization
         * Generates localization for option values
         */
        _getOptionLocalization: function (value) {
            var text;
            // Localization available?
            if (typeof value.locale !== 'undefined') {
                text = value.locale;
            } else {
                text = this.loc(value.val);
                if (typeof text !== 'string') {
                    text = value.val;
                }
            }
            return text;
        },

        _getCoverage: function () {
            this.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [this.getName(), 'Box', {
                style: this.__drawStyle
            }]);
        },

        _stopCoverage: function () {
            this.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [this.getName(), true]);
        },

        _addLayerLinks: function (layer, layerList) {
            const me = this;
            const selectedLayers = this.sandbox.findAllSelectedMapLayers();
            let layerSelected = selectedLayers.map(l => l.getId()).includes(layer.getId());
            const layerLink = this.templates.layerLink.clone();
            const showText = this.loc('show');
            const hideText = this.loc('hide');

            // Check if layer is already selected and visible
            if ((layerSelected) && (layer.isVisible())) {
                layerLink.html(hideText);
            } else {
                layerLink.html(showText);
            }

            // Click binding
            layerLink.on('click', function () {
                // Hide layer
                if (jQuery(this).html() === hideText) {
                    // Set previously selected layer only invisible
                    var builder = Oskari.requestBuilder('RemoveMapLayerRequest');
                    layerSelected = false;
                    me.sandbox.request(me.getName(), builder(layer.getId()));
                    jQuery(this).html(showText);
                } else {
                    // Select previously unselected layer
                    if (!layerSelected) {
                        me.sandbox.postRequestByName('AddMapLayerRequest', [layer.getId()]);
                    }
                    // Set layer visible
                    var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
                    me.sandbox.request(me.getName(), visibilityRequestBuilder(layer.getId(), true));
                    jQuery(this).html(hideText);
                }
            });
            const layerListItem = me.templates.layerListItem.clone();
            layerListItem.text(layer.getName());
            layerListItem.append('&nbsp;&nbsp;');
            layerListItem.append(layerLink);
            layerList.append(layerListItem);
        },

        /**
         * @method _sortResults
         * Sorts the last search result by comparing given attribute on
         * the search objects
         * @private
         * @param {String} pAttribute attributename to sort by (e.g.
         * result[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         */
        _sortResults: function (pAttribute, pDescending) {
            const me = this;

            if (!this.lastResult) {
                return;
            }
            this.lastSort = {
                attr: pAttribute,
                descending: pDescending
            };
            this.lastResult.sort(function (a, b) {
                return me._searchResultComparator(a, b, pAttribute, pDescending);
            });
        },
        /**
         * @method _searchResultComparator
         * Compares the given attribute on given objects for sorting
         * search result objects.
         * @private
         * @param {Object} a search result 1
         * @param {Object} b search result 2
         * @param {String} pAttribute attributename to sort by (e.g.
         * a[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         */
        _searchResultComparator: function (a, b, pAttribute, pDescending) {
            var nameA = a[pAttribute].toLowerCase();
            var nameB = b[pAttribute].toLowerCase();
            var value = 0;
            if (nameA === nameB) {
                nameA = a.id;
                nameB = b.id;
            }
            if (nameA < nameB) {
                value = -1;
            } else if (nameA > nameB) {
                value = 1;
            }
            if (pDescending) {
                value = value * -1;
            }
            return value;
        },
        /**
        * @method addSearchResultAction
        * Add search result action.
        * @public
        * @param {jQuery} actionElement jQuery action element
        * @param {Function} callback the callback function
        * @param {String} bindCallbackTo the jQuery selector where to bind click operation
        * @param {String} actionTextElement action text jQuery selector. If it's null then text showed on main element
        * @param {String} actionText action text
        * @param {Function} showAction function. If return true then shows action text. Optional.
        */
        addSearchResultAction: function (actionElement, actionTextElement, callback, bindCallbackTo, actionText, showAction) {
            const status = {
                actionElement: actionElement,
                actionTextElement: actionTextElement,
                callback: callback,
                bindCallbackTo: bindCallbackTo,
                actionText: actionText,
                showAction: function (metadata) { return true; }
            };

            if (showAction && showAction !== null) {
                status.showAction = showAction;
            }

            this.searchResultActions.push(status);
        },
        /**
        * @method _isAction
        * @private
        * @return {Boolean} is action
        */
        _isAction: function () {
            return this.searchResultActions.length > 0;
        }
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
