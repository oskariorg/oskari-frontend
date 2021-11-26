// Layer constants
export const LAYER_ID = 'oskariLayerId';
export const LAYER_TYPE = 'oskariLayerType';
export const LAYER_HOVER = 'oskariHoverLayer';
export const LAYER_CLUSTER = 'oskariClusterLayer';
export const WFS_TYPE = 'wfs';
export const VECTOR_TYPE = 'vector';
export const VECTOR_TILE_TYPE = 'vectortile';
// Feature constants
export const FTR_PROPERTY_ID = 'id';
export const WFS_ID_KEY = '_oid';
export const WFS_FTR_ID_KEY = '__fid';
// Service constants
export const SERVICE_LAYER_REQUEST = 'layerRequest';
export const SERVICE_HOVER = 'hover';
export const SERVICE_CLICK = 'click';

// WFS render modes
// Note! integration/admin-layerselector bundle doesn't use these constants so remember to update values there if required
export const RENDER_MODE_MVT = 'mvt';
export const RENDER_MODE_VECTOR = 'vector';

export const FEATURE_QUERY_ERRORS = {
    NOT_FOUND: 'not_found',
    NOT_SELECTED: 'not_selected',
    HIDDEN: 'hidden',
    SCALE: 'scale',
    OUT_OF_BOUNDS: 'out_of_bounds'
};
