import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { LayerViewTabs, LayerViewTabsHandler, TABS_ALL_LAYERS } from './view/LayerViewTabs/';

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
        this.tabsHandler = new LayerViewTabsHandler(this.instance);
        this.tabsHandler.getLayerListHandler().loadLayers();
        this.tabsHandler.addStateListener(() => this.render());
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
        },

        /**
         * Interface method implementation, does nothing atm
         * @method startPlugin
         */
        startPlugin: function () {
            this.render();
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () { },

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
         * For request handler. This is used when opening the layerlist from outside this bundle.
         * @param {string} activeFilterId
         */
        setActiveFilter: function (activeFilterId) {
            const filterHandler = this.tabsHandler.getLayerListHandler().getFilterHandler();
            this.tabsHandler.stashCurrentState();
            filterHandler.stashCurrentState();
            filterHandler.updateState({
                activeFilterId,
                searchText: null
            });
            this.tabsHandler.setTab(TABS_ALL_LAYERS);
        },

        /**
         * @method render
         * Renders React content
         */
        render: function () {
            if (!this.container) {
                return;
            }
            const content = (
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    <LayerViewTabs
                        {...this.tabsHandler.getState()}
                        controller={this.tabsHandler.getController()}/>
                </LocaleProvider>
            );
            ReactDOM.render(content, this.container);
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });
