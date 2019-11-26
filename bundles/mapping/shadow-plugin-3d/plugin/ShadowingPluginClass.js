const BasicMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin');
const className = 'Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin';
//     this.__index = 0;
//     this.__sandbox = sandbox;
//     this.__mapmodule = mapmodule;
//     this.__loc = localization[this.group];
//     this.__instance = instance;
//     this.__plugin = null;
//     this.__tool = null;
//     this.__handlers = handlers;
//     this.__started = false;
//     this.state = {
//         enabled: false,
//         mode: null
//     };
/**
 * @class Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin
 */
class ShadowingPlugin extends BasicMapModulePlugin {
    constructor (mapmodule, sandbox) {
        super();
        this._clazz = className;
        this._name = 'ShadowingPlugin';
        this._defaultLocation = 'top right';
        this._supportedFormats = {};
        this._time = null;
        this._date = null;
        this._mapmodule = mapmodule;
        this._sandbox = sandbox;
        this._log = Oskari.log(className);
        this.loc = Oskari.getMsg.bind(null, 'ShadowingPlugin3d');
        this._mountPoint = jQuery('<div class="mapplugin shadow-plugin"><div></div></div>');
    }
    getName () {
        return className;
    }
    _createEventHandlers () {
        return {
            TimeChangedEvent: function (event) {
                this._time = event.getTime();
                this._date = event.getDate();
            }
        };
    }
}

Oskari.clazz.defineES('Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin',
    ShadowingPlugin,
    {
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
