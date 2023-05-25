/**
 * @class Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance
 *
 * Main component and starting point for the "featuredata" functionality.
 *
 * See Oskari.mapframework.bundle.featuredata.FeatureDataBundle for bundle definition.
 *
 */

import { FEATUREDATA_BUNDLE_ID } from "./view/FeatureDataContainer";

Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance',
    function () {},
    {
        /**
         * @static
         * @property __name
         */
        __name: 'FeatureData',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
        },
        getSandbox: function () {
            return this.sandbox;
        },
        start: function () {
            const sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox';
            this.sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox.register(this);
            this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');

            this.createUi();

            if ((this.conf && this.conf.selectionTools === true)) {
                this.popupHandler = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.PopupHandler', this);
                const addBtnRequestBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
                const btn = {
                    iconCls: 'tool-feature-selection',
                    tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.select.tooltip'),
                    sticky: true,
                    callback: () => this.popupHandler.showSelectionTools()
                };
                this.sandbox.request(this, addBtnRequestBuilder('featuredataSelectionTools', 'selectiontools', btn));

                this.selectionPlugin = this.sandbox.findRegisteredModuleInstance('MainMapModuleMapSelectionPlugin');

                if (!this.selectionPlugin) {
                    const config = {
                        id: this.getName()
                    };
                    this.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.plugin.MapSelectionPlugin', config, this.sandbox);
                    this.mapModule.registerPlugin(this.selectionPlugin);
                    this.mapModule.startPlugin(this.selectionPlugin);
                }
            }
        },
        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.plugin.FeaturedataPlugin', this.conf);
            this.mapModule.registerPlugin(this.plugin);
            this.mapModule.startPlugin(this.plugin);
        }
    });
