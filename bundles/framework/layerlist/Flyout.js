import React from 'react';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { LayerViewTabs, LayerViewTabsHandler, TABS_ALL_LAYERS, TABS_SELECTED_LAYERS } from './view/LayerViewTabs/';
import { LAYER_GROUP_TOGGLE_LIMIT, LAYER_GROUP_TOGGLE_DEFAULTS, BACKEND_STATUS_AVAILABLE } from './constants';
import { createRoot } from 'react-dom/client';

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
        // the show "add all layers to map" control for groups is disabled by default. Use instance conf to enable it.
        // view/bundle modifier adds backend status available conf if bundle is present
        const defaultOpts = {
            [LAYER_GROUP_TOGGLE_LIMIT]: LAYER_GROUP_TOGGLE_DEFAULTS.DISABLE_TOGGLE,
            [BACKEND_STATUS_AVAILABLE]: false
        };
        const instanceConf = this.instance.conf || {};
        this.optsForUI = {
            ...defaultOpts,
            ...instanceConf
        };
        this.container = null;
        this.tabsHandler = new LayerViewTabsHandler(this.instance);
        this.tabsHandler.getLayerListHandler().loadLayers();
        this.tabsHandler.addStateListener(() => this.render());
        this._reactRoot = null;
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
        setActiveFilter: function (activeFilterId, showSelectedLayers) {
            const filterHandler = this.tabsHandler.getLayerListHandler().getFilterHandler();
            filterHandler.stashCurrentState();
            filterHandler.updateState({
                activeFilterId,
                searchText: null
            });
            const activeTab = showSelectedLayers ? TABS_SELECTED_LAYERS : TABS_ALL_LAYERS;
            this.tabsHandler.setTab(activeTab);
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
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
                    <ThemeProvider>
                        <LayerViewTabs
                            {...this.tabsHandler.getState()}
                            opts={this.optsForUI}
                            controller={this.tabsHandler.getController()}/>
                    </ThemeProvider>
                </LocaleProvider>
            );
            this.getReactRoot(this.container).render(content);
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });
