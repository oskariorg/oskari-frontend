import '../../../../service/search/searchservice';
import React from 'react';
import { SearchHandler } from './SearchHandler';
import { SearchBar } from './components/SearchBar';
import { ThemeProvider } from 'oskari-ui/util';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mappublished.SearchPlugin
 * Provides a search functionality and result panel for published map.
 * Uses same backend as search bundle:
 * http://www.oskari.org/trac/wiki/DocumentationBundleSearchBackend
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *     JSON config with params needed to run the plugin
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin';
        me._defaultLocation = 'top left';
        me._index = 0;
        me._name = 'SearchPlugin';
        me._reactRoot = null;
    }, {

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         * Initializes ui templates.
         */
        _initImpl: function () {
            this.fieldPlaceHolder = Oskari.getMsg('MapModule', 'plugin.SearchPlugin.placeholder');
            this.template = jQuery('<div class="mapplugin search default-search-div" />');
        },

        /**
         * @private @method _createControlElement
         * Creates UI for search functionality and places it on the maps
         * div where this plugin registered.
         */
        _createControlElement: function () {
            return this.template.clone();
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        refresh: function () {
            let el = this.getElement();
            if (!el) {
                return;
            }
            if (!this.handler) {
                // init handler here so we can be sure we have a sandbox for this instance
                this.handler = new SearchHandler(this);
                this.handler.addStateListener(() => this.refresh());
            }

            this.getReactRoot(el[0]).render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <SearchBar
                        state={this.handler.getState()}
                        controller={this.handler.getController()}
                        placeholder={this.fieldPlaceHolder}
                    />
                </ThemeProvider>
            );
        },

        teardownUI: function () {
            if (this.handler) {
                this.handler.teardown();
            }
        },
        /**
        * @method _stopPluginImpl
        * Interface method for the plugin protocol.
        * Should unregisters requesthandlers and
        * eventlisteners.
        *
        *
        */
        _stopPluginImpl: function () {
            // Remove search results
            this.teardownUI();
            this.removeFromPluginContainer(this.getElement());
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} modeChanged is the ui mode changed (mobile/desktop)
         */
        redrawUI: function (mapInMobileMode, modeChanged) {
            if (!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }
            var me = this;
            if (!me.getElement()) {
                me._element = me._createControlElement();
            }

            // remove old element
            this.teardownUI();
            this.addToPluginContainer(me._element);
            me.refresh();
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
