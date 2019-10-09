import React from 'react';
import ReactDOM from 'react-dom';
import { LayerList } from './view/LayerList';
/**
 * @class Oskari.mapframework.bundle.layerlist.Flyout
 *
 * Renders the "all layers" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerlist.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.layerlist.LayerListBundleInstance} instance
     *    reference to component that created the flyout
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.template = null;
        this.state = null;
        this.layerTabs = [];
        this.filters = [];
        this._filterNewestCount = 20;
        this.mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
        this.addedButtons = {};
        this.filterComponents = [];
    }, {

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.layerlist.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, flyout, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('layerlist')) {
                jQuery(this.container).addClass('layerlist');
            }
            if (!flyout.hasClass('layerlist')) {
                flyout.addClass('layerlist');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var elParent = this.container.parentElement.parentElement;
            var elId = jQuery(elParent).find('.oskari-flyouttoolbar .oskari-flyouttools .oskari-flyouttool-close');
            elId.attr('id', 'oskari_layerselector2_flyout_oskari_flyouttool_close');

            this.addNewestFilter();
        },
        /**
         * Create filterbuttons for each active filter
         * @method  @public createFilterButtons
         */
        createFilterButtons: function () {
            console.warn('Flyout.createFilterButtons is deprecated');
        },
        setActiveFilter: function (filter) {
            console.warn('Flyout.setActiveFilter is deprecated');
        },
        updateFilters: function () {
            console.warn('Flyout.updateFilters is deprecated');
        },
        /**
         * Add newest filter.
         * @method  @public addNewestFilter
         */
        addNewestFilter: function () {
            var me = this;
            var loc = me.instance.getLocalization('layerFilter');

            me.layerlistService.registerLayerlistFilterButton(loc.buttons.newest,
                loc.tooltips.newest.replace('##', me._filterNewestCount), {
                    active: 'layer-newest',
                    deactive: 'layer-newest-disabled'
                },
                'newest');
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
         *     close/minimize/maximize etc
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * Set content state
         * @method  @public setContentState
         * @param {Object} state a content state
         */
        setContentState: function (state) {
            console.warn('Unimplemented setContentState');
        },

        getContentState: function () {
            console.warn('Unimplemented getContentState');
            var state = {};
            return state;
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            ReactDOM.render(<LayerList showOrganizations locale={this.instance._localization}></LayerList>, this.container);
        },

        /**
         * @public @method focus
         * Focuses the first panel's search field (if available)
         *
         *
         */
        focus: function () {
            if (this.layerTabs && this.layerTabs.length) {
                this.layerTabs[0].focus();
            }
        },

        /**
         * Populate layer lists.
         * @method  @public populateLayers
         */
        populateLayers: function () {
            console.log('Deprecated function populateLayers called');
            this.createUi();
        },

        /**
         * @method handleLayerSelectionChanged
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
         *           layer that was changed
         * @param {Boolean} isSelected
         *           true if layer is selected, false if removed from selection
         * let's refresh ui to match current layer selection
         */
        handleLayerSelectionChanged: function (layer, isSelected) {
            this.layerTabs.forEach(function (tab) {
                tab.setLayerSelected(layer.getId(), isSelected);
            });
        },

        /**
         * @method handleLayerModified
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer that was modified
         * let's refresh ui to match current layers
         */
        handleLayerModified: function (layer) {
            this.layerTabs.forEach(function (tab) {
                tab.updateLayerContent(layer.getId(), layer);
            });
        },

        /**
         * @method handleLayerSticky
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer thats switch off diasable/enable is changed
         * let's refresh ui to match current layers
         */
        handleLayerSticky: function (layer) {
            this.layerTabs.forEach(function (tab) {
                tab.updateLayerContent(layer.getId(), layer);
            });
        },

        /**
         * @method handleLayerAdded
         */
        handleLayerAdded: function () {
            this.createUi();
            // we could just add the layer to correct group and update the layer count for the group
            // but saving time to do other finishing touches
        },

        /**
         * @method handleLayerRemoved
         */
        handleLayerRemoved: function () {
            this.createUi();
            // we could  just remove the layer and update the layer count for the group
            // but saving time to do other finishing touches
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });
