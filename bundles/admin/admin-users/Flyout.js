import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { AdminUsersHandler } from './handler/AdminUsersHandler';
import { AdminUsersFlyout } from './view/AdminUsersFlyout';
import { createRoot } from 'react-dom/client';
/**
 * @class Oskari.mapframework.bundle.admin-users.Flyout
 *
 * Renders the "admin users" flyout.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.admin-users.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param
     * {Oskari.mapframework.bundle.admin-users.LayerSelectionBundleInstance}
     * instance
     *      reference to component that created the tile
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.container = null;
        this.handler = null;
        this._reactRoot = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.admin-users.Flyout';
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

            if (!this.container.hasClass('admin-users')) {
                this.container.addClass('admin-users');
            }
            if (!flyout.hasClass('admin-users')) {
                flyout.addClass('admin-users');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.createUI();
        },

        /* App specific methods */
        createUI: function () {
            this.renderContent();
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        renderContent: function () {
            const handler = this.getHandler();
            this.getReactRoot(this.container[0]).render(
                <LocaleProvider value={{ bundleKey: 'AdminUsers' }}>
                    <AdminUsersFlyout state={handler.getState()} controller={handler.getController()} isExternal={this.instance?.conf?.isExternal} />
                </LocaleProvider>
            );
        },
        getHandler: function () {
            if (!this.handler) {
                this.handler = new AdminUsersHandler(this.instance.conf, () => this.renderContent());
            }
            return this.handler;
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
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.loc('flyout.desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * Interface method implementation, does nothing atm
         */
        setState: function () {}
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
