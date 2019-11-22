const BasicMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin');

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.ShadowingPlugin
 */
export class ShadowingPlugin extends BasicMapModulePlugin {
    constructor () {
        super();
        this._clazz = 'Oskari.mapframework.bundle.mapmodule.plugin.ShadowingPlugin';
        this._name = 'ShadowingPlugin';
        this._supportedFormats = {};
        this._time = null;
        this._date = null;
    }
    _createEventHandlers () {
        return {
            TimeChangedEvent: function (event) {
            }
        };
    }

    _createRequestHandlers () {
        return {
            SetTimeRequest: function () {
            }
        };
    }
    /**
     * @method _refresh
     * @param {Object} data
     */
    refresh (data) {
    }
}
