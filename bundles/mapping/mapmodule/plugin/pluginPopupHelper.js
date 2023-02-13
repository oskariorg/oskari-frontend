import { PLACEMENTS } from 'oskari-ui/components/window';

export const getPopupOptions = (plugin) => {
    const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    return {
        id: plugin.getName(),
        placement: getPlacementFromPluginLocation(plugin.getLocation()),
        theme: mapModule.getMapTheme()
    };
};

const getPlacementFromPluginLocation = (pluginLocation) => {
    switch (pluginLocation) {
    case 'top right':
        return PLACEMENTS.TR;
    case 'right top':
        return PLACEMENTS.TR;
    case 'top left':
        return PLACEMENTS.TL;
    case 'left top':
        return PLACEMENTS.TL;
    case 'center top':
        return PLACEMENTS.TOP;
    case 'top center':
        return PLACEMENTS.TOP;
    default:
        return PLACEMENTS.TL;
    };
};
