export const LAYER_TYPE = {
    BASE: 'type-base',
    WMS: 'type-wms',
    WMTS: 'type-wms',
    WFS_MANUAL: 'type-wfs-manual',
    WFS: 'type-wfs',
    VECTOR: 'type-wms',
    TIMESERIES: 'type-timeseries'
};
export const ICON_CLASS = {
    OK: 'backendstatus-ok',
    DOWN: 'backendstatus-down',
    ERROR: 'backendstatus-error',
    MAINTENANCE: 'backendstatus-maintenance',
    UNKNOWN: 'backendstatus-unknown',
    UNSTABLE: 'backendstatus-unstable'
};
export const TOOLTIP = {
    ...LAYER_TYPE
};
