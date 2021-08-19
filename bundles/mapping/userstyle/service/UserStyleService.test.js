import { UserStyleService } from './UserStyleService';

// fake sandbox
const sandbox = {
    findMapLayerFromSelectedMapLayers: () => {}
};

describe('saveUserStyle function ', () => {
    test('adds style correctly when styles with given layerId and style id does not exists', () => {
        const service = new UserStyleService(sandbox);
        const layerId = 1;
        const styleWithMetadata = {
            title: 'My own style',
            name: '1',
            style: {}
        };
        service.saveUserStyle(layerId, styleWithMetadata);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(styleWithMetadata);
    });
    test('adds style correctly when styles with given layerId exists but not with given style id', () => {
        const service = new UserStyleService(sandbox);
        const layerId = 1;
        const styleWithMetadata1 = {
            title: 'First style',
            name: '1',
            style: {}
        };
        const styleWithMetadata2 = {
            title: 'Second style',
            name: '2',
            style: {}
        };
        service.saveUserStyle(layerId, styleWithMetadata1);
        service.saveUserStyle(layerId, styleWithMetadata2);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(styleWithMetadata1);
        expect(result[1]).toEqual(styleWithMetadata2);
    });
    test('saves style correctly when style with given layerId and given style id exists', () => {
        const service = new UserStyleService(sandbox);
        const layerId = 1;
        const originalStyleWithMetadata = {
            title: 'Original name',
            name: '1',
            style: {}
        };
        const updatedStyleWithMetadata = {
            title: 'Updated name',
            name: '1',
            style: {
                someNewField: 'someValue'
            }
        };
        service.saveUserStyle(layerId, originalStyleWithMetadata);
        service.saveUserStyle(layerId, updatedStyleWithMetadata);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(updatedStyleWithMetadata);
    });
});

describe('removeUserStyle function ', () => {
    test('removes user style correctly when found', () => {
        const service = new UserStyleService(sandbox);
        const layerId = 1;
        const styleName = Date.now().toString();
        const styleWithMetadata = {
            title: 'some style',
            name: styleName,
            style: {}
        };
        service.saveUserStyle(layerId, styleWithMetadata);
        const result1 = service.getUserStylesForLayer(layerId);
        expect(result1.length).toEqual(1);
        service.removeUserStyle(layerId, styleName);
        const result2 = service.getUserStylesForLayer(layerId);
        expect(result2.length).toEqual(0);
    });
});
