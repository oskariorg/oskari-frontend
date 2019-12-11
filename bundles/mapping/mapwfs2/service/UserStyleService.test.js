import { UserStyleService } from './UserStyleService';

describe('saveUserStyle function ', () => {
    test('adds style correctly when styles with given layerId and style id does not exists', () => {
        const service = new UserStyleService();
        const layerId = 1;
        const style = {
            id: 1
        };
        service.saveUserStyle(layerId, style);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(style);
    });
    test('adds style correctly when styles with given layerId exists but not with given style id', () => {
        const service = new UserStyleService();
        const layerId = 1;
        const style1 = {
            id: 1
        };
        const style2 = {
            id: 2
        };
        service.saveUserStyle(layerId, style1);
        service.saveUserStyle(layerId, style2);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(style1);
        expect(result[1]).toEqual(style2);
    });
    test('saves style correctly when style with given layerId and given style id exists', () => {
        const service = new UserStyleService();
        const layerId = 1;
        const originalStyle = {
            id: 1
        };
        const updatedStyle = {
            id: 1,
            someNewField: 'someValue'
        };
        service.saveUserStyle(layerId, originalStyle);
        service.saveUserStyle(layerId, updatedStyle);
        const result = service.getUserStylesForLayer(layerId);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(updatedStyle);
    });
});

describe('removeUserStyle function ', () => {
    test('removes user style correctly when found', () => {
        const service = new UserStyleService();
        const layerId = 1;
        const styleId = 1;
        const style = {
            id: styleId
        };
        service.saveUserStyle(layerId, style);
        const result1 = service.getUserStylesForLayer(layerId);
        expect(result1.length).toEqual(1);
        service.removeUserStyle(layerId, styleId);
        const result2 = service.getUserStylesForLayer(layerId);
        expect(result2.length).toEqual(0);
    });
});
