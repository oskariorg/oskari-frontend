import { LAYER_PREFIX } from '../constants';

export const getCategoryId = (layerId) => {
    if (typeof layerId === 'string') {
        return Number.parseInt(layerId.substring(layerId.indexOf('_') + 1));
    }
    return layerId;
};

export const getLayerId = (categoryId) => LAYER_PREFIX + '_' + categoryId;

export const layerToCategory = (layer) => {
    const layerId = layer.getId();
    return {
        categoryId: getCategoryId(layerId),
        layerId,
        name: layer.getName(),
        isDefault: !!layer.getOptions().isDefault
    };
};
