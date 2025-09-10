import React from 'react';
import { MapModuleButton } from '../../mapmodule/MapModuleButton';
import { getPopupOptions } from '../../mapmodule/plugin/pluginPopupHelper';
import { TimeControl3dHandler, showTimeControl3dContainer } from '../view';
import { ControlIcon } from '../view/icons';
import { createRoot } from 'react-dom/client';

const BasicMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin');
/**
 * @class Oskari.mapping.time-control-3d.TimeControl3dPlugin
 */
class TimeControl3dPlugin extends BasicMapModulePlugin {
    constructor (config) {
        super(config);
        this._conf = config || {};
        this._clazz = 'Oskari.mapping.time-control-3d.TimeControl3dPlugin';
        this._name = 'TimeControl3dPlugin';
        this._defaultLocation = 'top right';
        this._log = Oskari.log(this._name);
        this.loc = Oskari.getMsg.bind(null, 'TimeControl3d');
        this._index = 90;
        this._popupControls = null;
        this._mountPoint = jQuery('<div class="mapplugin time-control-3d"/>');
        this._reactRoot = null;
    }

    getName () {
        return this._name;
    }

    isOpen () {
        return !!this._popupControls;
    }

    resetUI () {
        this.closePopup();
    }

    redrawUI () {
        this.refresh();
    }

    _createControlElement () {
        return this._mountPoint.clone();
    }

    teardownUI () {
        this.removeFromPluginContainer(this.getElement());
        this.closePopup();
    }

    _createEventHandlers () {
        return {
            TimeChangedEvent: function (event) {
                this.stateHandler?.update(event.getDate(), event.getTime());
            }
        };
    }

    _startPluginImpl (sandbox) {
        const sb = sandbox || Oskari.getSandbox();
        const mapmodule = sb.findRegisteredModuleInstance('MainMapModule');
        const initialTime = mapmodule.getTime ? mapmodule.getTime() : new Date();
        this.stateHandler = new TimeControl3dHandler(sb, initialTime);

        this.setElement(this._createControlElement());
        this.addToPluginContainer(this.getElement());
        this.refresh();
    }

    _stopPluginImpl () {
        this.teardownUI();
    }

    _toggleToolState () {
        if (this.isOpen()) {
            this.closePopup();
        } else {
            this.showPopup();
        }
    }

    getReactRoot (element) {
        if (!this._reactRoot) {
            this._reactRoot = createRoot(element);
        }
        return this._reactRoot;
    }

    refresh () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        this.getReactRoot(el.get(0)).render(
            <MapModuleButton
                className='t_timecontrol'
                title={this.loc('tooltip')}
                icon={<ControlIcon />}
                onClick={() => this._toggleToolState()}
                iconActive={this.isOpen()}
            />
        );
    }

    showPopup () {
        if (this.isOpen()) {
            return;
        }
        const state = this.stateHandler.getState();
        const controller = this.stateHandler.getController();
        const options = getPopupOptions(this);
        const onClose = () => this.closePopup();
        this._popupControls = showTimeControl3dContainer(state, controller, options, onClose);
        this.refresh();
    }

    closePopup () {
        if (this._popupControls) {
            this._popupControls.close();
        }
        this._popupControls = null;
        this.refresh();
    }
}

Oskari.clazz.defineES('Oskari.mapping.time-control-3d.TimeControl3dPlugin',
    TimeControl3dPlugin,
    {
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
