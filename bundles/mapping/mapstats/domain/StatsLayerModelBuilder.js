/*
 * @class Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder
 * JSON-parsing for stats layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder', function (sandbox) {
    this.localization = Oskari.getLocalization("MapStats");
    this.sandbox = sandbox;
}, {
    /**
     * parses any additional fields to model
     * @param {Oskari.mapframework.bundle.mapstats.domain.StatsLayer} layer partially populated layer
     * @param {Object} mapLayerJson JSON presentation of the layer
     * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
     */
    parseLayerData: function (layer, mapLayerJson, maplayerService) {

        var me = this;
        //  Default field name  for to link map features in stats visualization
        if (mapLayerJson.visualizations) {
            layer.setFilterPropertyName(mapLayerJson.visualizations[0].filterproperty);
        }
        // Populate layer tools
        var toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');

        // Statistics
        var tool1 = toolBuilder(),
            locTool = me.localization.tools.table_icon;
        tool1.setName("table_icon");
        tool1.setTitle(locTool.title);
        tool1.setTooltip(locTool.tooltip);
        //tool1.setIconCls("icon-restore");
        tool1.setCallback(function () {
            me.sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, layer]);
        });
        layer.addTool(tool1);

        // TODO: set this with actual data after structural changes
        // in map layers have taken place.
        layer.setCategoryMappings({
            'categories': [
                'KUNTA',
                'ALUEHALLINTOVIRASTO',
                'MAAKUNTA',
                'NUTS1',
                'SAIRAANHOITOPIIRI',
                //'SUURALUE',
                'SEUTUKUNTA',
                'ERVA',
                'ELY-KESKUS'
            ],
            'wmsNames': {
                'KUNTA': 'oskari:kunnat2013',
                'ALUEHALLINTOVIRASTO': 'oskari:avi',
                'MAAKUNTA': 'oskari:maakunta',
                'NUTS1': 'oskari:nuts1',
                'SAIRAANHOITOPIIRI': 'oskari:sairaanhoitopiiri',
                //'SUURALUE': 'oskari:',
                'SEUTUKUNTA': 'oskari:seutukunta',
                'ERVA': 'oskari:erva-alueet',
                'ELY-KESKUS': 'oskari:ely'
            },
            'filterProperties': {
                'KUNTA': 'kuntakoodi',
                'ALUEHALLINTOVIRASTO': 'avi_nro',
                'MAAKUNTA': 'maakuntanro',
                'NUTS1': 'code',
                'SAIRAANHOITOPIIRI': 'sairaanhoitopiirinro',
                //'SUURALUE': '',
                'SEUTUKUNTA': 'seutukuntanro',
                'ERVA': 'erva_numero',
                'ELY-KESKUS': 'ely_nro'
            }
        });
    }
});
