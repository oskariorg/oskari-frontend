/*
 * @class
 */
Oskari.clazz.define('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder', function () {

}, {
    /**
     * parses any additional fields to model
     */
    parseLayerData: function (layer, mapLayerJson, maplayerService) {
        // TODO: could we detect styles array in maplayer service and
        //  populate styles automatically without this modelbuilder?
        maplayerService.populateStyles(layer, mapLayerJson);
    }
});
