/**
 * @class Oskari.mapframework.service.MapLayerServiceModelBuilder
 * Protocol/interface declaration for MapLayer JSON parser implementations.
 * Provides an interface for bundles to add custom map layer implementations/data.
 * Used to parse a JSON into a given maplayer object. Used in conjuntion with
 * Oskari.mapframework.service.MapLayerService.registerLayerModel() and
 * Oskari.mapframework.service.MapLayerService.registerLayerModelBuilder()
 */
Oskari.clazz.define('Oskari.mapframework.service.MapLayerServiceModelBuilder',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {}, {
        /**
         * @method parseLayerData
         * Interface method declaration. Implementation should do the parsing from JSON to MapLayer Object
         *
         * @param {Object} layer layer object
         * @param {Object} layerJson JSON data representing the map layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService
         * reference to map layer service
         */
        parseLayerData: function (layer, layerJson, maplayerService) {

        }
    });