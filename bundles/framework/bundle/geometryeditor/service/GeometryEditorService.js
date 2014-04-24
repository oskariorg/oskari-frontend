/**
 * @class Oskari.mapframework.bundle.geometryeditor.GeometryEditorService
 * Methods for handling geometry editor
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometryeditor.service.GeometryEditorService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

        function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.loc = instance.getLocalization('AnalyseView');
    }, {
        __name: "GeometryEditor.GeometryEditorService",
        __qname: "Oskari.mapframework.bundle.geometryeditor.service.GeometryEditorService",

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
