import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { AdminUsersHandler } from './handler/AdminUsersHandler';
import { AdminUsersFlyout } from './view/AdminUsersFlyout';
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
        this.state = {};
        this.tabsContainer = null;
        this._localization = this.instance.getLocalization('flyout');
        this.handler = null;
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
            if (this.tabsContainer) {
                return;
            }
            this.handler = new AdminUsersHandler(this.instance.conf.restUrl, this.instance.conf.isExternal, this.instance.conf.requirements, () => this.renderContent());
            this.renderContent();
        },
        renderContent: function () {
            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'AdminUsers' }}>
                    <AdminUsersFlyout state={this.handler.getState()} controller={this.handler.getController()} isExternal={this.instance.conf.isExternal} />
                </LocaleProvider>,
                this.container[0]
            );
        },
        /**
         * @method _getLocalization
         */
        _getLocalization: function (key) {
            return this._localization[key];
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
            return this._getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this._getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {Object} state
         *     state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
