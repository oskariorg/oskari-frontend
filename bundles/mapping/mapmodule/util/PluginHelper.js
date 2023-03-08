

/**
 * Get a sorted list of plugins. This is used to control order of elements in the UI.
 * Functionality shouldn't assume order.
 * @param {Object} where object values are the plugins to sort
 * @return {Oskari.mapframework.ui.module.common.mapmodule.Plugin[]} index ordered list of registered plugins
 */
export const getSortedPlugins = (pluginInstances = {}) => {
    const plugins = Object.values(pluginInstances);
    plugins.sort((a, b) => getPluginIndex(a) - getPluginIndex(b));
    return plugins;
};

const getPluginIndex = (plugin) => {
    if (typeof plugin?.getIndex !== 'function') {
        // index not defined, start after ones that have indexes
        // This is just for the UI order, functionality shouldn't assume order
        return 99999999999;
    }
    return plugin.getIndex();
};

export const getPluginsWithUI = (pluginInstances = {}) => {
    const plugins = Object.values(pluginInstances);
    return plugins.filter((plugin = {}) => !!plugin?.hasUI());
};

export const refreshPluginsWithUI = (pluginInstances = {}) => {
    return getPluginsWithUI(pluginInstances).forEach((plugin) => {
        if (typeof plugin.changeToolStyle === 'function') {
            // TODO: is this the function that we should use?
            plugin.changeToolStyle();
        }
    });
};