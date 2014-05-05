/**
 * @class Oskari.mapframework.bundle.geometryeditor.service.LineSplitService
 * Methods for handling geometry editor
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometryeditor.service.LineSplitService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

        function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.loc = instance.getLocalization('GeometryEditor');
    }, {
        __name: "DrawFilterPlugin.LineSplitService",
        __qname: "Oskari.mapframework.bundle.geometryeditor.service.LineSplitService",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * Initializes the service
         */
        init: function () {

        },

        createGeometryEditorLayer: function() {

        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
