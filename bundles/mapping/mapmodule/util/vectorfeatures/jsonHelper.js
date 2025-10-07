import olFormatGeoJSON from 'ol/format/GeoJSON';
import olFeature from 'ol/Feature';
import olRenderFeature from 'ol/render/Feature';
import { fromExtent } from 'ol/geom/Polygon';
import { processFeatureProperties } from '../../plugin/wfsvectorlayer/WfsVectorLayerPlugin/util/props';

const featureFormatter = new olFormatGeoJSON();
/**
 * @method getGeojsonFromOlFeature
 *
 * Returns geojson feature collection for feature.
 * If the feature is read-only (olRenderFeature), the geometry of GeoJSON feature is the feature's extent.
 *
 * @param {olFeature | olRenderFeature} feature
 * @return geojson FeatureCollection
 */
export const getFeatureAsFeatureCollection = (feature) => {
    if (feature instanceof olRenderFeature) {
        const polygon = fromExtent(feature.getExtent());
        const ftr = new olFeature(polygon);
        ftr.setProperties(feature.getProperties());
        return featureFormatter.writeFeaturesObject([ftr]);
    } else {
        return featureFormatter.writeFeaturesObject([feature]);
    }
};

/**
 * @method getGeojsonFromOlFeature
 *
 * Transforms OpenLayers feature object to a GeoJSON feature.
 * If the feature is read-only (olRenderFeature), the geometry of GeoJSON feature is the feature's extent.
 *
 * @param {olFeature | olRenderFeature} feature
 * @return geojson Feature
 */
export const getFeatureAsGeojson = (olFeature) => {
    const featureCollection = getFeatureAsFeatureCollection(olFeature);
    if (!featureCollection || !featureCollection.features || !featureCollection.features.length) {
        return null;
    }
    const feature = featureCollection.features[0];
    return {
        ...feature,
        properties: processFeatureProperties(feature.properties)
    };
};
