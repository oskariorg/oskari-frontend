import './request/MapLayerVisibilityRequest';
import './request/MapLayerVisibilityRequestHandler.ol';
import './event/MapLayerVisibilityChangedEvent';

import './request/MapMoveByLayerContentRequest';
import './request/MapMoveByLayerContentRequestHandler';

import { LayersPlugin } from './LayersPluginClass.ol';

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin',
    LayersPlugin,
    {
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
