import React from 'react';
import ReactDOM from 'react-dom';
import { LayerViewTabs } from './view/LayerViewTabs/';
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
        this.log = Oskari.log('layerlist');
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
         * Interface method implementation, does nothing atm
         */
        startPlugin: function () { },
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
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () { },

        /**
         * Set content state
         * @method  @public setContentState
         * @param {Object} state a content state
         */
        setContentState: function (state) {
            // TODO; Set filter and selected tab
            this.log.warn('Called an unimplemented function: setContentState');
        },

        getContentState: function () {
            // TODO; Get filter and selected tab
            this.log.warn('Called an unimplemented function: getContentState');
            return {};
        },

        setActiveFilter: function () {
            // TODO; Called from ShowFilteredLayerListRequestHandler
            this.log.warn('Called an unimplemented function: setActiveFilter');
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            ReactDOM.render(<LayerViewTabs showOrganizations instance={this.instance} locale={this.instance.getLocalization() } />, this.container);
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });
