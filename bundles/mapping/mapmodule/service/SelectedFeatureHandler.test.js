import { SelectedFeatureHandler } from './SelectedFeatureHandler';
import { WFS_ID_KEY } from '../domain/constants';

import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olFeature from 'ol/Feature';
import olStyle from 'ol/style/Style';

// Fake sandbox and mapmodule
const sandbox = {
    findMapLayerFromSelectedMapLayers: () => layer
};
const mapmodule = {
    getOLMapLayers: () => [olLayer],
    getStyleForLayer: () => style
};

const layer = {
    getId: () => 123
};
const fids = ['f_0', 'f_1', 'f_2'];
const style = new olStyle();
const source = new olSourceVector();
const olLayer = new olLayerVector({ source });

const handler = new SelectedFeatureHandler(sandbox, mapmodule);
// no need to send events, fake it
handler.notify = () => {};

describe('SelectedFeatureHandler', () => {
    const features = fids.map(fid => {
        const feature = new olFeature();
        feature.setId(fid);
        feature.set(WFS_ID_KEY, fid);
        return feature;
    });
    source.addFeatures(features);

    const layerId = layer.getId();

    test('setFeatureSelectionsByIds()', () => {
        const select1 = fids.slice(0, 2);
        const select2 = fids.slice(2, 3);

        handler.setFeatureSelectionsByIds(layerId, select1, true);
        expect(handler.getSelectedFeatureIds(layerId).length).toBe(2);
        handler.setFeatureSelectionsByIds(layerId, select2, true);
        expect(handler.getSelectedFeatureIds(layerId).length).toBe(3);
        // unselect feature by using existing id
        handler.setFeatureSelectionsByIds(layerId, select2, true);
        const ids = handler.getSelectedFeatureIds(layerId);
        expect(ids.length).toBe(2);
        expect(ids).toEqual(expect.arrayContaining(select1));
        expect(ids).not.toContain(select2[0]);
    });

    test('setFeaturesSelections()', () => {
        // create new selection
        handler.setFeaturesSelections(layer, features.slice(0, 1), false);
        expect(handler.getSelectedFeatureIds(layerId).length).toBe(1);
    });

    test('removeLayerSelections()', () => {
        // from previous test
        const selections = handler.getSelections();
        expect(selections.length).toEqual(1);
        expect(selections[0].layerId).toEqual(layerId);
        expect(selections[0].featureIds.length).toEqual(1);
        handler.removeLayerSelections(layer);
        expect(handler.getSelectedFeatureIds(layerId).length).toBe(0);
        expect(handler.getSelections().length).toBe(0);
    });

    test('feature styling', () => {
        expect(features.every(f => !f.getStyle())).toBe(true);
        handler.setFeatureSelectionsByIds(layerId, [fids[0]], true);
        handler.setFeaturesSelections(layer, [features[1]], true);
        expect(features.slice(0, 2).every(f => f.getStyle() === style)).toBe(true);
        expect(features[2].getStyle()).toBeUndefined();

        handler.setFeatureSelectionsByIds(layerId, [fids[0]], true);
        expect(features[0].getStyle()).toBeUndefined();

        handler.setFeaturesSelections(layer, [features[2]], false);
        expect(features[2].getStyle()).toEqual(style);
        expect(features.slice(0, 2).every(f => !f.getStyle())).toBe(true);

        handler.removeAllSelections();
        expect(features.every(f => !f.getStyle())).toBe(true);
    });
});
