import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleContext } from 'oskari-ui/util';
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
        this._time = null;
        this._date = null;
        this._log = Oskari.log(className);
        this.loc = Oskari.getMsg.bind(null, 'ShadowingPlugin3d');
        this._toolOpen = false;
        this._element = null;
        this._popupContent = null;
        this._popup = null;
        this._mountPoint = jQuery('<div class="mapplugin shadow-plugin"><div></div></div>');
        this._popupTemplate = jQuery('<div></div>');
        this.stateHandler = new ShadowToolHandler(this.instance);
    }
    getName () {
        return className;
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
                this._time = event.getTime();
                this._date = event.getDate();
            }
        };
    }

    getElement () {
        return this._element;
    }

    getPopUp () {
        return this._popup;
    }

    _teardownUI () {
        if (!this.getElement()) {
            return;
        }
        ReactDOM.unmountComponentAtNode(this.getElement().get(0));
        this.getElement().detach();
    }

    stopPlugin () {
        this._teardownUI();
    }

    _createUI (mapInMobileMode) {
        this._element = this._mountPoint.clone();

        if (mapInMobileMode) {
            this._element.css('display', 'inline-block');
            this._addToMobileToolBar();
        } else {
            this._addToPluginContainer();
        }

        this._createControlElement();

        ReactDOM.render(
            <LocaleContext.Provider value={this.loc}>
                <ShadowControl mapInMobileMode={mapInMobileMode}/>
            </LocaleContext.Provider>, this._element.get(0));
    }

    _createControlElement () {
        const me = this;
        const el = this.getElement();

        el.off('click');
        el.on('click', function (event) {
            me._toggleToolState();
            event.stopPropagation();
        });
    }

    _addToMobileToolBar () {
        const resetMapStateControl = jQuery('.toolbar_mobileToolbar').find('.mobile-reset-map-state');
        jQuery(this._element).insertAfter(resetMapStateControl);
    }

    _addToPluginContainer () {
        const panButtonsControl = jQuery('.mappluginsContent').find('.panbuttons');
        jQuery(this._element).insertAfter(panButtonsControl);
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

    _showPopup () {
        const me = this;
        const popupTitle = this.loc('title');
        const popupContent = this._popupTemplate.clone();
        const popupLocation = 'left';
        const mapmodule = this.getMapModule();
        const popupService = this.getSandbox().getService('Oskari.userinterface.component.PopupService');

        this._popup = popupService.createPopup();
        ReactDOM.render(
            <ShadowTool {... this.stateHandler.getState()}
                mutator={this.stateHandler.getMutator()}
                locale={this.loc}/>,
            popupContent.get(0));
        this._popupContent = popupContent;

        // create close icon
        this._popup.createCloseIcon();
        this._popup.onClose(function () {
            const popup = me.getPopUp();
            const el = me.getElement();
            if (el) {
                el.removeClass('active');
            }
            me._toolOpen = false;
            popup.close(true);
        });

        const themeColours = mapmodule.getThemeColours();
        this._popup.makeDraggable();
        this._popup.addClass('shadowtool__popup');

        this._popup.show(popupTitle, popupContent);
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
