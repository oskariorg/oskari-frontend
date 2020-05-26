import '../../../../src/global';
import './WFSLayerService';

const sandbox = {
    registerForEventByName: () => {}
};
const service = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);
const layerId = 123;

describe('WFSLayerService', () => {
    test('setWFSFeaturesSelections()', () => {
        expect(service.getSelectedWFSLayerIds().length).toEqual(0);
        service.setWFSFeaturesSelections(layerId, [1, 2], true);
        const selections = service.getWFSSelections();
        expect(selections.length).toEqual(1);
        expect(selections[0].layerId).toEqual(layerId);
        expect(selections[0].featureIds.length).toEqual(2);
    });
});
