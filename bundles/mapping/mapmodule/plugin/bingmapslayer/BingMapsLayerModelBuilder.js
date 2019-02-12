const Style = Oskari.clazz.get('Oskari.mapframework.domain.Style');

export default class BingMapsLayerModelBuilder {
    parseLayerData (layer, mapLayerJson, maplayerService) {
        // Add Bing imagery sets as styles
        const roads = new Style();
        roads.setName('RoadOnDemand');
        roads.setTitle('Road');
        layer.addStyle(roads);

        const aerial = new Style();
        aerial.setName('Aerial');
        aerial.setTitle('Aerial');
        layer.addStyle(aerial);

        const aerialWithLabels = new Style();
        aerialWithLabels.setName('AerialWithLabels');
        aerialWithLabels.setTitle('Aerial With Labels');
        layer.addStyle(aerialWithLabels);

        layer.selectStyle(mapLayerJson.style || roads.getName());

        if (mapLayerJson.options) {
            layer.setOptions(mapLayerJson.options);
        }
    }
}
