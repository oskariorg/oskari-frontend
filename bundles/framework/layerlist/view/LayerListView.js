import React from 'react';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { LayerViewTabs, LayerViewTabsHandler, TABS_ALL_LAYERS, TABS_SELECTED_LAYERS } from './LayerViewTabs/';
import { LAYER_GROUP_TOGGLE_LIMIT, LAYER_GROUP_TOGGLE_DEFAULTS, BACKEND_STATUS_AVAILABLE } from '../constants';

export class LayerListView {
    constructor (instance, onChange) {
        this.instance = instance;
        this.onChange = onChange;
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
        this.tabsHandler = new LayerViewTabsHandler(this.instance);
        this.tabsHandler.getLayerListHandler().loadLayers();
        this.tabsHandler.addStateListener(() => this.onChange?.());
    }

    stop () {
        this.onChange = null;
        const sandbox = this.instance.getSandbox();
        const layerListHandler = this.tabsHandler.getLayerListHandler();
        [this.tabsHandler, layerListHandler.getFilterHandler(), layerListHandler.getCollapseHandler()]
            .forEach((handler) => {
                Object.keys(handler.eventHandlers)
                    .forEach((eventName) => sandbox.unregisterFromEventByName(handler, eventName));
            });
    }

    /**
     * For request handler. This is used when opening the layerlist from outside this bundle.
     * @param {string} activeFilterId
     */
    setActiveFilter (activeFilterId, showSelectedLayers) {
        const filterHandler = this.tabsHandler.getLayerListHandler().getFilterHandler();
        filterHandler.stashCurrentState();
        filterHandler.updateState({
            activeFilterId,
            searchText: null
        });
        const activeTab = showSelectedLayers ? TABS_SELECTED_LAYERS : TABS_ALL_LAYERS;
        this.tabsHandler.setTab(activeTab);
    }

    getContent () {
        return (
            <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                <ThemeProvider>
                    <LayerViewTabs
                        {...this.tabsHandler.getState()}
                        opts={this.optsForUI}
                        controller={this.tabsHandler.getController()}/>
                </ThemeProvider>
            </LocaleProvider>
        );
    }
}
