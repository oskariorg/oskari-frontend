import { SelectedLayersHandler } from './SelectedLayersHandler';
import { initServices } from '../test.util';
import '../../../../../mapping/mapmodule/domain/AbstractLayer';

const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');

const createLayers = (idArray, isBaseLayer) => idArray.map(id => {
    const lyr = new AbstractLayer();
    lyr.setId(id);
    isBaseLayer ? lyr.setAsBaseLayer() : lyr.setAsNormalLayer();
    return lyr;
});

describe('SelectedLayersHandler', () => {
    initServices();
    const instance = {
        getSandbox: () => Oskari.getSandbox('SelectedLayersHandlerTest')
    };
    const baseLayers = createLayers([1, 2, 3], true);
    const overlays = createLayers([11, 12, 13], false);
    const layers = [...baseLayers, ...overlays];
    instance.getSandbox().findAllSelectedMapLayers = () => layers;
    const handler = new SelectedLayersHandler(instance);

    test('ui state initializes correctly', () => {
        expect.assertions(1);
        const state = handler.getState();
        expect(state.layers.length).toBe(6);
    });
});
