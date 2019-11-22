import { ShadowingPlugin } from './ShadowingPluginClass.ol';

class ShadowingPluginOlcs extends ShadowingPlugin {

}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapmodule.plugin.ShadowingPlugin',
    ShadowingPluginOlcs,
    {
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
