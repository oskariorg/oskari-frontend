
import '../../../../src/global';
import { VectorFeatureSelectionService } from './VectorFeatureSelectionService';

// Fake sandbox and mapmodule
const sandbox = {
    findMapLayerFromAllAvailable: () => layer,
    registerForEventByName: () => 'no-op'
};

const layer = {
    getId: () => 123
};

const handler = new VectorFeatureSelectionService(sandbox);

describe('VectorFeatureSelectionService', () => {
    const layerId = layer.getId();

    test('setFeatureSelectionsByIds()', () => {
        let currentSelection;
        let previousSelection;
        handler.on('change', ([layer, current, previous]) => {
            expect(layer).toBe(layerId);
            currentSelection = current;
            previousSelection = previous;
        });

        handler.setSelectedFeatureIds(layerId, ['f_0', 'f_1'], true);
        expect(handler.getSelectedFeatureIdsByLayer(layerId).length).toBe(2);
        expect(previousSelection.length).toBe(0);
        expect(currentSelection.length).toBe(2);

        handler.addSelectedFeature(layerId, 'f_2');
        expect(handler.getSelectedFeatureIdsByLayer(layerId).length).toBe(3);
        expect(previousSelection.length).toBe(2);
        expect(currentSelection.length).toBe(3);

        // unselect feature by using existing id
        handler.removeSelection(layerId, 'f_1');
        expect(previousSelection.length).toBe(3);
        expect(currentSelection.length).toBe(2);

        const ids = handler.getSelectedFeatureIdsByLayer(layerId);
        expect(ids.length).toBe(2);
        expect(ids).toEqual(expect.arrayContaining(['f_0', 'f_2']));
        expect(ids).not.toContain('f_1');
    });
});
