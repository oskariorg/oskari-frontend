import { PLACEMENTS } from 'oskari-ui/components/window';
import { getPopupOptions } from '../../../mapping/mapmodule/plugin/pluginPopupHelper';

export const getContainerOptions = (togglePlugin) => {
    const opts = togglePlugin ? getPopupOptions(togglePlugin) : {};
    return {
        placement: opts.placement || PLACEMENTS.BR,
        id: 'statsgrid_classification'
    };
};

export const createSeriesControlPlugin = (sandbox, stateHandler) => {
    const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
    const plugin = Oskari.clazz.create('Oskari.statistics.statsgrid.SeriesControlPlugin', sandbox, stateHandler);
    mapModule.registerPlugin(plugin);
    mapModule.startPlugin(plugin);
    return plugin;
};

export const createTogglePlugin = (sandbox, viewHandler) => {
    const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
    const plugin = Oskari.clazz.create('Oskari.statistics.statsgrid.TogglePlugin', viewHandler);
    mapModule.registerPlugin(plugin);
    mapModule.startPlugin(plugin);
    return plugin;
};
