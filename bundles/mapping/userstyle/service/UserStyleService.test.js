import { UserStyleService } from './UserStyleService';
import { VectorStyle } from '../../mapmodule/domain/VectorStyle';

// fake sandbox
const sandbox = {
    findMapLayerFromAllAvailable: () => {}
};
const layerId = 1;
const id = 's_1';
const type = 'user';
const style = new VectorStyle({ id, name: 'My own style', type });

describe('saveUserStyle function ', () => {
    const service = new UserStyleService(sandbox);
    test('adds style correctly when styles with given layerId and style name does not exists', () => {
        service.saveUserStyle(layerId, style);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(style);
    });
    test('adds style correctly when styles with given layerId exists but not with given style name', () => {
        const secondStyle = new VectorStyle({ id: 's_2', name: 'My second style', type });
        service.saveUserStyle(layerId, secondStyle);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(style);
        expect(result[1]).toEqual(secondStyle);
    });
    test('saves style correctly when style with given layerId and given style name exists', () => {
        const name = 'Updated title';
        const style = {
            featureStyle: {
                fill: 'some val'
            }
        };
        const updatedStyle = new VectorStyle({ id, name, type, style });
        service.saveUserStyle(layerId, updatedStyle);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(2);
        const saved = result[0];
        expect(saved).toEqual(updatedStyle);
        expect(saved.getTitle()).toEqual(name);
        expect(saved.getFeatureStyle()).toEqual(style.featureStyle);
    });
});

describe('removeUserStyle function ', () => {
    const service = new UserStyleService(sandbox);
    test('removes user style correctly when found', () => {
        service.saveUserStyle(layerId, style);
        const result1 = service.getUserStylesForLayer(layerId);
        expect(result1.length).toEqual(1);
        service.removeUserStyle(layerId, style.getName());
        const result2 = service.getUserStylesForLayer(layerId);
        expect(result2.length).toEqual(0);
    });
});
