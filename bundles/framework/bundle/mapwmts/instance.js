/**
 * @class Oskari.mapframework.bundle.MapWmtsBundleInstance
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.MapWmtsBundleInstance",
    function (b) {
        this.name = 'MapWmts';
        this.mediator = null;
        this.sandbox = null;

        this.service = null;

        /**
         * These should be SET BY Manifest end
         */

        this.ui = null;
    },
    /*
     * prototype
     */
    {

        /**
         * start bundle instance
         *
         */
        "start": function () {

            if (this.mediator.getState() === "started") {
                return;
            }

            var me = this;
            var conf = me.conf;
            var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            var sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox = sandbox;

            /**
             * We'll need MapLayerService
             */
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

            /*
             * We'll register a handler for our type
             */
            mapLayerService.registerLayerModel('wmtslayer', 'Oskari.mapframework.wmts.domain.WmtsLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');

            mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);

            /**
             * We'll need WMTSLayerService
             */
            var service = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', mapLayerService);
            this.service = service;

            this.mediator.setState("started");
            return this;
        },
        /**
         * notifications from bundle manager
         */
        "update": function (manager, b, bi, info) {
            manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
        },
        /**
         * stop bundle instance
         */
        "stop": function () {

            this.mediator.setState("stopped");

            return this;
        },
        getName: function () {
            return this.__name;
        },
        __name: "Oskari.mapframework.bundle.MapWmtsBundleInstance"

    },
    {
        "protocol": ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
    }
);