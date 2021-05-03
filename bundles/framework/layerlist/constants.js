// controls if the "add all layers in group to map" toggle is shown
// if the group has more layers than the limit the switch is not shown to user
export const LAYER_GROUP_TOGGLE_LIMIT = 'layerGroupToggleLimit';
export const LAYER_GROUP_TOGGLE_DEFAULTS = {
    // always show toggle
    UNLIMITED: -1,
    // never show toggle
    DISABLE_TOGGLE: 0,
    // max reasonable limit of layers to add to the map with a single click
    SANE_LIMIT: 10
};
