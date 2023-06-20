import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { LayerRightsHandler } from './handler/layerRightsHandler';
import { LayerRights } from './view/LayerRights';

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
        var me = this;
        me.instance = instance;
        me.handler = null;
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
            this.container = el[0];
            if (!jQuery(this.container).hasClass('admin-permissions')) {
                jQuery(this.container).addClass('admin-permissions');
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
            this.handler = new LayerRightsHandler(() => this.setContent());
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
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @method setContent
         * Renders flyout content
         */
        setContent: function () {
            const flyout = jQuery(this.container);

            flyout.empty();

            const layerRightsContainer = jQuery('<div />');
            flyout.append(layerRightsContainer);
            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'admin-permissions' }}>
                    <ThemeProvider>
                        <LayerRights
                            controller={this.handler.getController()}
                            state={this.handler.getState()}
                        />
                    </ThemeProvider>
                </LocaleProvider>,
                layerRightsContainer[0]
            );
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
