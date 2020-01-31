import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { ShadowControl } from '../view/ShadowControl/';
import { ShadowTool, ShadowToolHandler } from '../view/ShadowTool/';

const BasicMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin');
const className = 'Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin';
/**
 * @class Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin
 */
class ShadowingPlugin extends BasicMapModulePlugin {
    constructor (instance) {
        super();
        this.instance = instance;
        this._clazz = className;
        this._name = 'ShadowingPlugin';
        this._defaultLocation = 'top right';
        this._log = Oskari.log(className);
        this.loc = Oskari.getMsg.bind(null, 'ShadowingPlugin3d');
        this._toolOpen = false;
        this._element = null;
        this._index = 90;
        this._popupContent = null;
        this._popup = null;
        this._mountPoint = jQuery('<div class="mapplugin shadow-plugin"><div></div></div>');
        this._mobileMountPoint = jQuery('<div class="tool mobile-time-control-3d"></div>');
        this._popupTemplate = jQuery('<div></div>');

        const sandbox = Oskari.getSandbox();
        const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        const initialTime = mapmodule.getTime ? mapmodule.getTime() : new Date();
        this.stateHandler = new ShadowToolHandler((date, time) => {
            sandbox.postRequestByName('SetTimeRequest', [date, time]);
        }, initialTime);
    }
    getName () {
        return className;
    }
    isOpen () {
        return this._toolOpen;
    }
    _setLayerToolsEditModeImpl () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        if (this.inLayerToolsEditMode()) {
            if (this.isOpen()) {
                this._toggleToolState();
            }
            el.off('click');
        } else {
            this._bindIcon(el);
        }
    }
    /**
     * @method resetState
     * Resets the state in the plugin
     */
    resetState () {
        this.redrawUI(Oskari.util.isMobile());
    }

    redrawUI (mapInMobileMode) {
        this.teardownUI();
        this._createUI(mapInMobileMode);
    }

    _createEventHandlers () {
        return {
            TimeChangedEvent: function (event) {
                this.stateHandler.update(event.getDate(), event.getTime());
            }
        };
    }

    getElement () {
        return this._element;
    }

    getPopUp () {
        return this._popup;
    }

    teardownUI () {
        if (this._popup) {
            this._popup.close(true);
        }
        if (!this.getElement()) {
            return;
        }
        ReactDOM.unmountComponentAtNode(this.getElement().get(0));
        this.removeFromPluginContainer(this.getElement());
    }

    _stopPluginImpl () {
        this.teardownUI();
    }

    unmountReactPopup () {
        ReactDOM.unmountComponentAtNode(this._popupContent.get(0));
    }

    _createUI (mapInMobileMode) {
        let el;
        if (mapInMobileMode) {
            el = this._createMobileControlElement();
            this._addToMobileToolBar(el);
        } else {
            el = this._createControlElement();
            this.addToPluginContainer(el);
        }
        ReactDOM.render(
            <LocaleProvider value={{ bundleKey: 'ShadowingPlugin3d' }}>
                <ShadowControl isMobile={mapInMobileMode} controlIsActive={this._toolOpen}/>
            </LocaleProvider>, el.get(0));
    }

    _createControlElement () {
        const el = this._mountPoint.clone();
        // el.attr('title', 'todo');
        this._bindIcon(el);
        this._element = el;
        return el;
    }
    _createMobileControlElement () {
        const el = this._mobileMountPoint.clone();
        this._bindIcon(el);
        this._element = el;
        return el;
    }
    _bindIcon (el) {
        el.off('click');
        el.on('click', event => {
            this._toggleToolState();
            event.stopPropagation();
        });
    }

    _addToMobileToolBar (el) {
        const mobileToolbar = jQuery('.toolbar_mobileToolbar .toolrow');
        mobileToolbar.append(el);
    }

    _toggleToolState () {
        const el = this.getElement();

        if (this._toolOpen) {
            if (el) {
                el.removeClass('active');
            }
            this._toolOpen = false;
            this._popup.close(true);
        } else {
            if (el) {
                el.addClass('active');
            }
            this._toolOpen = true;
            this._showPopup();
        }
    }

    render () {
        const popupContent = this._popupTemplate.clone();
        ReactDOM.render(
            <LocaleProvider value={{ bundleKey: 'ShadowingPlugin3d' }}>
                <ShadowTool {... this.stateHandler.getState()}
                    controller={this.stateHandler.getController()}
                    isMobile = {Oskari.util.isMobile()}
                />
            </LocaleProvider>,
            popupContent.get(0));
        this._popupContent = popupContent;
    }

    _showPopup () {
        const me = this;
        const popupTitle = this.loc('title');
        const popupLocation = 'left';
        const mapmodule = this.getMapModule();
        const popupService = this.getSandbox().getService('Oskari.userinterface.component.PopupService');

        this._popup = popupService.createPopup();
        this.render();

        // create close icon
        this._popup.createCloseIcon();
        this._popup.onClose(function () {
            const popup = me.getPopUp();
            const el = me.getElement();
            if (el) {
                el.removeClass('active');
            }
            me._toolOpen = false;
            me.unmountReactPopup();
            popup.close(true);
        });

        const themeColours = mapmodule.getThemeColours();
        this._popup.makeDraggable();
        this._popup.addClass('shadowtool__popup');

        this._popup.show(popupTitle, this._popupContent);
        const elem = this.getElement();

        const popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined;
        this._popup.setColourScheme({
            'bgColour': themeColours.backgroundColour,
            'titleColour': themeColours.textColour,
            'iconCls': popupCloseIcon
        });

        this._popup.moveTo(elem, popupLocation, true);
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
