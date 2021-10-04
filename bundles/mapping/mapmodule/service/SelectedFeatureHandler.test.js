import '../../../../src/global';
import './WFSLayerService';

// Just used to register some event listeners so fake it
const sandbox = {
    registerForEventByName: () => {}
};
const service = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);
const layerId = 123;

describe('WFSLayerService', () => {
    test('click setWFSFeaturesSelections()', () => {
        service.setWFSFeaturesSelections(layerId, [1, 2], false);
        expect(service.getSelectedFeatureIds(layerId).length).toBe(2);
        service.setWFSFeaturesSelections(layerId, [3], false);
        expect(service.getSelectedFeatureIds(layerId).length).toBe(3);
        // unselect feature by using existing id
        service.setWFSFeaturesSelections(layerId, [3], false);
        const ids = service.getSelectedFeatureIds(layerId);
        expect(ids.length).toBe(2);
        expect(ids).toEqual(expect.arrayContaining([1, 2]));
        expect(ids).not.toContain(3);
    });

    test('selection tool setWFSFeaturesSelections()', () => {
        expect(service.getSelectedWFSLayerIds().length).toEqual(0);
        // using true clears old selections and makes new selection
        service.setWFSFeaturesSelections(layerId, [1, 2], true);
        const selections = service.getWFSSelections();
        expect(selections.length).toEqual(1);
        expect(selections[0].layerId).toEqual(layerId);
        expect(selections[0].featureIds.length).toEqual(2);
        // For some reason the layer isn't added here...
        expect(service.getSelectedWFSLayerIds().length).toEqual(0);
    });

    test('getSelectedWFSLayerIds()', () => {
        const layer = {
            getId: () => layerId
        };
        expect(service.getSelectedWFSLayerIds().length).toEqual(0);
        service.setWFSLayerSelection(layer, true);
        expect(service.getSelectedWFSLayerIds().length).toEqual(1);
        // from previous test
        let selections = service.getWFSSelections();
        expect(selections.length).toEqual(1);
        expect(selections[0].layerId).toEqual(layerId);
        expect(selections[0].featureIds.length).toEqual(2);
        // remove layer, check that selections are updated
        service.setWFSLayerSelection(layer, false);
        selections = service.getWFSSelections();
        expect(selections.length).toEqual(0);
    });
});
