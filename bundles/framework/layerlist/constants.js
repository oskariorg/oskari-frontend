// controls if the "add all layers in group to map" toggle is shown
// if the group has more layers than the limit the switch is not shown to user
export const LAYER_GROUP_TOGGLE_LIMIT = 'layerGroupToggleLimit';
export const LAYER_GROUP_TOGGLE_DEFAULTS = {
    UNLIMITED: -1,
    DISABLE_TOGGLE: 0,
    SANE_LIMIT: 10
}