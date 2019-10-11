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
        this._filterNewestCount = 20;
        this.layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
        this.addedButtons = {};
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
         * Add newest filter.
         * @method  @public addNewestFilter
         */
        addNewestFilter: function () {
            const loc = this.instance.getLocalization('layerFilter');
            this.layerlistService.registerLayerlistFilterButton(loc.buttons.newest,
                loc.tooltips.newest.replace('##', this._filterNewestCount), {
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
            console.warn('Unimplemented layer list flyout function: setContentState');
        },

        getContentState: function () {
            console.warn('Unimplemented layer list flyout function: getContentState');
            return {};
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            ReactDOM.render(<LayerList showOrganizations instance={this.instance} />, this.container);
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });
