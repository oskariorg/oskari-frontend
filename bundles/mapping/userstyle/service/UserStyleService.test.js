import { UserStyleService } from './UserStyleService';
import { VectorStyle } from '../../mapmodule/domain/VectorStyle';

// fake sandbox
const sandbox = {
    findMapLayerFromAllAvailable: () => {}
};
const type = 'oskari';
const layerId = 15;
const style = {
    layerId,
    type,
    name: 'own style'
};

describe('saveUserStyle function ', () => {
    const service = new UserStyleService(sandbox);
    test('adds style correctly when styles with given layerId and style id does not exists', () => {
        service.saveUserStyle({ ...style });
        const result = service.getStylesByLayer(layerId);
        expect(result.length).toEqual(1);
        const s1 = { ...result[0] };
        // id is generated if not given
        expect(typeof s1.id).toBe('string');
        delete s1.id;
        expect(s1).toEqual(style);
    });
    test('adds style correctly when styles with given layerId exists but not with given style id', () => {
        const secondStyle = { ...style, id: 2 };
        service.saveUserStyle(secondStyle);
        const result = service.getStylesByLayer(layerId);
        expect(result.length).toEqual(2);
        expect(result[1]).toEqual(secondStyle);
    });
    test('updates style correctly when style with given layerId and given style id exists', () => {
        const name = 'Updated title';
        const styleDef = {
            featureStyle: {
                fill: 'some val'
            }
        };
        const updatedStyle = { ...style, id: 2, name, style: styleDef };
        service.saveUserStyle(updatedStyle);
        const result = service.getStylesByLayer(layerId);
        expect(result.length).toEqual(2);
        const saved = result[1];
        expect(saved).toEqual(updatedStyle);
    });
    test('vector style constructor should handle styles properly', () => {
        const result = service.getStylesByLayer(layerId);
        const s1 = new VectorStyle(result[0]);
        const s2 = new VectorStyle(result[1]);
        expect(s1.isRuntimeStyle()).toBe(true);
        // has number id like backend stored styles
        expect(s2.isRuntimeStyle()).toBe(false);
        expect(s2.getName()).toBe(2);
        expect(s2.getTitle()).toBe('Updated title');
        expect(s2.getFeatureStyle()).toEqual({ fill: 'some val' });
    });
});

describe('several layers', () => {
    const service = new UserStyleService(sandbox);
    test('gets only styles related to layer', () => {
        service.saveUserStyle({ ...style });
        service.saveUserStyle({ ...style });
        service.saveUserStyle({ ...style, layerId: 20 });
        const layers = service.getStylesByLayer(layerId);
        expect(layers.length).toBe(2);
        const all = service.getStyles();
        expect(all.length).toBe(3);
    });
});

describe('removeUserStyle function ', () => {
    const service = new UserStyleService(sandbox);
    test('removes user style correctly when found', () => {
        service.saveUserStyle(style);
        const result1 = service.getStylesByLayer(layerId);
        expect(result1.length).toEqual(1);
        service.removeUserStyle(style.id);
        const result2 = service.getStylesByLayer(layerId);
        expect(result2.length).toEqual(0);
    });
});
