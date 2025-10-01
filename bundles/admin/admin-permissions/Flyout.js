import React from 'react';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { LayerRightsHandler } from './handler/layerRightsHandler';
import { LayerRights } from './view/LayerRights';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.admin.bundle.admin-layerrights.Flyout
 *
 * Renders the layer rights management flyout.
 */
Oskari.clazz.define('Oskari.admin.bundle.admin-permissions.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.admin.bundle.admin-layerrights.AdminPermissionsBundleInstance}
     *        instance reference to component that created the tile
     */
    function (instance) {
        this.instance = instance;
        this.handler = null;
        this._reactRoot = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.admin.bundle.admin-permissions.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, flyout, width, height) {
            this.container = jQuery(el[0]);
            if (!this.container.hasClass('admin-permissions')) {
                this.container.addClass('admin-permissions');
            }
            if (!flyout.hasClass('admin-permissions')) {
                flyout.addClass('admin-permissions');
            }
        },

        /**
         * @method startPlugin
         *
         * Plugin start
         */
        startPlugin: function () {
            this.handler = new LayerRightsHandler(this.instance, () => this.renderContent());
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
            return this.instance.loc('flyout.title');
        },

        /**
         * Reset flyout to clear unsaved changes etc.
         */
        resetFlyout: function () {
            if (this.handler) {
                this.handler.reset(true);
            }
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        /**
         * @method renderContent
         * Renders flyout content
         */
        renderContent: function () {
            this.getReactRoot(this.container[0]).render(
                <LocaleProvider value={{ bundleKey: 'admin-permissions' }}>
                    <ThemeProvider>
                        <LayerRights
                            controller={this.handler.getController()}
                            state={this.handler.getState()}
                        />
                    </ThemeProvider>
                </LocaleProvider>
            );
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });
