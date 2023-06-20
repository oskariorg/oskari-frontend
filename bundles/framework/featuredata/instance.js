/**
 * @class Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance
 *
 * Main component and starting point for the "featuredata" functionality.
 *
 * See Oskari.mapframework.bundle.featuredata.FeatureDataBundle for bundle definition.
 *
 */

import { FEATUREDATA_BUNDLE_ID } from './view/FeatureDataContainer';
import { DRAW_REQUEST_ID, SelectToolPopupHandler } from './view/SelectToolPopupHandler.js';
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
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
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

        getMapModule: function () {
            return this.mapModule;
        },

        start: function () {
            const sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox';
            this.sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox.register(this);
            this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.registerForEventByName(this, p));

            this.createUi();

            if ((this.conf && this.conf.selectionTools === true)) {
                this.selectToolPopupHandler = new SelectToolPopupHandler(this);
                const addBtnRequestBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
                const btn = {
                    iconCls: 'tool-feature-selection',
                    tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.select.tooltip'),
                    sticky: true,
                    callback: () => this.selectToolPopupHandler.showSelectionTools()
                };
                this.getSandbox().request(this, addBtnRequestBuilder('featuredataSelectionTools', 'selectiontools', btn));
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
        },
        eventHandlers: {
            DrawingEvent: function (evt) {
                if (!evt.getIsFinished() || !this.selectToolPopupHandler) {
                    // only interested in finished drawings
                    return;
                }
                if (DRAW_REQUEST_ID !== evt.getId()) {
                    // event is from some other functionality
                    return;
                }
                const geojson = evt.getGeoJson();
                if (!geojson.features.length) {
                    // no features drawn
                    return;
                }

                this.selectToolPopupHandler.selectWithGeometry(geojson.features[0]);
            }
        }
    });
